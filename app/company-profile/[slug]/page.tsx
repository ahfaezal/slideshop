import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductsByPrefix } from "@/lib/products";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function CompanyProfileDetailPage({ params }: Props) {
  const { slug } = await params;

  const products = getProductsByPrefix("company-profile-");
  const product = products.find((item) => item.slug === slug);

  if (!product) {
    notFound();
  }

  const infoPath = path.join(
    process.cwd(),
    "protected-downloads",
    product.slug,
    "info.json"
  );

  let info: Record<string, any> = {};
  if (fs.existsSync(infoPath)) {
    try {
      info = JSON.parse(fs.readFileSync(infoPath, "utf8"));
    } catch {
      info = {};
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <Link
          href="/company-profile"
          className="text-sm text-gray-500 hover:text-black"
        >
          ← Kembali ke Company Profile
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <div className="mb-4 overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <img
              src={`/product-previews/${product.slug}/preview-01.jpg`}
              alt={product.title}
              className="w-full object-cover"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            {product.previews.map((preview) => (
              <div
                key={preview}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white"
              >
                <img
                  src={`/product-previews/${product.slug}/${preview}`}
                  alt={preview}
                  className="w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            {product.category}
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            {product.title}
          </h1>

          <p className="mt-4 text-3xl font-bold text-black">
            RM {product.price.toFixed(2)}
          </p>

          <p className="mt-4 text-sm leading-6 text-gray-600">
            {info.description ||
              "Template profesional yang sesuai untuk pembentangan syarikat, profil korporat, proposal dan kegunaan persembahan visual yang kemas."}
          </p>

          <div className="mt-6 flex gap-3">
            <Link
              href={`/checkout?slug=${product.slug}`}
              className="rounded-xl bg-black px-5 py-3 text-sm font-medium text-white hover:opacity-90"
            >
              Beli Sekarang
            </Link>

            <Link
              href="/company-profile"
              className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Lihat Lagi
            </Link>
          </div>

          <div className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 p-5">
            <h2 className="mb-3 text-sm font-semibold text-gray-900">
              Maklumat Ringkas
            </h2>

            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex justify-between gap-4">
                <span>Slug</span>
                <span className="font-medium">{product.slug}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Kategori</span>
                <span className="font-medium">{product.category}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Jumlah Preview</span>
                <span className="font-medium">{product.previews.length}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Harga</span>
                <span className="font-medium">RM {product.price.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}