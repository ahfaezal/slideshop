import { NextResponse } from "next/server";

export async function GET() {
  try {
    const payload = {
      status: "success",
      transaction_id: `TXN-${Date.now()}`,
      name: "Faezal Husni",
      email: "EMAILANDA@gmail.com",
      phone: "0123456789",
      amount: 19.9,
      product_slug: "abstract-company-profile",
    };

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/callback`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const text = await res.text();

    try {
      const data = JSON.parse(text);
      return NextResponse.json(data, { status: res.status });
    } catch {
      return NextResponse.json(
        {
          ok: false,
          status: res.status,
          raw: text,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("TEST PAYMENT ERROR:", error);
    return NextResponse.json(
      { ok: false, error: "Test payment failed" },
      { status: 500 }
    );
  }
}