import crypto from "crypto";
import fs from "fs";
import path from "path";

export type DownloadLinkRecord = {
  token: string;
  slug: string;
  email: string;
  fileKey: string;
  expiresAt: string;
  createdAt: string;
};

const dataDir = path.join(process.cwd(), "data");
const linksFile = path.join(dataDir, "download-links.json");

function ensureLinksFile() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(linksFile)) {
    fs.writeFileSync(linksFile, "[]", "utf8");
  }
}

function readLinks(): DownloadLinkRecord[] {
  ensureLinksFile();

  try {
    const raw = fs.readFileSync(linksFile, "utf8").trim();

    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed as DownloadLinkRecord[];
  } catch (error) {
    console.error("READ DOWNLOAD LINKS ERROR:", error);
    return [];
  }
}

function writeLinks(links: DownloadLinkRecord[]) {
  ensureLinksFile();
  fs.writeFileSync(linksFile, JSON.stringify(links, null, 2), "utf8");
}

export function createDownloadToken(params: {
  slug: string;
  email: string;
  fileKey: string;
  validHours?: number;
}) {
  const token = crypto.randomBytes(24).toString("hex");
  const now = new Date();
  const expiresAt = new Date(
    now.getTime() + (params.validHours ?? 24) * 60 * 60 * 1000
  );

  const record: DownloadLinkRecord = {
    token,
    slug: params.slug,
    email: params.email,
    fileKey: params.fileKey,
    createdAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
  };

  const links = readLinks();
  links.push(record);
  writeLinks(links);

  return record;
}

export function getDownloadByToken(token: string) {
  const links = readLinks();
  return links.find((item) => item.token === token) || null;
}

export function isDownloadExpired(expiresAt: string) {
  return new Date(expiresAt).getTime() < Date.now();
}

export function cleanupExpiredDownloads() {
  const links = readLinks();
  const activeLinks = links.filter(
    (item) => new Date(item.expiresAt).getTime() >= Date.now()
  );

  if (activeLinks.length !== links.length) {
    writeLinks(activeLinks);
  }

  return activeLinks;
}