import { NextRequest, NextResponse } from "next/server";
import {
  getDownloadByToken,
  incrementDownloadCount,
  isDownloadExpired,
} from "@/lib/download";
import { DOWNLOAD_MAP } from "@/lib/download-map";
import { getPresignedDownloadUrl } from "@/lib/s3";

const MAX_DOWNLOADS = 3;

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        {
          error:
            "Pautan muat turun tidak sah. Sila gunakan pautan yang dihantar melalui email anda.",
        },
        { status: 400 }
      );
    }

    const record = await getDownloadByToken(token);

    if (!record) {
      return NextResponse.json(
        {
          error:
            "Pautan muat turun ini tidak sah atau tidak lagi tersedia. Sila semak semula email anda.",
        },
        { status: 404 }
      );
    }

    if (record.status !== "paid") {
      return NextResponse.json(
        {
          error:
            "Pembayaran anda belum disahkan sepenuhnya. Sila cuba lagi sebentar atau hubungi kami jika masalah berterusan.",
        },
        { status: 403 }
      );
    }

    if (isDownloadExpired(record.expires_at)) {
      return NextResponse.json(
        {
          error:
            "Pautan muat turun ini telah tamat tempoh. Sila hubungi kami jika anda memerlukan bantuan lanjut.",
        },
        { status: 403 }
      );
    }

    if (record.used_count >= MAX_DOWNLOADS) {
      return NextResponse.json(
        {
          error: `Pautan ini telah mencapai had maksimum muat turun (${MAX_DOWNLOADS} kali). Sila hubungi kami jika anda memerlukan bantuan.`,
        },
        { status: 403 }
      );
    }

    const product = DOWNLOAD_MAP[record.slug];

    if (!product) {
      return NextResponse.json(
        {
          error:
            "Produk yang anda cuba muat turun tidak ditemui. Sila hubungi kami untuk semakan lanjut.",
        },
        { status: 404 }
      );
    }

    const fileKey = product.fileKey;
    const downloadName = fileKey.split("/").pop() || "slideshop-file.zip";

    const signedUrl = await getPresignedDownloadUrl(fileKey, downloadName);

    await incrementDownloadCount(token);

    return NextResponse.json({
      success: true,
      url: signedUrl,
    });
  } catch (error) {
    console.error("DOWNLOAD_ERROR:", error);

    return NextResponse.json(
      {
        error:
          "Maaf, berlaku ralat semasa memuat turun fail. Sila cuba lagi atau hubungi kami jika masalah berterusan.",
      },
      { status: 500 }
    );
  }
}