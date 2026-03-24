import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const name = String(body?.name || "").trim();
    const email = String(body?.email || "").trim();
    const phone = String(body?.phone || "").trim();
    const amount = Number(body?.amount || 0);

    if (!name || !email || amount <= 0) {
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

    const billAmount = Math.round(amount * 100).toString();
    const referenceNo = `ORDER_${Date.now()}`;

    console.log("MOCK PAYMENT:", isMockPayment);
    console.log("SECRET:", !!secretKey);
    console.log("CATEGORY:", categoryCode);
    console.log("BASE URL:", baseUrl);
    console.log("NAME:", name);
    console.log("EMAIL:", email);
    console.log("PHONE:", phone);
    console.log("AMOUNT:", amount);

    if (isMockPayment) {
      return NextResponse.json({
        ok: true,
        billCode: `MOCK_${Date.now()}`,
        paymentUrl: `${baseUrl}/success?mock=1&status=success`,
        referenceNo,
      });
    }

    const formData = new URLSearchParams({
      userSecretKey: secretKey,
      categoryCode,
      billName: "Slide Purchase",
      billDescription: "Pembelian template slide dari slideshop.my",
      billPriceSetting: "1",
      billPayorInfo: "1",
      billAmount,
      billReturnUrl: `${baseUrl}/success`,
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
      return NextResponse.json({
        ok: true,
        billCode: data[0].BillCode,
        paymentUrl: `https://toyyibpay.com/${data[0].BillCode}`,
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