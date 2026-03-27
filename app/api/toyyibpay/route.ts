import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

function sanitizeSlugForReference(slug: string) {
  return slug
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 30);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const slug = String(body?.slug || "").trim();
    const orderId = String(body?.orderId || "").trim();
    const name = String(body?.name || "").trim();
    const email = String(body?.email || "").trim();
    const phone = String(body?.phone || "").trim();
    const amount = Number(body?.amount || 0);

    if (!slug || !orderId || !name || !email || amount <= 0) {
      return NextResponse.json(
        { error: "Maklumat pembayaran tidak lengkap." },
        { status: 400 }
      );
    }

    const secretKey = process.env.TOYYIB_SECRET_KEY;
    const categoryCode = process.env.TOYYIB_CATEGORY_CODE;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const isMockPayment = process.env.MOCK_PAYMENT === "true";

    if (!secretKey || !categoryCode) {
      return NextResponse.json(
        { error: "Konfigurasi ToyyibPay belum lengkap." },
        { status: 500 }
      );
    }

    if (!baseUrl) {
      return NextResponse.json(
        { error: "NEXT_PUBLIC_BASE_URL belum diset." },
        { status: 500 }
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
        customer_phone,
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

    if (order.slug !== slug) {
      return NextResponse.json(
        { error: "Slug order tidak sepadan." },
        { status: 400 }
      );
    }

    const billAmount = Math.round(amount * 100).toString();
    const safeSlug = sanitizeSlugForReference(slug);
    const referenceNo = `ORDER_${safeSlug}_${Date.now()}`;

    console.log("MOCK PAYMENT:", isMockPayment);
    console.log("SECRET:", !!secretKey);
    console.log("CATEGORY:", categoryCode);
    console.log("BASE URL:", baseUrl);
    console.log("ORDER ID:", orderId);
    console.log("SLUG:", slug);
    console.log("NAME:", name);
    console.log("EMAIL:", email);
    console.log("PHONE:", phone);
    console.log("AMOUNT:", amount);

    if (isMockPayment) {
      const mockBillCode = `MOCK_${Date.now()}`;

      await pool.query(
        `
        update orders
        set bill_code = $2
        where order_id = $1
        `,
        [orderId, mockBillCode]
      );

      return NextResponse.json({
        ok: true,
        slug,
        orderId,
        billCode: mockBillCode,
        paymentUrl: `${baseUrl}/success?mock=1&status=success&status_id=1&slug=${encodeURIComponent(
          slug
        )}&order_id=${encodeURIComponent(orderId)}&billcode=${encodeURIComponent(
          mockBillCode
        )}`,
        referenceNo,
      });
    }

    const formData = new URLSearchParams({
      userSecretKey: secretKey,
      categoryCode,
      billName: "Slide Purchase",
      billDescription: `Pembelian template slide: ${slug}`,
      billPriceSetting: "1",
      billPayorInfo: "1",
      billAmount,
      billReturnUrl: `${baseUrl}/success?slug=${encodeURIComponent(
        slug
      )}&order_id=${encodeURIComponent(orderId)}`,
      billCallbackUrl: `${baseUrl}/api/toyyibpay/callback`,
      billExternalReferenceNo: referenceNo,
      billTo: name,
      billEmail: email,
      billPhone: phone,
      billSplitPayment: "0",
      billSplitPaymentArgs: "",
      billPaymentChannel: "0",
      billDisplayMerchant: "1",
      billContentEmail: "Terima kasih atas pembelian anda di slideshop.my",
      billChargeToCustomer: "1",
    });

    console.log("FORM DATA:", formData.toString());

    const response = await fetch(
      "https://toyyibpay.com/index.php/api/createBill",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
        cache: "no-store",
      }
    );

    console.log("HTTP STATUS:", response.status);
    console.log("HTTP OK:", response.ok);

    const rawText = await response.text();
    console.log("RAW RESPONSE:", rawText);

    let data: any = null;

    try {
      data = JSON.parse(rawText);
    } catch (parseError) {
      console.error("JSON PARSE ERROR:", parseError);
      return NextResponse.json(
        {
          error: "Respons ToyyibPay bukan dalam format JSON.",
          rawText,
        },
        { status: 500 }
      );
    }

    console.log("ToyyibPay createBill response:", data);

    if (Array.isArray(data) && data[0]?.BillCode) {
      const billCode = data[0].BillCode as string;

      await pool.query(
        `
        update orders
        set bill_code = $2
        where order_id = $1
        `,
        [orderId, billCode]
      );

      return NextResponse.json({
        ok: true,
        slug,
        orderId,
        billCode,
        paymentUrl: `https://toyyibpay.com/${billCode}`,
        referenceNo,
      });
    }

    return NextResponse.json(
      {
        error: "Gagal mencipta bill ToyyibPay.",
        details: data,
      },
      { status: 500 }
    );
  } catch (error) {
    console.error("ToyyibPay route error:", error);

    return NextResponse.json(
      { error: "Ralat server semasa sambung ke ToyyibPay." },
      { status: 500 }
    );
  }
}