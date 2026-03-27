import crypto from "crypto";
import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getProductBySlug } from "@/lib/download-map";

type CartItem = {
  slug: string;
  title: string;
  price: string | number;
};

function sanitizeText(input: string, maxLength: number) {
  return input
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const name = String(body?.name || "").trim();
    const email = String(body?.email || "").trim();
    const phone = String(body?.phone || "").trim();

    // ✅ sistem baru guna "slug"
    const slug = String(body?.slug || "").trim();

    // optional: masih support items kalau anda mahu kekalkan
    const items = Array.isArray(body?.items) ? (body.items as CartItem[]) : [];

    if (!name || !email || !slug) {
      return NextResponse.json(
        { error: "Maklumat checkout tidak lengkap." },
        { status: 400 }
      );
    }

    // ✅ ambil product dari sistem dynamic
    const product = getProductBySlug(slug);

    if (!product) {
      return NextResponse.json(
        { error: "Produk tidak dijumpai." },
        { status: 404 }
      );
    }

    const secretKey = process.env.TOYYIB_SECRET_KEY;
    const categoryCode = process.env.TOYYIB_CATEGORY_CODE;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const isMockPayment = process.env.MOCK_PAYMENT === "true";

    if (!baseUrl) {
      return NextResponse.json(
        { error: "NEXT_PUBLIC_BASE_URL belum diset." },
        { status: 500 }
      );
    }

    const amount = Number(product.price);
    const orderId = crypto.randomUUID();

    if (Number.isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { error: "Harga produk tidak sah." },
        { status: 400 }
      );
    }

    // ✅ MOCK PAYMENT
    if (isMockPayment) {
      const billCode = `MOCK_${Date.now()}`;

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
        [orderId, billCode, product.slug, product.title, amount, name, email, phone]
      );

      const paymentUrl = `${baseUrl}/payment/success?mock=1&orderId=${encodeURIComponent(
        orderId
      )}`;

      return NextResponse.json({
        ok: true,
        mock: true,
        orderId,
        billCode,
        paymentUrl,
      });
    }

    if (!secretKey || !categoryCode) {
      return NextResponse.json(
        { error: "Konfigurasi ToyyibPay belum lengkap." },
        { status: 500 }
      );
    }

    const billAmount = Math.round(amount * 100);

    const billName =
      items.length === 1
        ? sanitizeText(items[0].title || product.title || "Slideshop Purchase", 30)
        : sanitizeText(
            items.length > 1
              ? `Slideshop ${items.length} items`
              : product.title || "Slideshop Purchase",
            30
          );

    const billDescription =
      items.length === 1
        ? sanitizeText(`Pembelian ${items[0].title}`, 100)
        : sanitizeText(
            items.length > 1
              ? `Pembelian ${items.length} item Slideshop`
              : `Pembelian ${product.title}`,
            100
          );

    // simpan order dulu sebagai pending
    const tempReference = `REF_${Date.now()}`;

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
      [
        orderId,
        tempReference,
        product.slug,
        product.title,
        amount,
        name,
        email,
        phone,
      ]
    );

    // ✅ sistem baru: guna slug, bukan product_slug
    const returnUrl = `${baseUrl}/checkout/success?slug=${encodeURIComponent(
      product.slug
    )}&order_id=${encodeURIComponent(orderId)}`;

    const callbackUrl = `${baseUrl}/api/toyyibpay/callback`;

    const formData = new URLSearchParams();
    formData.append("userSecretKey", secretKey);
    formData.append("categoryCode", categoryCode);
    formData.append("billName", billName);
    formData.append("billDescription", billDescription);
    formData.append("billPriceSetting", "1");
    formData.append("billPayorInfo", "1");
    formData.append("billAmount", String(billAmount));
    formData.append("billReturnUrl", returnUrl);
    formData.append("billCallbackUrl", callbackUrl);
    formData.append("billExternalReferenceNo", orderId);
    formData.append("billTo", name);
    formData.append("billEmail", email);
    formData.append("billPhone", phone || "");
    formData.append("billPaymentChannel", "2");

    const tpRes = await fetch("https://toyyibpay.com/index.php/api/createBill", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
      cache: "no-store",
    });

    const rawText = await tpRes.text();

    let result: any = null;
    try {
      result = JSON.parse(rawText);
    } catch {
      await pool.query(`delete from orders where order_id = $1`, [orderId]);

      return NextResponse.json(
        { error: "Respons ToyyibPay tidak sah.", rawText },
        { status: 500 }
      );
    }

    if (!tpRes.ok || !Array.isArray(result) || !result[0]?.BillCode) {
      await pool.query(`delete from orders where order_id = $1`, [orderId]);

      return NextResponse.json(
        { error: "Gagal create bill di ToyyibPay.", detail: result },
        { status: 500 }
      );
    }

    const billCode = result[0].BillCode;
    const paymentUrl = `https://toyyibpay.com/${billCode}`;

    await pool.query(
      `
      update orders
      set bill_code = $1
      where order_id = $2
      `,
      [billCode, orderId]
    );

    return NextResponse.json({
      ok: true,
      orderId,
      billCode,
      paymentUrl,
      slug: product.slug,
      amount,
    });
  } catch (error) {
    console.error("CREATE BILL ERROR:", error);

    return NextResponse.json(
      { error: "Ralat pelayan semasa create bill." },
      { status: 500 }
    );
  }
}