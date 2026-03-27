import Link from "next/link";
import SiteNavbar from "@/app/components/layout/SiteNavbar";
import SectionHeader from "@/app/components/shared/SectionHeader";
import ProductCard, { type Product } from "@/app/components/products/ProductCard";
import { getAllProducts } from "@/lib/products";

export default function ProductsPage() {
  const products = (getAllProducts() as Product[]) ?? [];

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
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <Link
                href="/"
                className="inline-flex items-center text-sm font-medium text-slate-400 transition hover:text-white"
              >
                ← Kembali ke homepage
              </Link>

              <div className="inline-flex w-fit rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-300">
                {products.length} produk tersedia
              </div>
            </div>

            <SectionHeader
              eyebrow="All Products"
              title="Semua template premium dalam Slideshop"
              description="Terokai koleksi template PowerPoint premium untuk syarikat, proposal, pembentangan akademik, marketing dan pelbagai kegunaan profesional."
            />

            {products.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product.slug} product={product} />
                ))}
              </div>
            ) : (
              <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-10 text-center shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
                <h2 className="text-2xl font-black text-white">
                  Tiada produk dijumpai
                </h2>
                <p className="mt-3 text-slate-400">
                  Buat masa ini belum ada produk untuk dipaparkan.
                </p>

                <div className="mt-6">
                  <Link
                    href="/"
                    className="inline-flex items-center justify-center rounded-2xl bg-emerald-400 px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-300"
                  >
                    Kembali ke Homepage
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}