import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

type DownloadRecord = {
  token: string;
  email: string;
  slug: string;
  fileName: string;
  expiresAt: string;
  downloadCount: number;
  maxDownloads: number;
  createdAt: string;
  billcode?: string;
  orderId?: string;
  amount?: string;
};

function ensureArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function normalizeFileName(fileName: string) {
  return String(fileName || "").replace(/^downloads\//, "").trim();
}

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await context.params;

    if (!token) {
      return NextResponse.json(
        { ok: false, error: "Token tidak sah." },
        { status: 400 }
      );
    }

    const projectRoot = process.cwd();
    const linksPath = path.join(projectRoot, "data", "download-links.json");

    console.log("=== DOWNLOAD DEBUG START ===");
    console.log("PROJECT ROOT:", projectRoot);
    console.log("LINKS PATH:", linksPath);
    console.log("TOKEN:", token);

    if (!fs.existsSync(linksPath)) {
      console.log("download-links.json tidak wujud.");
      return NextResponse.json(
        { ok: false, error: "Rekod download tidak dijumpai." },
        { status: 404 }
      );
    }

    const raw = fs.readFileSync(linksPath, "utf-8");
    const parsed = JSON.parse(raw || "[]");
    const records: DownloadRecord[] = ensureArray<DownloadRecord>(parsed);

    const recordIndex = records.findIndex((item) => item.token === token);

    if (recordIndex === -1) {
      console.log("Token tidak dijumpai dalam download-links.json");
      return NextResponse.json(
        { ok: false, error: "Link download tidak sah atau tidak wujud." },
        { status: 404 }
      );
    }

    const record = records[recordIndex];

    console.log("DOWNLOAD RECORD:", record);

    if (new Date(record.expiresAt).getTime() < Date.now()) {
      console.log("Link telah tamat tempoh:", record.expiresAt);
      return NextResponse.json(
        { ok: false, error: "Link download telah tamat tempoh." },
        { status: 410 }
      );
    }

    if (record.downloadCount >= record.maxDownloads) {
      console.log("Had download dicapai:", {
        downloadCount: record.downloadCount,
        maxDownloads: record.maxDownloads,
      });
      return NextResponse.json(
        { ok: false, error: "Had maksimum download telah dicapai." },
        { status: 403 }
      );
    }

    const normalizedFileName = normalizeFileName(record.fileName);
    const filePath = path.join(
      projectRoot,
      "protected-downloads",
      normalizedFileName
    );

    console.log("NORMALIZED FILE NAME:", normalizedFileName);
    console.log("FILE PATH:", filePath);
    console.log("FILE EXISTS?:", fs.existsSync(filePath));

    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        {
          ok: false,
          error: "Fail tidak dijumpai di server.",
          debug: {
            projectRoot,
            expectedFilePath: filePath,
            originalFileName: record.fileName,
            normalizedFileName,
          },
        },
        { status: 404 }
      );
    }

    const fileBuffer = fs.readFileSync(filePath);

    records[recordIndex] = {
      ...record,
      fileName: normalizedFileName,
      downloadCount: record.downloadCount + 1,
    };

    fs.writeFileSync(linksPath, JSON.stringify(records, null, 2));

    const ext = path.extname(normalizedFileName).toLowerCase();

    let contentType = "application/octet-stream";
    if (ext === ".pdf") {
      contentType = "application/pdf";
    } else if (ext === ".pptx") {
      contentType =
        "application/vnd.openxmlformats-officedocument.presentationml.presentation";
    } else if (ext === ".zip") {
      contentType = "application/zip";
    }

    console.log("DOWNLOAD BERJAYA:", {
      fileName: normalizedFileName,
      downloadCountBefore: record.downloadCount,
      downloadCountAfter: record.downloadCount + 1,
    });
    console.log("=== DOWNLOAD DEBUG END ===");

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${normalizedFileName}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("DOWNLOAD ERROR:", error);
    return NextResponse.json(
      { ok: false, error: "Gagal memproses download." },
      { status: 500 }
    );
  }
}