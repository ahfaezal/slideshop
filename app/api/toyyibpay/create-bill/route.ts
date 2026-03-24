import crypto from "crypto";
import { NextResponse } from "next/server";
import { saveOrder } from "@/lib/order";
import { DOWNLOAD_MAP } from "@/lib/download-map";

type CartItem = {
  slug: string;
  title: string;
  price: string;
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
    const rawProductSlug = String(body?.product_slug || "").trim();
    const productSlug = rawProductSlug.replace(/-(proposal|bundle)$/, "");
    const items = Array.isArray(body?.items) ? (body.items as CartItem[]) : [];

    if (!name || !email || !productSlug) {
      return NextResponse.json(
        { error: "Maklumat checkout tidak lengkap." },
        { status: 400 }
      );
    }

    const product = DOWNLOAD_MAP[productSlug] || null;

    if (!product) {
      return NextResponse.json(
        { error: "Produk tidak dijumpai." },
        { status: 404 }
      );
    }

    const secretKey = process.env.TOYYIB_SECRET_KEY;
    const categoryCode = process.env.TOYYIB_CATEGORY_CODE;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

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

    const amount = product.price;
    const billAmount = Math.round(amount * 100);

    const billName =
      items.length === 1
        ? sanitizeText(
            items[0].title || product.title || "Slideshop Purchase",
            30
          )
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

    const orderId = crypto.randomUUID();
    const referenceNo = `slideshop-${Date.now()}`;

    const returnUrl = `${baseUrl}/checkout/success?product_slug=${encodeURIComponent(
      productSlug
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
    formData.append("billExternalReferenceNo", referenceNo);
    formData.append("billTo", name);
    formData.append("billEmail", email);
    formData.append("billPhone", phone || "");
    formData.append("billPaymentChannel", "2");

    const tpRes = await fetch(
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

    const result = await tpRes.json();

    if (!tpRes.ok || !Array.isArray(result) || !result[0]?.BillCode) {
      console.error("ToyyibPay createBill error:", result);
      return NextResponse.json(
        { error: "Gagal create bill di ToyyibPay.", detail: result },
        { status: 500 }
      );
    }

    const billCode = result[0].BillCode;
    const paymentUrl = `https://toyyibpay.com/${billCode}`;

    saveOrder({
      orderId,
      billCode,
      slug: productSlug,
      productTitle: items.length === 1 ? items[0].title : product.title,
      amount,
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      status: "pending",
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      ok: true,
      billCode,
      paymentUrl,
      product_slug: productSlug,
      referenceNo,
      orderId,
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