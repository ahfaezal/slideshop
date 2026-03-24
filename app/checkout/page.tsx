"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getCart } from "@/lib/cart";

type CartItem = {
  slug: string;
  title: string;
  price: string;
};

function parsePrice(price: string) {
  const numeric = price.replace("RM", "").replace("/slide", "").trim();
  const value = Number.parseFloat(numeric);
  return Number.isNaN(value) ? 0 : value;
}

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setCart(getCart());
  }, []);

  const total = useMemo(() => {
    return cart.reduce((sum, item) => sum + parsePrice(item.price), 0);
  }, [cart]);

  const productSlug = useMemo(() => {
    if (cart.length === 1) return cart[0].slug;
    return cart.map((item) => item.slug).join(",");
  }, [cart]);

  const handleProceedToPayment = async () => {
    if (!name.trim() || !email.trim()) {
      alert("Sila isi nama penuh dan email.");
      return;
    }

    if (cart.length === 0) {
      alert("Cart anda kosong.");
      return;
    }

    try {
      setIsSubmitting(true);

      const orderData = {
        customer: {
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
        },
        items: cart,
        total,
        product_slug: productSlug,
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem("slideshop_checkout", JSON.stringify(orderData));

      const res = await fetch("/api/toyyibpay/create-bill", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          amount: total,
          product_slug: productSlug,
          items: cart,
        }),
      });

      const data = await res.json();
      console.log("ToyyibPay response:", data);

      if (!res.ok || !data?.paymentUrl) {
        throw new Error(data?.error || "Gagal sambung ke payment gateway.");
      }

      window.location.href = data.paymentUrl;
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Gagal sambung ke payment gateway. Sila cuba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <Link href="/" className="text-3xl font-extrabold text-indigo-700">
              slideshop.my
            </Link>
            <p className="text-xs text-slate-500">Checkout</p>
          </div>

          <nav className="hidden gap-8 text-sm font-medium text-slate-700 md:flex">
            <Link href="/">Home</Link>
            <Link href="/catalog">Katalog</Link>
            <Link href="/cart">Cart</Link>
          </nav>

          <Link
            href="/cart"
            className="rounded-full bg-violet-700 px-5 py-2 text-sm font-semibold text-white hover:bg-violet-800"
          >
            Kembali ke Cart
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-5xl font-extrabold tracking-tight text-slate-900">
          Checkout
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Lengkapkan maklumat anda untuk meneruskan pesanan.
        </p>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.95fr]">
          <div className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-sm">
            <h2 className="text-3xl font-extrabold text-slate-900">
              Maklumat Pelanggan
            </h2>

            <div className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Nama penuh
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-violet-600"
                  placeholder="Masukkan nama penuh"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-violet-600"
                  placeholder="Masukkan email"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  No. telefon
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-violet-600"
                  placeholder="Masukkan no. telefon"
                />
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-slate-50 px-4 py-4 text-sm text-slate-500">
              Checkout ini akan hantar maklumat pesanan ke API create-bill,
              kemudian redirect terus ke ToyyibPay live payment page.
            </div>
          </div>

          <div className="h-fit rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-3xl font-extrabold text-slate-900">
              Ringkasan Pesanan
            </h2>

            <div className="mt-6 space-y-4">
              {cart.length === 0 ? (
                <p className="text-sm text-slate-500">Tiada item dalam cart.</p>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.slug}
                    className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4"
                  >
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-xs text-slate-500">{item.slug}</p>
                    </div>
                    <p className="text-sm font-bold text-violet-700">
                      {item.price}
                    </p>
                  </div>
                ))
              )}
            </div>

            <div className="mt-6 flex items-center justify-between">
              <span className="text-xl font-bold text-slate-900">Jumlah</span>
              <span className="text-4xl font-extrabold text-emerald-600">
                RM{total.toFixed(2)}
              </span>
            </div>

            <button
              onClick={handleProceedToPayment}
              disabled={isSubmitting}
              className="mt-6 w-full rounded-2xl bg-violet-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? "Sedang sambung ke pembayaran..."
                : "Teruskan ke Pembayaran"}
            </button>

            <Link
              href="/cart"
              className="mt-3 block w-full rounded-2xl border border-slate-300 px-5 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Kembali ke Cart
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}