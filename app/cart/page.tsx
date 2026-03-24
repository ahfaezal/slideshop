"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getCart, clearCart } from "@/lib/cart";

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

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    setCart(getCart());
  }, []);

  const total = useMemo(() => {
    return cart.reduce((sum, item) => sum + parsePrice(item.price), 0);
  }, [cart]);

  const removeItem = (slug: string) => {
    const updatedCart = cart.filter((item, index) => {
      const firstMatchIndex = cart.findIndex((x) => x.slug === slug);
      return index !== firstMatchIndex;
    });

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);
  };

  const handleClearCart = () => {
    clearCart();
    setCart([]);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">
              slideshop<span className="text-violet-700">.my</span>
            </h1>
            <p className="text-xs text-slate-500">Cart & checkout</p>
          </div>

          <nav className="hidden gap-8 md:flex">
            <Link href="/" className="font-medium hover:text-violet-700">
              Home
            </Link>
            <Link href="/catalog" className="font-medium hover:text-violet-700">
              Katalog
            </Link>
            <Link href="/cart" className="font-medium text-violet-700">
              Cart
            </Link>
          </nav>

          <Link
            href="/catalog"
            className="rounded-2xl bg-violet-700 px-4 py-2.5 font-semibold text-white hover:bg-violet-800"
          >
            Sambung Pilih Pakej
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8">
          <h2 className="text-4xl font-extrabold tracking-tight">Cart</h2>
          <p className="mt-2 text-slate-600">
            Semak pakej yang telah dipilih sebelum terus ke checkout.
          </p>
        </div>

        {cart.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-10 text-center">
            <h3 className="text-2xl font-bold">Cart masih kosong</h3>
            <p className="mt-3 text-slate-600">
              Tambah pakej dari katalog untuk mula membuat pesanan.
            </p>
            <div className="mt-6">
              <Link
                href="/catalog"
                className="rounded-2xl bg-violet-700 px-6 py-3 font-semibold text-white hover:bg-violet-800"
              >
                Pergi ke Katalog
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
            <div className="space-y-4">
              {cart.map((item, i) => (
                <div
                  key={`${item.slug}-${i}`}
                  className="flex items-center justify-between rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div>
                    <div className="text-lg font-bold">{item.title}</div>
                    <div className="mt-1 text-sm text-slate-500">
                      {item.slug}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-xl font-extrabold text-violet-700">
                      {item.price}
                    </div>
                    <button
                      onClick={() => removeItem(item.slug)}
                      className="rounded-xl border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                    >
                      Buang
                    </button>
                  </div>
                </div>
              ))}

              <button
                onClick={handleClearCart}
                className="rounded-2xl bg-red-500 px-5 py-3 font-semibold text-white hover:bg-red-600"
              >
                Clear Cart
              </button>
            </div>

            <aside>
              <div className="sticky top-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-2xl font-extrabold">Ringkasan Pesanan</h3>

                <div className="mt-6 space-y-3 border-b border-slate-200 pb-6 text-sm text-slate-600">
                  <div className="flex items-center justify-between">
                    <span>Jumlah item</span>
                    <span className="font-semibold">{cart.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold">RM{total.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Delivery</span>
                    <span className="font-semibold">Automatik / Digital</span>
                  </div>
                </div>

                <div className="mt-6 flex items-end justify-between">
                  <span className="text-lg font-semibold">Jumlah</span>
                  <span className="text-3xl font-extrabold text-emerald-600">
                    RM{total.toFixed(2)}
                  </span>
                </div>

                <div className="mt-6 space-y-3">
                  <Link
                      href="/checkout"
                      className="block w-full rounded-2xl bg-violet-700 px-4 py-3 text-center font-semibold text-white hover:bg-violet-800"
                    >
                      Teruskan ke Checkout
                  </Link>

                  <Link
                    href="/catalog"
                    className="block w-full rounded-2xl border border-slate-300 px-4 py-3 text-center font-semibold hover:border-violet-300 hover:text-violet-700"
                  >
                    Tambah Lagi Pakej
                  </Link>
                </div>

                <p className="mt-4 text-xs text-slate-500">
                  Checkout akan disambungkan kepada payment gateway pada langkah
                  seterusnya.
                </p>
              </div>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}