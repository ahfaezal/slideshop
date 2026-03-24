import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

type DownloadRecord = {
  token: string;
  email: string;
  slug: string;
  fileName: string;
  expiresAt: string;
  downloadCount: number;
  maxDownloads: number;
  createdAt: string;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const email = String(body?.email || "").trim().toLowerCase();
    const slug = String(body?.slug || "").trim();
    const fileName = String(body?.fileName || "").trim();

    if (!email || !slug || !fileName) {
      return NextResponse.json(
        { error: "Maklumat link download tidak lengkap." },
        { status: 400 }
      );
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(
      Date.now() + 48 * 60 * 60 * 1000
    ).toISOString();

    const record: DownloadRecord = {
      token,
      email,
      slug,
      fileName,
      expiresAt,
      downloadCount: 0,
      maxDownloads: 2,
      createdAt: new Date().toISOString(),
    };

    const filePath = path.join(process.cwd(), "data", "download-links.json");

    let existing: DownloadRecord[] = [];

    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      existing = JSON.parse(raw || "[]");
    }

    existing.push(record);

    fs.writeFileSync(filePath, JSON.stringify(existing, null, 2));

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    if (!baseUrl) {
      return NextResponse.json(
        { error: "NEXT_PUBLIC_BASE_URL belum diset." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      downloadUrl: `${baseUrl}/download?token=${token}`,
      expiresAt,
    });
  } catch (error) {
    console.error("Generate download link error:", error);
    return NextResponse.json(
      { error: "Gagal jana link download." },
      { status: 500 }
    );
  }
}