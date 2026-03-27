import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductsByPrefix } from "@/lib/products";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

function getPrefixFromCategorySlug(slug: string) {
  if (slug === "company-profile") return "company-profile-";
  if (slug === "business-plan") return "business-plan-";
  if (slug === "pitch-deck") return "pitch-deck-";
  return null;
}

function getCategoryTitle(slug: string) {
  if (slug === "company-profile") return "Company Profile";
  if (slug === "business-plan") return "Business Plan";
  if (slug === "pitch-deck") return "Pitch Deck";

  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getCategoryDescription(slug: string) {
  if (slug === "company-profile") {
    return "Koleksi template company profile untuk pembentangan profesional.";
  }

  if (slug === "business-plan") {
    return "Koleksi template business plan untuk proposal dan pembentangan strategik.";
  }

  if (slug === "pitch-deck") {
    return "Koleksi template pitch deck untuk pembentangan idea, startup dan pelabur.";
  }

  return "Koleksi template untuk kategori ini.";
}

export default async function CatalogCategoryPage({ params }: Props) {
  const { slug } = await params;

  const prefix = getPrefixFromCategorySlug(slug);

  if (!prefix) {
    notFound();
  }

  const products = getProductsByPrefix(prefix);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <Link
          href="/catalog"
          className="text-sm text-gray-500 hover:text-black"
        >
          ← Kembali ke Katalog
        </Link>

        <h1 className="mt-4 text-3xl font-bold tracking-tight">
          {getCategoryTitle(slug)}
        </h1>

        <p className="mt-2 text-sm text-gray-600">
          {getCategoryDescription(slug)}
        </p>
      </div>

      {products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 p-10 text-center text-gray-500">
          Tiada produk dijumpai.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => {
            const thumbnailPath = product.thumbnail
              ? `/product-previews/${product.slug}/${product.thumbnail}`
              : null;

            return (
              <article
                key={product.slug}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <Link href={`/product/${product.slug}`} className="block">
                  <div className="aspect-[4/3] bg-gray-100">
                    {thumbnailPath ? (
                      <img
                        src={thumbnailPath}
                        alt={product.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-gray-400">
                        Tiada thumbnail
                      </div>
                    )}
                  </div>
                </Link>

                <div className="p-4">
                  <div className="mb-2">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      {product.category}
                    </p>
                    <h2 className="mt-1 line-clamp-2 text-base font-semibold text-gray-900">
                      {product.title}
                    </h2>
                  </div>

                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">
                      RM {product.price.toFixed(2)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {product.previews.length} preview
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/product/${product.slug}`}
                      className="flex-1 rounded-xl border border-gray-300 px-3 py-2 text-center text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                      Lihat
                    </Link>

                    <Link
                      href={`/checkout?slug=${product.slug}`}
                      className="flex-1 rounded-xl bg-black px-3 py-2 text-center text-sm font-medium text-white transition hover:opacity-90"
                    >
                      Beli
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}