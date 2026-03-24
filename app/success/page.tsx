"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type CheckoutData = {
  customer?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  items?: Array<{
    slug: string;
    title: string;
    price: string;
  }>;
  total?: number;
  createdAt?: string;
};

export default function SuccessPage() {
  const [order, setOrder] = useState<CheckoutData | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("slideshop_checkout");
      if (saved) {
        setOrder(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Gagal baca data checkout:", error);
    }
  }, []);

  return (
    <main className="min-h-screen bg-slate-100">
      <section className="mx-auto max-w-4xl px-6 py-12">
        <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
              Pembayaran Berjaya
            </p>
            <h1 className="mt-2 text-4xl font-extrabold text-slate-900">
              Terima kasih atas pembelian anda 🎉
            </h1>
            <p className="mt-3 text-sm text-slate-600">
              Pesanan anda telah diterima. Versi seterusnya boleh disambungkan
              dengan penghantaran fail automatik melalui email atau pautan muat turun.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-5">
              <h2 className="text-lg font-bold text-slate-900">
                Maklumat Pelanggan
              </h2>

              <div className="mt-4 space-y-2 text-sm text-slate-700">
                <p>
                  <span className="font-semibold">Nama:</span>{" "}
                  {order?.customer?.name || "-"}
                </p>
                <p>
                  <span className="font-semibold">Email:</span>{" "}
                  {order?.customer?.email || "-"}
                </p>
                <p>
                  <span className="font-semibold">Telefon:</span>{" "}
                  {order?.customer?.phone || "-"}
                </p>
                <p>
                  <span className="font-semibold">Jumlah:</span>{" "}
                  {typeof order?.total === "number"
                    ? `RM${order.total.toFixed(2)}`
                    : "-"}
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <h2 className="text-lg font-bold text-slate-900">
                Ringkasan Item
              </h2>

              <div className="mt-4 space-y-3">
                {order?.items && order.items.length > 0 ? (
                  order.items.map((item) => (
                    <div
                      key={item.slug}
                      className="flex items-start justify-between gap-3 border-b border-slate-200 pb-3"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {item.title}
                        </p>
                        <p className="text-xs text-slate-500">{item.slug}</p>
                      </div>
                      <p className="text-sm font-bold text-violet-700">
                        {item.price}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">
                    Tiada data item dijumpai.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/catalog"
              className="rounded-2xl bg-violet-700 px-5 py-3 text-sm font-bold text-white hover:bg-violet-800"
            >
              Kembali ke Katalog
            </Link>

            <Link
              href="/"
              className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Ke Halaman Utama
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}