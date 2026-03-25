"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const mock = searchParams.get("mock");

  const [status, setStatus] = useState("Sedang memproses pembayaran...");
  const [downloadUrl, setDownloadUrl] = useState("");
  const calledRef = useRef(false);

  useEffect(() => {
    async function finalizePayment() {
      if (!orderId) {
        setStatus("orderId tidak dijumpai.");
        return;
      }

      try {
        const res = await fetch("/api/payment/finalize", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ orderId }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.error || "Gagal finalize payment.");
        }

        if (data?.downloadUrl) {
          setDownloadUrl(data.downloadUrl);
        }

        if (data?.alreadyPaid) {
          setStatus(
            "Order ini telah diproses sebelum ini. Email download sepatutnya sudah dihantar."
          );
          return;
        }

        setStatus(
          "Pembayaran berjaya. Email dengan pautan download telah dihantar ke email anda."
        );
      } catch (error: any) {
        setStatus(error?.message || "Ralat semasa finalize payment.");
      }
    }

    if (mock === "1" && orderId && !calledRef.current) {
      calledRef.current = true;
      finalizePayment();
    } else if (!mock) {
      setStatus("Pembayaran berjaya.");
    }
  }, [orderId, mock]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-xl rounded-2xl bg-white shadow p-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Pembayaran Berjaya</h1>

        <p className="text-slate-700 mb-4">{status}</p>

        {orderId && (
          <p className="text-sm text-slate-500 mb-4">
            No. Order: <span className="font-medium">{orderId}</span>
          </p>
        )}

        {downloadUrl && (
          <div className="rounded-xl bg-slate-50 border p-4 text-left">
            <p className="text-sm font-semibold mb-2">
              Pautan download ujian:
            </p>
            <a
              href={downloadUrl}
              className="text-sm text-blue-600 underline break-all"
            >
              {downloadUrl}
            </a>
            <p className="text-xs text-slate-500 mt-2">
              Untuk flow sebenar, pelanggan akan menerima pautan ini melalui
              email.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
          <div className="w-full max-w-xl rounded-2xl bg-white shadow p-8 text-center">
            <h1 className="text-3xl font-bold mb-4">Pembayaran Berjaya</h1>
            <p className="text-slate-700 mb-4">Sedang memuatkan maklumat pembayaran...</p>
          </div>
        </main>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}