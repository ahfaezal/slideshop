import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import {
  getDownloadByToken,
  isDownloadExpired,
  incrementDownloadCount,
} from "@/lib/download";
import { DOWNLOAD_MAP } from "@/lib/download-map";

const MAX_DOWNLOADS = 3;

export async function GET(
  req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  const record = await getDownloadByToken(token);

  if (!record) {
    return NextResponse.json(
      { error: "Token download tidak sah." },
      { status: 404 }
    );
  }

  if (record.status !== "paid") {
    return NextResponse.json(
      { error: "Pembayaran belum disahkan." },
      { status: 403 }
    );
  }

  if (isDownloadExpired(record.expires_at)) {
    return NextResponse.json(
      { error: "Link download telah tamat tempoh." },
      { status: 410 }
    );
  }

  if (record.used_count >= MAX_DOWNLOADS) {
    return NextResponse.json(
      { error: "Had muat turun telah dicapai." },
      { status: 403 }
    );
  }

  const product = DOWNLOAD_MAP[record.slug];

  if (!product) {
    return NextResponse.json(
      { error: "Produk download tidak ditemui." },
      { status: 404 }
    );
  }

  const filePath = path.join(
    process.cwd(),
    "protected-downloads",
    product.fileKey
  );

  if (!fs.existsSync(filePath)) {
    return NextResponse.json(
      { error: "Fail tidak ditemui pada server." },
      { status: 404 }
    );
  }

  await incrementDownloadCount(token);

  const fileBuffer = fs.readFileSync(filePath);
  const fileName = path.basename(filePath);

  return new NextResponse(fileBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Cache-Control": "no-store",
    },
  });
}