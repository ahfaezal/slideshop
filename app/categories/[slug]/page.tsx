import Link from "next/link";
import { notFound } from "next/navigation";
import SiteNavbar from "@/app/components/layout/SiteNavbar";
import SectionHeader from "@/app/components/shared/SectionHeader";
import ProductCard, { type Product } from "@/app/components/products/ProductCard";
import { getAllProducts } from "@/lib/products";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

function normalize(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function formatCategoryName(slug: string) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default async function CategoryDetailPage({ params }: Props) {
  const { slug } = await params;

  const products = (getAllProducts() as Product[]) ?? [];

  const filtered = products.filter((product) => {
    const categorySlug = normalize(product.category || "");
    return categorySlug === slug;
  });

  if (filtered.length === 0) {
    notFound();
  }

  const categoryName =
    filtered[0]?.category?.trim() || formatCategoryName(slug);

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
                href="/categories"
                className="inline-flex items-center text-sm font-medium text-slate-400 transition hover:text-white"
              >
                ← Kembali ke kategori
              </Link>

              <div className="inline-flex w-fit rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-300">
                {filtered.length} produk dijumpai
              </div>
            </div>

            <SectionHeader
              eyebrow="Category"
              title={categoryName}
              description={`Terokai koleksi template premium dalam kategori ${categoryName}.`}
            />

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}