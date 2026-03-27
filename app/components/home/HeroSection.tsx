import Link from "next/link";
import type { Product } from "@/app/components/products/ProductCard";

function formatPrice(price: number) {
  return new Intl.NumberFormat("ms-MY", {
    style: "currency",
    currency: "MYR",
    minimumFractionDigits: 2,
  }).format(price);
}

function getProductImage(product: Product) {
  if (product.thumbnail) {
    return `/product-previews/${product.slug}/${product.thumbnail}`;
  }

  if (product.previews && product.previews.length > 0) {
    return `/protected-downloads/${product.slug}/${product.previews[0]}`;
  }

  return "https://placehold.co/1200x900/png?text=Slideshop";
}

type HeroSectionProps = {
  featuredProducts: Product[];
  totalProducts: number;
  totalCategories: number;
  startingPrice: number;
};

export default function HeroSection({
  featuredProducts,
  totalProducts,
  totalCategories,
  startingPrice,
}: HeroSectionProps) {
  return (
    <section className="relative">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-14 px-4 pb-16 pt-10 sm:px-6 md:pt-14 lg:grid-cols-2 lg:items-center lg:px-8 lg:pb-24">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Premium PowerPoint Marketplace
          </div>

          <h1 className="mt-6 max-w-3xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl lg:leading-[1.1]">
            Dapatkan template slide yang nampak eksklusif, kemas dan terus siap
            untuk pembentangan.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Slideshop menghimpunkan template PowerPoint premium untuk company
            profile, business plan, proposal, pitch deck, pendidikan,
            marketing dan pelbagai kategori lain.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/catalog"
              className="inline-flex items-center justify-center rounded-2xl bg-emerald-400 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-[0_10px_30px_rgba(52,211,153,0.25)] transition hover:translate-y-[-1px] hover:bg-emerald-300"
            >
              Browse Templates
            </Link>

            <Link
              href="/categories"
              className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
            >
              Explore Categories
            </Link>
          </div>

          <div className="mt-10 grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
              <div className="text-2xl font-black text-white">
                {totalProducts}+
              </div>
              <div className="mt-1 text-sm text-slate-400">
                Premium products
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
              <div className="text-2xl font-black text-white">
                {totalCategories}+
              </div>
              <div className="mt-1 text-sm text-slate-400">Categories</div>
            </div>

            <div className="col-span-2 rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur sm:col-span-1">
              <div className="text-2xl font-black text-white">
                {startingPrice > 0 ? formatPrice(startingPrice) : "Premium"}
              </div>
              <div className="mt-1 text-sm text-slate-400">Starting price</div>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-4 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
            <div className="mb-4 flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-white">
                  Featured Marketplace Preview
                </p>
                <p className="text-xs text-slate-400">
                  Premium assets for modern presentations
                </p>
              </div>
              <div className="rounded-full bg-emerald-400 px-3 py-1 text-xs font-bold text-slate-950">
                LIVE
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {featuredProducts.slice(0, 4).map((product) => (
                <div
                  key={product.slug}
                  className="overflow-hidden rounded-[22px] border border-white/10 bg-black/20"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getProductImage(product)}
                      alt={product.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <p className="line-clamp-1 text-sm font-semibold text-white">
                      {product.title}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {product.category || "Presentation"}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-[24px] border border-emerald-400/20 bg-gradient-to-r from-emerald-400/15 to-cyan-400/10 p-5">
              <p className="text-sm font-semibold text-emerald-300">
                Marketplace Quality
              </p>
              <p className="mt-2 text-2xl font-black text-white">
                Bina first impression yang lebih premium.
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Sesuai untuk usahawan, syarikat, pensyarah, konsultan dan
                pembentang profesional.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}