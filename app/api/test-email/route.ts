import { NextResponse } from "next/server";
import { sendDownloadEmail } from "@/lib/email";

export async function GET() {
  await sendDownloadEmail({
    to: "EMAIL_SENDIRI@gmail.com",
    name: "Faezal",
    items: [{ title: "Test Slide", price: 10 }],
    total: 10,
    downloadUrl: "https://slideshop.my/test-download",
    orderNo: "TEST123",
  });

  return NextResponse.json({ ok: true });
}