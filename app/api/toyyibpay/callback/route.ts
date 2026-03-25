import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
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

    console.log("CALLBACK PAYLOAD FULL:", payload);

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

    const orderRes = await pool.query(
      `
      select
        order_id,
        bill_code,
        slug,
        product_title,
        amount,
        customer_name,
        customer_email,
        status
      from orders
      where bill_code = $1
      limit 1
      `,
      [billCode]
    );

    if (orderRes.rowCount === 0) {
      return NextResponse.json(
        { ok: false, error: "Order tidak dijumpai." },
        { status: 404 }
      );
    }

    const order = orderRes.rows[0];

    if (String(statusId) !== "1") {
      await pool.query(
        `
        update orders
        set status = 'failed'
        where bill_code = $1
        `,
        [billCode]
      );

      return NextResponse.json({
        ok: true,
        message: "Pembayaran belum berjaya.",
      });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    if (!baseUrl) {
      return NextResponse.json(
        { ok: false, error: "NEXT_PUBLIC_BASE_URL belum diset." },
        { status: 500 }
      );
    }

    const recipientEmail = order.customer_email || fallbackEmail;

    if (!recipientEmail) {
      return NextResponse.json(
        { ok: false, error: "Email pelanggan tidak dijumpai." },
        { status: 400 }
      );
    }

    if (order.status === "paid") {
      return NextResponse.json({
        ok: true,
        message: "Callback sudah diproses sebelum ini.",
      });
    }

    await pool.query(
      `
      update orders
      set status = 'paid',
          paid_at = now()
      where bill_code = $1
      `,
      [billCode]
    );

    const tokenRecord = await createDownloadToken({
      orderId: order.order_id,
      validHours: 48,
    });

    const downloadUrl = `${baseUrl}/download?token=${tokenRecord.token}`;

    await sendDownloadEmail({
      to: recipientEmail,
      name: order.customer_name,
      items: [
        {
          title: order.product_title,
          price: Number(order.amount),
        },
      ],
      total: Number(order.amount),
      downloadUrl,
      orderNo: order.order_id,
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