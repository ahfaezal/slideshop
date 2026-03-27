import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteNavbar from "@/app/components/layout/SiteNavbar";
import ProductCard, { type Product as CardProduct } from "@/app/components/products/ProductCard";
import { getAllProducts } from "@/lib/products";
import { getProductBySlug } from "@/lib/download-map";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

type DownloadMapProduct = {
  slug: string;
  title: string;
  category: string;
  price: number;
  thumbnail: string;
  previews: string[];
  fileKey: string;
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("ms-MY", {
    style: "currency",
    currency: "MYR",
    minimumFractionDigits: 2,
  }).format(price);
}

function normalize(text: string) {
  return text.toLowerCase().trim();
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug) as DownloadMapProduct | undefined;

  if (!product) {
    notFound();
  }

  const thumbnailSrc = `/product-previews/${product.slug}/${product.thumbnail}`;
  const previewImages = product.previews.map(
    (item) => `/product-previews/${product.slug}/${item}`
  );

  const allProducts = (getAllProducts() as CardProduct[]) ?? [];

  const relatedProducts = allProducts
    .filter(
      (item) =>
        item.slug !== product.slug &&
        normalize(item.category || "") === normalize(product.category || "")
    )
    .slice(0, 3);

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

        <section className="px-4 pb-16 pt-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8">
              <Link
                href="/catalog"
                className="text-sm font-medium text-slate-400 transition hover:text-white"
              >
                ← Kembali ke katalog
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="space-y-5">
                <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                    <Image
                      src={thumbnailSrc}
                      alt={product.title}
                      fill
                      priority
                      className="object-cover"
                    />
                  </div>
                </div>

                {previewImages.length > 0 && (
                  <div>
                    <div className="mb-4">
                      <h2 className="text-xl font-bold text-white sm:text-2xl">
                        Preview Slide
                      </h2>
                      <p className="mt-1 text-sm text-slate-400">
                        Lihat beberapa paparan slide sebelum membuat pembelian.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                      {previewImages.map((src, index) => (
                        <div
                          key={src}
                          className="overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.04] shadow-[0_10px_40px_rgba(0,0,0,0.20)]"
                        >
                          <div className="relative aspect-[4/3] overflow-hidden bg-slate-900">
                            <Image
                              src={src}
                              alt={`${product.title} Preview ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <div className="sticky top-24 rounded-[32px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-8">
                  <div className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-1.5 text-sm font-semibold text-emerald-300">
                    {product.category}
                  </div>

                  <h1 className="mt-5 text-3xl font-black tracking-tight text-white sm:text-4xl">
                    {product.title}
                  </h1>

                  <p className="mt-4 text-base leading-7 text-slate-300">
                    Template PowerPoint profesional yang siap guna dan mudah
                    diedit. Sesuai untuk pembentangan, proposal, company
                    profile dan kegunaan korporat.
                  </p>

                  <div className="mt-6 rounded-[24px] border border-white/10 bg-black/20 p-5">
                    <div className="text-sm text-slate-400">Harga</div>
                    <div className="mt-1 text-4xl font-black text-white">
                      {formatPrice(product.price)}
                    </div>
                    <div className="mt-2 text-sm text-slate-400">
                      Muat turun digital selepas pembayaran berjaya.
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                      <div className="text-sm font-semibold text-white">Slug</div>
                      <div className="mt-1 break-all text-sm text-slate-400">
                        {product.slug}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                      <div className="text-sm font-semibold text-white">File</div>
                      <div className="mt-1 break-all text-sm text-slate-400">
                        {product.fileKey}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <Link
                      href={`/checkout?slug=${product.slug}`}
                      className="inline-flex w-full items-center justify-center rounded-2xl bg-emerald-400 px-6 py-4 text-base font-bold text-slate-950 shadow-[0_10px_30px_rgba(52,211,153,0.25)] transition hover:bg-emerald-300"
                    >
                      Beli Sekarang
                    </Link>

                    <Link
                      href="/catalog"
                      className="inline-flex w-full items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-base font-semibold text-white transition hover:bg-white/10"
                    >
                      Kembali ke Katalog
                    </Link>
                  </div>

                  <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                      <div className="text-sm font-semibold text-white">
                        Editable
                      </div>
                      <div className="mt-1 text-sm text-slate-400">
                        Boleh diubah ikut keperluan
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                      <div className="text-sm font-semibold text-white">
                        Premium Design
                      </div>
                      <div className="mt-1 text-sm text-slate-400">
                        Rekaan moden dan profesional
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                      <div className="text-sm font-semibold text-white">
                        Instant Access
                      </div>
                      <div className="mt-1 text-sm text-slate-400">
                        Akses selepas pembayaran
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {relatedProducts.length > 0 && (
              <section className="mt-16">
                <div className="mb-8">
                  <h2 className="text-2xl font-black text-white">
                    Produk berkaitan
                  </h2>
                  <p className="mt-2 text-slate-400">
                    Pilihan lain dalam kategori yang sama.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {relatedProducts.map((item) => (
                    <ProductCard key={item.slug} product={item} />
                  ))}
                </div>
              </section>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}