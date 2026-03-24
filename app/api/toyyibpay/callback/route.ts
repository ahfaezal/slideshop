import { NextRequest, NextResponse } from "next/server";
import { getOrderByBillCode, updateOrderByBillCode } from "@/lib/order";
import { getProductBySlug } from "@/lib/download-map";
import { createDownloadToken } from "@/lib/download";
import { sendDownloadEmail } from "@/lib/email";

function pick(payload: Record<string, string>, keys: string[]) {
  for (const key of keys) {
    const value = payload[key];
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      return String(value).trim();
    }
  }
  return "";
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    let payload: Record<string, string> = {};

    if (contentType.includes("application/json")) {
      const json = await req.json();
      payload = Object.fromEntries(
        Object.entries(json || {}).map(([k, v]) => [k, String(v)])
      );
    } else {
      const form = await req.formData();
      payload = Object.fromEntries(
        Array.from(form.entries()).map(([key, value]) => [key, String(value)])
      );
    }

    const billCode = pick(payload, ["billcode", "billCode"]);
    const statusId = pick(payload, ["status_id", "statusId", "status"]);
    const transactionId = pick(payload, ["transaction_id", "transactionId"]);
    const paidAmount = pick(payload, ["amount", "billamount"]);
    const fallbackEmail = pick(payload, ["email", "billEmail"]);

    console.log("=== PAYMENT CALLBACK START ===");
    console.log("billCode:", billCode);
    console.log("statusId:", statusId);
    console.log("transactionId:", transactionId);
    console.log("paidAmount:", paidAmount);
    console.log("fallbackEmail:", fallbackEmail);

    if (!billCode) {
      return NextResponse.json(
        { ok: false, error: "Bill code tidak diterima." },
        { status: 400 }
      );
    }

    const order = getOrderByBillCode(billCode);

    if (!order) {
      return NextResponse.json(
        { ok: false, error: "Order tidak dijumpai." },
        { status: 404 }
      );
    }

    if (String(statusId) !== "1") {
      updateOrderByBillCode(billCode, {
        status: "failed",
        transactionId,
      });

      return NextResponse.json({
        ok: true,
        message: "Pembayaran belum berjaya.",
      });
    }

    const product = getProductBySlug(order.slug);

    if (!product) {
      return NextResponse.json(
        { ok: false, error: "Produk tidak dijumpai dalam download map." },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    if (!baseUrl) {
      return NextResponse.json(
        { ok: false, error: "NEXT_PUBLIC_BASE_URL belum diset." },
        { status: 500 }
      );
    }

    if (order.emailSent) {
      return NextResponse.json({
        ok: true,
        message: "Callback sudah diproses sebelum ini.",
        downloadHint: `${baseUrl}/download/[existing-token]`,
      });
    }

    const recipientEmail = order.customerEmail || fallbackEmail;

    if (!recipientEmail) {
      return NextResponse.json(
        { ok: false, error: "Email pelanggan tidak dijumpai." },
        { status: 400 }
      );
    }

    const tokenRecord = createDownloadToken({
      slug: order.slug,
      email: recipientEmail,
      fileKey: product.fileKey,
      validHours: 24,
    });

    const downloadUrl = `${baseUrl}/download/${tokenRecord.token}`;

    await sendDownloadEmail({
      to: recipientEmail,
      name: order.customerName,
      items: [
        {
          title: order.productTitle,
          price: order.amount,
        },
      ],
      total: order.amount,
      downloadUrl,
      orderNo: order.orderId,
    });

    updateOrderByBillCode(billCode, {
      status: "paid",
      paidAt: new Date().toISOString(),
      emailSent: true,
      transactionId,
    });

    console.log("Email download dihantar ke:", recipientEmail);
    console.log("=== PAYMENT CALLBACK END ===");

    return NextResponse.json({
      ok: true,
      message: "Bayaran berjaya dan email download telah dihantar.",
      downloadUrl,
    });
  } catch (error) {
    console.error("CALLBACK ERROR:", error);
    return NextResponse.json(
      { ok: false, error: "Gagal proses callback." },
      { status: 500 }
    );
  }
}