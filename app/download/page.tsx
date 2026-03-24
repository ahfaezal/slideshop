"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

function DownloadContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleDownload = () => {
    if (!token) {
      setMessage("Token download tidak sah.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const downloadUrl = `/download/${token}`;

      const a = document.createElement("a");
      a.href = downloadUrl;
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      a.remove();

      setMessage("Muat turun bermula.");
    } catch (error) {
      setMessage("Gagal memuat turun fail.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100">
      <section className="mx-auto max-w-2xl px-6 py-16">
        <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-violet-700">
            Slideshop Download
          </p>

          <h1 className="mt-2 text-4xl font-extrabold text-slate-900">
            Muat Turun Produk Anda
          </h1>

          <p className="mt-3 text-sm text-slate-600">
            Link ini aktif selama 48 jam dan mempunyai had muat turun.
          </p>

          <button
            onClick={handleDownload}
            disabled={loading || !token}
            className="mt-6 rounded-2xl bg-violet-700 px-5 py-3 text-sm font-bold text-white hover:bg-violet-800 disabled:opacity-60"
          >
            {loading ? "Sedang diproses..." : "Muat Turun Sekarang"}
          </button>

          {message ? (
            <p className="mt-4 text-sm text-slate-700">{message}</p>
          ) : null}

          {!token ? (
            <p className="mt-4 text-sm text-red-600">
              Token download tidak ditemui dalam URL.
            </p>
          ) : null}
        </div>
      </section>
    </main>
  );
}

export default function DownloadPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <DownloadContent />
    </Suspense>
  );
}