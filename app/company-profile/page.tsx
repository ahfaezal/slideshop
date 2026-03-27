import Link from "next/link";
import { getProductsByPrefix } from "@/lib/products";

export default function CompanyProfilePage() {
  const products = getProductsByPrefix("company-profile-");

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Company Profile</h1>
        <p className="mt-2 text-sm text-gray-600">
          Koleksi template company profile untuk pembentangan profesional.
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