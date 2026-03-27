import { Suspense } from "react";
import CheckoutClient from "./CheckoutClient";

function CheckoutFallback() {
  return (
    <main className="min-h-screen bg-slate-100">
      <section className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-5xl font-extrabold tracking-tight text-slate-900">
          Checkout
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Sedang memuatkan checkout...
        </p>
      </section>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutFallback />}>
      <CheckoutClient />
    </Suspense>
  );
}