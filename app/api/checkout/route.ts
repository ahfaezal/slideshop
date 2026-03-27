import { NextResponse } from "next/server";
import crypto from "crypto";
import { pool } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const slug = String(body?.slug || "").trim();
    const productTitle = String(body?.productTitle || "").trim();
    const name = String(body?.name || "").trim();
    const email = String(body?.email || "").trim();
    const phone = String(body?.phone || "").trim();
    const amount = Number(body?.amount || 0);

    if (!slug || !productTitle || !name || !email || amount <= 0) {
      return NextResponse.json(
        { error: "Maklumat checkout tidak lengkap." },
        { status: 400 }
      );
    }

    const orderId = crypto.randomUUID();
    const billCode = `pending_${Date.now()}`;

    await pool.query(
      `
      insert into orders
      (
        order_id,
        bill_code,
        slug,
        product_title,
        amount,
        customer_name,
        customer_email,
        customer_phone,
        status
      )
      values ($1, $2, $3, $4, $5, $6, $7, $8, 'pending')
      `,
      [orderId, billCode, slug, productTitle, amount, name, email, phone]
    );

    return NextResponse.json({
      ok: true,
      success: true,
      orderId,
      slug,
      productTitle,
      amount,
      customer: {
        name,
        email,
        phone,
      },
    });
  } catch (error) {
    console.error("CHECKOUT_CREATE_ORDER_ERROR", error);

    return NextResponse.json(
      { error: "Gagal cipta order checkout." },
      { status: 500 }
    );
  }
}