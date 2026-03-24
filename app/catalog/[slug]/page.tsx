"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { addToCart } from "@/lib/cart";

const products = [
  {
    slug: "test-slide",
    title: "Test Slide Download",
    category: "Test",
    subcategory: "System Test",
    slides: 1,
    price: "RM1.99",
    bundle: "RM1.99",
    description:
      "Produk khas untuk testing live payment, callback, email dan secure download system.",
    thumbnail: "/slides/test-slide/thumbnail.jpg",
    previews: [],
    proposalFile: "/slides/test-slide/test-slide.zip",
    infographicFile: "/slides/test-slide/test-slide.zip",
  },
  {
    slug: "elegant-business-proposal",
    title: "Elegant Business Proposal Pack",
    category: "Korporat",
    subcategory: "Business Proposal",
    slides: 24,
    price: "RM1.99/slide",
    bundle: "RM39",
    description:
      "Slide profesional untuk business proposal, company presentation dan pembentangan korporat.",
    thumbnail: "/slides/elegant-business-proposal/thumbnail.jpg",
    previews: [
      "/slides/elegant-business-proposal/preview-1.jpg",
      "/slides/elegant-business-proposal/preview-2.jpg",
      "/slides/elegant-business-proposal/preview-3.jpg",
    ],
    proposalFile: "/slides/elegant-business-proposal/proposal.pptx",
    infographicFile: "/slides/elegant-business-proposal/infographic.pptx",
  },
];

export default function ProductPage() {
  const params = useParams();
  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;

  const product = products.find(
    (p) => p.slug.toLowerCase() === String(slug || "").toLowerCase()
  );

  if (!product) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <header className="border-b bg-white">
          <div className="mx-auto flex max-w-7xl justify-between px-6 py-4">
            <h1 className="text-xl font-bold">
              slideshop<span className="text-violet-700">.my</span>
            </h1>
            <Link href="/catalog" className="font-medium hover:text-violet-700">
              Kembali
            </Link>
          </div>
        </header>

        <section className="mx-auto max-w-3xl px-6 py-16 text-center">
          <h2 className="text-3xl font-extrabold">Produk tidak dijumpai</h2>
          <p className="mt-3 text-slate-600">
            Produk yang anda cari tiada dalam katalog semasa.
          </p>
          <Link
            href="/catalog"
            className="mt-6 inline-block rounded-2xl bg-violet-600 px-5 py-3 font-semibold text-white hover:bg-violet-700"
          >
            Kembali ke Katalog
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl justify-between px-6 py-4">
          <h1 className="text-xl font-bold">
            slideshop<span className="text-violet-700">.my</span>
          </h1>

          <Link href="/catalog" className="font-medium hover:text-violet-700">
            Kembali
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <img
              src={product.thumbnail}
              alt={product.title}
              className="rounded-3xl"
            />

            {product.previews.length > 0 ? (
              <div className="mt-4 grid grid-cols-3 gap-4">
                {product.previews.map((img) => (
                  <img
                    key={img}
                    src={img}
                    alt={product.title}
                    className="rounded-xl"
                  />
                ))}
              </div>
            ) : (
              <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">
                Preview tambahan belum disediakan untuk produk ini.
              </div>
            )}
          </div>

          <div>
            <div className="mb-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-violet-100 px-3 py-1 text-sm font-semibold text-violet-700">
                {product.category}
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                {product.subcategory}
              </span>
            </div>

            <h2 className="text-4xl font-extrabold leading-tight">
              {product.title}
            </h2>

            <p className="mt-4 text-slate-600">{product.description}</p>

            <div className="mt-6 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
              <p className="text-sm text-slate-500">Jumlah slide</p>
              <p className="mt-1 text-lg font-bold text-slate-900">
                {product.slides} slide
              </p>
            </div>

            <div className="mt-8">
              <div className="text-3xl font-bold text-violet-700">
                {product.price}
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href={product.proposalFile}
                  download
                  className="rounded-xl border border-slate-300 px-4 py-3 font-semibold hover:border-violet-300 hover:text-violet-700"
                >
                  Download Proposal
                </a>

                <button
                  type="button"
                  onClick={() => {
                    addToCart({
                      slug: `${product.slug}-proposal`,
                      title: `${product.title} - Proposal Pack`,
                      price: product.price,
                    });
                    alert("Proposal Pack berjaya ditambah ke cart");
                  }}
                  className="rounded-xl bg-violet-600 px-4 py-3 font-semibold text-white hover:bg-violet-700"
                >
                  Tambah ke Cart
                </button>
              </div>
            </div>

            <div className="mt-8">
              <div className="text-3xl font-bold text-emerald-600">
                {product.bundle}
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href={product.infographicFile}
                  download
                  className="rounded-xl border border-slate-300 px-4 py-3 font-semibold hover:border-emerald-300 hover:text-emerald-700"
                >
                  Download Infographic
                </a>

                <button
                  type="button"
                  onClick={() => {
                    addToCart({
                      slug: `${product.slug}-bundle`,
                      title: `${product.title} - Bundle Pack`,
                      price: product.bundle,
                    });
                    alert("Bundle Pack berjaya ditambah ke cart");
                  }}
                  className="rounded-xl bg-emerald-500 px-4 py-3 font-semibold text-white hover:bg-emerald-600"
                >
                  Tambah Bundle ke Cart
                </button>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-dashed border-slate-300 p-4 text-sm text-slate-500">
              Anda boleh pilih sama ada mahu download terus atau tambah ke cart
              untuk checkout kemudian.
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}