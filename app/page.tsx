import { getAllProducts } from "@/lib/products";
import type { Product } from "@/app/components/products/ProductCard";
import SiteNavbar from "@/app/components/layout/SiteNavbar";
import HeroSection from "@/app/components/home/HeroSection";
import FeaturedSection from "@/app/components/home/FeaturedSection";
import CategoryGridSection from "@/app/components/home/CategoryGridSection";

function getFeaturedProducts(products: Product[]) {
  return products.slice(0, 6);
}

function getUniqueCategoryCount(products: Product[]) {
  return new Set(
    products.map((item) => (item.category || "Presentation").trim())
  ).size;
}

function getStartingPrice(products: Product[]) {
  if (!products.length) return 0;
  return Math.min(...products.map((item) => item.price || 0));
}

export default function HomePage() {
  const products = (getAllProducts() as Product[]) ?? [];
  const featuredProducts = getFeaturedProducts(products);

  const totalProducts = products.length;
  const totalCategories = getUniqueCategoryCount(products);
  const startingPrice = getStartingPrice(products);

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

        <HeroSection
          featuredProducts={featuredProducts}
          totalProducts={totalProducts}
          totalCategories={totalCategories}
          startingPrice={startingPrice}
        />

        <FeaturedSection products={featuredProducts} />

        <CategoryGridSection products={products} />

        <section className="relative pb-24 pt-8">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-r from-white/[0.06] to-white/[0.03] p-8 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-10">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_0.6fr] lg:items-center">
                <div>
                  <div className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-1.5 text-sm font-semibold text-emerald-300">
                    Ready to browse?
                  </div>

                  <h3 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
                    Pilih template premium dan tingkatkan kualiti pembentangan
                    anda.
                  </h3>

                  <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
                    Sama ada untuk syarikat, akademik, proposal, pitching atau
                    pembentangan dakwah, Slideshop membantu anda bermula dengan
                    design yang lebih profesional.
                  </p>
                </div>

                <div className="flex flex-col gap-3 lg:items-end">
                  <a
                    href="/products"
                    className="inline-flex items-center justify-center rounded-2xl bg-emerald-400 px-6 py-3.5 text-sm font-bold text-slate-950 transition hover:bg-emerald-300"
                  >
                    Browse All Templates
                  </a>

                  <a
                    href="/categories"
                    className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    View Categories
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}