import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { createDownloadToken } from "@/lib/download";
import { sendDownloadEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const orderId = String(body?.orderId || body?.order_id || "").trim();
    const slug = String(body?.slug || "").trim();
    const statusId = String(body?.statusId || body?.status_id || "").trim();
    const billCode = String(body?.billCode || body?.billcode || "").trim();

    if (!orderId) {
      return NextResponse.json(
        { error: "orderId tidak sah." },
        { status: 400 }
      );
    }

    const orderRes = await pool.query(
      `
      select
        order_id,
        slug,
        product_title,
        amount,
        customer_name,
        customer_email,
        status
      from orders
      where order_id = $1
      limit 1
      `,
      [orderId]
    );

    if (orderRes.rowCount === 0) {
      return NextResponse.json(
        { error: "Order tidak dijumpai." },
        { status: 404 }
      );
    }

    const order = orderRes.rows[0];

    if (slug && order.slug && slug !== order.slug) {
      return NextResponse.json(
        { error: "Slug order tidak sepadan." },
        { status: 400 }
      );
    }

    if (statusId && statusId !== "1") {
      return NextResponse.json(
        { error: "Status pembayaran tidak berjaya." },
        { status: 400 }
      );
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    if (order.status === "paid") {
      const tokenRecord = await createDownloadToken({
        orderId,
        validHours: 24,
      });

      const downloadUrl = `${baseUrl}/download?token=${tokenRecord.token}`;

      return NextResponse.json({
        ok: true,
        success: true,
        alreadyPaid: true,
        message: "Order ini sudah diproses. Pautan muat turun baharu dijana.",
        downloadUrl,
        orderId: order.order_id,
        slug: order.slug,
        billCode,
      });
    }

    await pool.query(
      `
      update orders
      set status = 'paid',
          paid_at = now()
      where order_id = $1
      `,
      [orderId]
    );

    const tokenRecord = await createDownloadToken({
      orderId,
      validHours: 24,
    });

    const downloadUrl = `${baseUrl}/download?token=${tokenRecord.token}`;

    await sendDownloadEmail({
      to: order.customer_email,
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

    return NextResponse.json({
      ok: true,
      success: true,
      message: "Payment finalized dan email telah dihantar.",
      downloadUrl,
      orderId: order.order_id,
      slug: order.slug,
      billCode,
    });
  } catch (error) {
    console.error("FINALIZE_PAYMENT_ERROR", error);

    return NextResponse.json(
      { error: "Gagal finalize payment." },
      { status: 500 }
    );
  }
}