import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { getDownloadByToken, isDownloadExpired } from "@/lib/download";

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

  if (isDownloadExpired(record.expiresAt)) {
    return NextResponse.json(
      { error: "Link download telah tamat tempoh." },
      { status: 410 }
    );
  }

  const filePath = path.join(
    process.cwd(),
    "protected-downloads",
    record.fileKey
  );

  if (!fs.existsSync(filePath)) {
    return NextResponse.json(
      { error: "Fail tidak ditemui pada server." },
      { status: 404 }
    );
  }

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