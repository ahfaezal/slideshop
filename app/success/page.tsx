"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import SiteNavbar from "@/app/components/layout/SiteNavbar";

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

type FinalizeResponse = {
  ok?: boolean;
  message?: string;
  downloadUrl?: string;
  error?: string;
};

function formatAmount(total?: number) {
  if (typeof total !== "number") return "-";
  return `RM${total.toFixed(2)}`;
}

export default function SuccessPage() {
  const searchParams = useSearchParams();

  const [order, setOrder] = useState<CheckoutData | null>(null);
  const [isFinalizing, setIsFinalizing] = useState(true);
  const [finalizeError, setFinalizeError] = useState("");
  const [finalizeMessage, setFinalizeMessage] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");

  const slug = searchParams.get("slug") || "";
  const statusId = searchParams.get("status_id") || "";
  const billCode = searchParams.get("billcode") || "";
  const orderId = searchParams.get("order_id") || "";
  const transactionId = searchParams.get("transaction_id") || "";
  const isSuccess = statusId === "1" || searchParams.get("status") === "success";

  const localStorageKey = "slideshop_checkout";

  useEffect(() => {
    try {
      const saved = localStorage.getItem(localStorageKey);
      if (saved) {
        setOrder(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Gagal baca data checkout:", error);
    }
  }, []);

  const fallbackItem = useMemo(() => {
    if (!slug) return null;
    return {
      slug,
      title: slug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
      price: typeof order?.total === "number" ? `RM${order.total.toFixed(2)}` : "-",
    };
  }, [slug, order?.total]);

  useEffect(() => {
    let cancelled = false;

    async function finalizePayment() {
      if (!isSuccess) {
        setIsFinalizing(false);
        setFinalizeError("Status pembayaran tidak berjaya atau belum disahkan.");
        return;
      }

      if (!slug) {
        setIsFinalizing(false);
        setFinalizeError("Slug produk tidak ditemui pada URL.");
        return;
      }

      try {
        setIsFinalizing(true);
        setFinalizeError("");
        setFinalizeMessage("Sedang memproses pesanan anda...");

        const res = await fetch("/api/payment/finalize", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            slug,
            statusId,
            billCode,
            orderId,
            transactionId,
            customer: order?.customer || null,
            items: order?.items || null,
            total: order?.total || null,
            createdAt: order?.createdAt || null,
          }),
        });

        const data: FinalizeResponse = await res.json().catch(() => ({}));

        if (!res.ok) {
          throw new Error(
            data?.error || "Gagal menyelesaikan proses pesanan selepas pembayaran."
          );
        }

        if (cancelled) return;

        setDownloadUrl(data?.downloadUrl || "");
        setFinalizeMessage(
          data?.message ||
            "Pesanan berjaya diproses. Jika pautan muat turun tersedia, ia akan dipaparkan di bawah."
        );
      } catch (error) {
        if (cancelled) return;

        const message =
          error instanceof Error
            ? error.message
            : "Berlaku ralat semasa memproses pesanan anda.";
        setFinalizeError(message);
      } finally {
        if (!cancelled) {
          setIsFinalizing(false);
        }
      }
    }

    finalizePayment();

    return () => {
      cancelled = true;
    };
  }, [
    slug,
    statusId,
    billCode,
    orderId,
    transactionId,
    isSuccess,
    order?.customer,
    order?.items,
    order?.total,
    order?.createdAt,
  ]);

  const itemsToShow =
    order?.items && order.items.length > 0
      ? order.items
      : fallbackItem
      ? [fallbackItem]
      : [];

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

        <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-8">
            <div className="mb-6">
              <p className="text-sm font-semibold uppercase tracking-wide text-emerald-400">
                {isSuccess ? "Pembayaran Berjaya" : "Status Pembayaran"}
              </p>

              <h1 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-5xl">
                Terima kasih atas pembelian anda 🎉
              </h1>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
                Pesanan anda telah diterima. Sistem sedang memproses pengesahan
                pembayaran, penyediaan pautan muat turun dan penghantaran maklumat
                pesanan anda.
              </p>
            </div>

            <div className="mb-8 grid gap-4">
              {isFinalizing && (
                <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-4 text-sm text-cyan-200">
                  ⏳ {finalizeMessage || "Sedang memproses pesanan anda..."}
                </div>
              )}

              {!isFinalizing && finalizeMessage && !finalizeError && (
                <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-4 text-sm text-emerald-200">
                  ✅ {finalizeMessage}
                </div>
              )}

              {!isFinalizing && finalizeError && (
                <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-4 text-sm text-rose-200">
                  ❌ {finalizeError}
                </div>
              )}

              {downloadUrl && (
                <div className="rounded-2xl border border-emerald-400/20 bg-gradient-to-r from-emerald-400/15 to-cyan-400/10 p-5">
                  <p className="text-sm font-semibold text-emerald-300">
                    Pautan Muat Turun Tersedia
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-200">
                    Klik butang di bawah untuk memuat turun fail anda. Simpan pautan
                    ini sekiranya diperlukan semula.
                  </p>

                  <div className="mt-4">
                    <a
                      href={downloadUrl}
                      className="inline-flex items-center justify-center rounded-2xl bg-emerald-400 px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-300"
                    >
                      Muat Turun Sekarang
                    </a>
                  </div>
                </div>
              )}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <h2 className="text-lg font-bold text-white">
                  Maklumat Pelanggan
                </h2>

                <div className="mt-4 space-y-2 text-sm text-slate-300">
                  <p>
                    <span className="font-semibold text-white">Nama:</span>{" "}
                    {order?.customer?.name || "-"}
                  </p>
                  <p>
                    <span className="font-semibold text-white">Email:</span>{" "}
                    {order?.customer?.email || "-"}
                  </p>
                  <p>
                    <span className="font-semibold text-white">Telefon:</span>{" "}
                    {order?.customer?.phone || "-"}
                  </p>
                  <p>
                    <span className="font-semibold text-white">Jumlah:</span>{" "}
                    {formatAmount(order?.total)}
                  </p>
                  <p>
                    <span className="font-semibold text-white">Slug:</span>{" "}
                    {slug || "-"}
                  </p>
                  <p>
                    <span className="font-semibold text-white">Bill Code:</span>{" "}
                    {billCode || "-"}
                  </p>
                  <p>
                    <span className="font-semibold text-white">Order ID:</span>{" "}
                    {orderId || "-"}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <h2 className="text-lg font-bold text-white">Ringkasan Item</h2>

                <div className="mt-4 space-y-3">
                  {itemsToShow.length > 0 ? (
                    itemsToShow.map((item) => (
                      <div
                        key={item.slug}
                        className="flex items-start justify-between gap-3 border-b border-white/10 pb-3"
                      >
                        <div>
                          <p className="text-sm font-semibold text-white">
                            {item.title}
                          </p>
                          <p className="text-xs text-slate-400">{item.slug}</p>
                        </div>
                        <p className="text-sm font-bold text-emerald-300">
                          {item.price}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-400">
                      Tiada data item dijumpai.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-sm text-slate-300">
              <p>✅ Sila semak email anda untuk pautan muat turun.</p>
              <p className="mt-2">
                ⏳ Pautan download biasanya sah untuk tempoh tertentu sahaja.
              </p>
              <p className="mt-2">
                🔒 Setiap pautan muat turun boleh mempunyai had tertentu atas faktor
                keselamatan.
              </p>
              <p className="mt-2">
                📩 Jika email belum diterima dalam beberapa minit, sila semak folder{" "}
                <span className="font-semibold text-white">Spam / Junk</span>.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/catalog"
                className="rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-300"
              >
                Kembali ke Katalog
              </Link>

              <Link
                href="/"
                className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Ke Halaman Utama
              </Link>

              {slug && (
                <Link
                  href={`/product/${slug}`}
                  className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Lihat Produk
                </Link>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}