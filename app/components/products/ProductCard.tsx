import Link from "next/link";

export type Product = {
  slug: string;
  title: string;
  category?: string;
  price: number;
  thumbnail?: string;
  previews?: string[];
  file?: string;
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("ms-MY", {
    style: "currency",
    currency: "MYR",
    minimumFractionDigits: 2,
  }).format(price);
}

function getProductImage(product: Product) {
  if (product.thumbnail) {
    return `/protected-downloads/${product.slug}/${product.thumbnail}`;
  }

  if (product.previews && product.previews.length > 0) {
    return `/protected-downloads/${product.slug}/${product.previews[0]}`;
  }

  return "https://placehold.co/1200x900/png?text=Slideshop";
}

export default function ProductCard({ product }: { product: Product }) {
  const imageUrl = getProductImage(product);

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] shadow-[0_10px_40px_rgba(0,0,0,0.25)] backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-400/30 hover:bg-white/[0.06]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-900">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={product.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

        <div className="absolute left-4 top-4 inline-flex items-center rounded-full border border-white/15 bg-black/30 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
          {product.category || "Presentation"}
        </div>

        <div className="absolute right-4 top-4 inline-flex items-center rounded-full bg-emerald-400 px-3 py-1 text-xs font-bold text-slate-950">
          Premium
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <h3 className="line-clamp-2 text-lg font-bold leading-7 text-white">
            {product.title}
          </h3>
          <div className="shrink-0 text-right">
            <div className="text-xs uppercase tracking-wide text-slate-400">
              Harga
            </div>
            <div className="text-base font-extrabold text-white">
              {formatPrice(product.price)}
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
          <span className="text-sm text-slate-400">Instant download</span>
          <span className="text-sm font-semibold text-white transition group-hover:translate-x-1">
            View product →
          </span>
        </div>
      </div>
    </Link>
  );
}