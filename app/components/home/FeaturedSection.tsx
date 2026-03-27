import Link from "next/link";
import SectionHeader from "@/app/components/shared/SectionHeader";
import ProductCard, { type Product } from "@/app/components/products/ProductCard";

export default function FeaturedSection({
  products,
}: {
  products: Product[];
}) {
  return (
    <section className="relative py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Featured Products"
          title="Pilihan produk terbaik untuk mula explore Slideshop"
          description="Paparan produk terpilih terus dari data anda. Section ini sesuai untuk tonjolkan template yang paling menarik di homepage."
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/products"
            className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}