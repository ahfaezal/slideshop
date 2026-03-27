import { NextResponse } from "next/server";
import { sendDownloadEmail } from "@/lib/email";

export async function GET() {
  try {
    const result = await sendDownloadEmail({
      to: "pfhberhad@gmail.com", // tukar kepada email yang anda mahu test
      name: "Faezal",
      items: [
        {
          title: "Test Slide Download - Proposal Pack",
          price: 9.9,
        },
      ],
      total: 9.9,
      downloadUrl: "http://localhost:3000/download?token=TEST_TOKEN_123",
      orderNo: "TEST-ORDER-001",
    });

    return NextResponse.json({
      ok: true,
      message: "Test email berjaya dihantar.",
      result,
    });
  } catch (error) {
    console.error("TEST_EMAIL_ERROR", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Gagal hantar test email.",
      },
      { status: 500 }
    );
  }
}