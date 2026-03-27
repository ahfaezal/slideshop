"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import SiteNavbar from "@/app/components/layout/SiteNavbar";

type CheckoutProduct = {
  slug: string;
  title: string;
  price: number;
  category?: string;
  thumbnail?: string;
  previews?: string[];
  fileKey?: string;
};

type CheckoutClientProps = {
  product: CheckoutProduct;
};

type FormState = {
  name: string;
  email: string;
  phone: string;
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("ms-MY", {
    style: "currency",
    currency: "MYR",
    minimumFractionDigits: 2,
  }).format(price);
}

function getProductImage(product: CheckoutProduct) {
  if (product.thumbnail) {
    return `/product-previews/${product.slug}/${product.thumbnail}`;
  }

  if (product.previews && product.previews.length > 0) {
    return `/product-previews/${product.slug}/${product.previews[0]}`;
  }

  return "https://placehold.co/1200x900/png?text=Slideshop";
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function CheckoutClient({ product }: CheckoutClientProps) {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fieldError, setFieldError] = useState<Partial<FormState>>({});

  const imageSrc = useMemo(() => getProductImage(product), [product]);

  function updateField(key: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFieldError((prev) => ({ ...prev, [key]: "" }));
    setError("");
  }

  function validateForm() {
    const nextErrors: Partial<FormState> = {};

    if (!form.name.trim()) {
      nextErrors.name = "Sila masukkan nama penuh.";
    }

    if (!form.email.trim()) {
      nextErrors.email = "Sila masukkan alamat emel.";
    } else if (!isValidEmail(form.email.trim())) {
      nextErrors.email = "Format emel tidak sah.";
    }

    if (!form.phone.trim()) {
      nextErrors.phone = "Sila masukkan nombor telefon.";
    }

    setFieldError(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const customerName = form.name.trim();
      const customerEmail = form.email.trim();
      const customerPhone = form.phone.trim();

      try {
        localStorage.setItem(
          "slideshop_checkout",
          JSON.stringify({
            customer: {
              name: customerName,
              email: customerEmail,
              phone: customerPhone,
            },
            items: [
              {
                slug: product.slug,
                title: product.title,
                price: formatPrice(product.price),
              },
            ],
            total: product.price,
            createdAt: new Date().toISOString(),
          })
        );
      } catch (storageError) {
        console.error("Gagal simpan localStorage checkout:", storageError);
      }

      // STEP 1: CREATE ORDER
      const checkoutRes = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slug: product.slug,
          productTitle: product.title,
          name: customerName,
          email: customerEmail,
          phone: customerPhone,
          amount: product.price,
        }),
      });

      const checkoutData = await checkoutRes.json().catch(() => null);

      if (!checkoutRes.ok) {
        throw new Error(
          checkoutData?.error || "Gagal mencipta order checkout."
        );
      }

      const orderId = String(checkoutData?.orderId || "").trim();

      if (!orderId) {
        throw new Error("orderId tidak diterima daripada sistem checkout.");
      }

      // STEP 2: CREATE TOYYIBPAY BILL
      const paymentRes = await fetch("/api/toyyibpay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slug: product.slug,
          orderId,
          name: customerName,
          email: customerEmail,
          phone: customerPhone,
          amount: product.price,
        }),
      });

      const paymentData = await paymentRes.json().catch(() => null);

      if (!paymentRes.ok) {
        throw new Error(
          paymentData?.error || "Gagal memulakan proses pembayaran."
        );
      }

      const paymentUrl =
        paymentData?.paymentUrl || paymentData?.billUrl || paymentData?.url;

      if (!paymentUrl) {
        throw new Error("Pautan pembayaran tidak diterima daripada sistem.");
      }

      window.location.href = paymentUrl;
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Berlaku ralat semasa memproses pembayaran.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-10%] top-[-10%] h-[420px] w-[420px] rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute right-[-8%] top-[10%] h-[380px] w-[380px] rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-[-10%] left-[20%] h-[420px] w-[420px] rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_35%)]" />
      </div>

      <div className="relative z-10">
        <SiteNavbar />

        <section className="px-4 pb-20 pt-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8">
              <Link
                href={`/product/${product.slug}`}
                className="inline-flex items-center text-sm font-medium text-slate-400 transition hover:text-white"
              >
                ← Kembali ke produk
              </Link>
            </div>

            <div className="mb-8 max-w-3xl">
              <div className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-1.5 text-sm font-semibold text-emerald-300">
                Secure Checkout
              </div>

              <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
                Lengkapkan maklumat pembelian anda
              </h1>

              <p className="mt-4 text-base leading-7 text-slate-300">
                Masukkan maklumat pembeli untuk teruskan ke pembayaran. Selepas
                pembayaran berjaya, sistem akan memproses akses muat turun anda.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_420px]">
              <form
                onSubmit={handleSubmit}
                className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-8"
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-black text-white">
                    Maklumat Pembeli
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Sila pastikan maklumat adalah tepat, terutamanya alamat emel.
                  </p>
                </div>

                <div className="grid gap-5">
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-semibold text-white"
                    >
                      Nama Penuh
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={form.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      placeholder="Contoh: Ah Faezal Husni"
                      className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3.5 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400/40"
                    />
                    {fieldError.name && (
                      <p className="mt-2 text-sm text-rose-400">
                        {fieldError.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-semibold text-white"
                    >
                      Emel
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      placeholder="contoh@email.com"
                      className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3.5 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400/40"
                    />
                    {fieldError.email && (
                      <p className="mt-2 text-sm text-rose-400">
                        {fieldError.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-2 block text-sm font-semibold text-white"
                    >
                      Nombor Telefon
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={form.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      placeholder="Contoh: 0192504000"
                      className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3.5 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400/40"
                    />
                    {fieldError.phone && (
                      <p className="mt-2 text-sm text-rose-400">
                        {fieldError.phone}
                      </p>
                    )}
                  </div>
                </div>

                {error && (
                  <div className="mt-6 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-300">
                    {error}
                  </div>
                )}

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex w-full items-center justify-center rounded-2xl bg-emerald-400 px-6 py-4 text-base font-bold text-slate-950 shadow-[0_10px_30px_rgba(52,211,153,0.25)] transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? "Memproses..." : "Teruskan Pembayaran"}
                  </button>

                  <Link
                    href={`/product/${product.slug}`}
                    className="inline-flex w-full items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-base font-semibold text-white transition hover:bg-white/10"
                  >
                    Batal
                  </Link>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <div className="text-sm font-semibold text-white">
                      Selamat
                    </div>
                    <div className="mt-1 text-sm text-slate-400">
                      Pembayaran melalui gateway
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <div className="text-sm font-semibold text-white">
                      Digital Access
                    </div>
                    <div className="mt-1 text-sm text-slate-400">
                      Produk dihantar secara digital
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <div className="text-sm font-semibold text-white">
                      Premium Asset
                    </div>
                    <div className="mt-1 text-sm text-slate-400">
                      Sedia untuk kegunaan profesional
                    </div>
                  </div>
                </div>
              </form>

              <aside className="h-fit rounded-[32px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-8 lg:sticky lg:top-24">
                <div className="mb-5">
                  <h2 className="text-2xl font-black text-white">
                    Ringkasan Pesanan
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Semak produk sebelum meneruskan pembayaran.
                  </p>
                </div>

                <div className="overflow-hidden rounded-[24px] border border-white/10 bg-black/20">
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-900">
                    <Image
                      src={imageSrc}
                      alt={product.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="p-4">
                    <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-300">
                      {product.category || "Presentation"}
                    </div>

                    <h3 className="mt-3 text-lg font-bold text-white">
                      {product.title}
                    </h3>

                    <p className="mt-2 text-sm text-slate-400">
                      Produk digital premium untuk kegunaan pembentangan
                      profesional.
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-4 rounded-[24px] border border-white/10 bg-black/20 p-5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Produk</span>
                    <span className="font-semibold text-white">1 item</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Jenis</span>
                    <span className="font-semibold text-white">
                      Digital Download
                    </span>
                  </div>

                  <div className="h-px bg-white/10" />

                  <div className="flex items-center justify-between">
                    <span className="text-base font-semibold text-white">
                      Jumlah Bayaran
                    </span>
                    <span className="text-2xl font-black text-emerald-300">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                </div>

                <div className="mt-6 rounded-[24px] border border-emerald-400/20 bg-gradient-to-r from-emerald-400/15 to-cyan-400/10 p-5">
                  <p className="text-sm font-semibold text-emerald-300">
                    Pembelian Digital
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-200">
                    Selepas pembayaran berjaya, sistem akan meneruskan proses
                    pesanan dan akses produk anda.
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}