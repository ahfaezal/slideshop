"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function SuccessContent() {
  const searchParams = useSearchParams();
  const productSlug = searchParams.get("product_slug");

  return (
    <main className="min-h-screen bg-slate-100">
      <section className="mx-auto max-w-3xl px-6 py-16">
        <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-extrabold text-slate-900">
            Pembelian Berjaya 🎉
          </h1>

          <p className="mt-3 text-sm text-slate-600">
            Terima kasih atas pembelian anda di{" "}
            <span className="font-semibold">Slideshop.my</span>. Pembayaran
            anda telah berjaya diproses.
          </p>

          <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-slate-700 space-y-2">
            <p>✅ Sila semak email anda untuk pautan muat turun.</p>
            <p>
              ⏳ Pautan download hanya sah selama{" "}
              <span className="font-semibold">48 jam</span>.
            </p>
            <p>
              🔒 Setiap pautan mempunyai had muat turun atas faktor
              keselamatan.
            </p>
            <p>
              📩 Jika email belum diterima dalam beberapa minit, sila semak
              folder <span className="font-semibold">Spam / Junk</span>.
            </p>
          </div>

          <div className="mt-6 rounded-xl bg-slate-100 p-4 text-sm text-slate-700">
            <p className="font-semibold">Maklumat Produk</p>
            <p className="mt-1">
              Product:{" "}
              <span className="font-medium">{productSlug || "Tidak dinyatakan"}</span>
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-2xl bg-violet-700 px-5 py-3 text-sm font-bold text-white hover:bg-violet-800"
            >
              Home
            </Link>

            <Link
              href="/catalog"
              className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
            >
              Kembali ke Katalog
            </Link>
          </div>

          <p className="mt-6 text-xs text-slate-500">
            Sekiranya anda menghadapi masalah untuk memuat turun produk, sila
            hubungi pihak kami bersama maklumat email pembelian anda.
          </p>
        </div>
      </section>
    </main>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}