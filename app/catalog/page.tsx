import Link from "next/link";

const packages = [
  {
    slug: "elegant-business-proposal",
    title: "Elegant Business Proposal Pack",
    category: "Korporat",
    subcategory: "Business Proposal",
    slides: 24,
    price: "RM29",
    bundle: "RM39",
    gradient: "from-emerald-700 via-teal-700 to-cyan-900",
    description:
      "Slide profesional untuk business proposal, company presentation dan pembentangan korporat.",
    thumbnail: "/slides/elegant-business-proposal/thumbnail.jpg",
  },
  {
    slug: "abstract-company-profile",
    title: "Abstract Company Profile",
    category: "Korporat",
    subcategory: "Company Profile",
    slides: 24,
    price: "RM1/slide",
    bundle: "RM19.90",
    gradient: "from-fuchsia-600 via-violet-700 to-indigo-900",
    description:
      "Sesuai untuk pembentangan profesional dengan susunan slide lengkap dan kemas.",
  },
  {
    slug: "adventure-photographer-portfolio",
    title: "Adventure Photographer Portfolio",
    category: "Kreatif",
    subcategory: "Portfolio",
    slides: 20,
    price: "RM1/slide",
    bundle: "RM19.90",
    gradient: "from-slate-700 via-stone-800 to-zinc-900",
    description:
      "Sesuai untuk portfolio kreatif, showcase visual dan pembentangan projek design.",
  },
  {
    slug: "asian-food-workshop",
    title: "Asian Food Workshop",
    category: "Pendidikan",
    subcategory: "Workshop / Seminar",
    slides: 18,
    price: "RM1/slide",
    bundle: "RM19.90",
    gradient: "from-stone-900 via-neutral-950 to-black",
    description:
      "Sesuai untuk workshop, kelas, latihan dan modul pembelajaran yang tersusun.",
  },
];

const categories = [
  "Semua",
  "Korporat",
  "Pendidikan",
  "Kreatif",
  "Dakwah",
];

export default function CatalogPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">
              slideshop<span className="text-violet-700">.my</span>
            </h1>
            <p className="text-xs text-slate-500">
              Katalog pakej PowerPoint siap guna
            </p>
          </div>

          <nav className="hidden gap-8 md:flex">
            <Link href="/" className="font-medium hover:text-violet-700">
              Home
            </Link>
            <Link href="/catalog" className="font-medium text-violet-700">
              Katalog
            </Link>
            <Link href="/cart" className="font-medium hover:text-violet-700">
              Cart
            </Link>
          </nav>

          <Link
            href="/"
            className="rounded-2xl bg-violet-700 px-4 py-2.5 font-semibold text-white hover:bg-violet-800"
          >
            Kembali Home
          </Link>
        </div>
      </header>

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="max-w-3xl">
            <div className="inline-flex rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-medium text-violet-700">
              Katalog Slideshop.my
            </div>

            <h2 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl">
              Pilih pakej slide mengikut keperluan anda
            </h2>

            <p className="mt-4 text-lg text-slate-600">
              Sesuai untuk pembentangan korporat, pendidikan, kreatif dan
              dakwah. Pilih satu pakej atau ambil bundle yang lebih lengkap.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {categories.map((item) => (
              <button
                key={item}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  item === "Semua"
                    ? "bg-violet-700 text-white"
                    : "border border-slate-300 bg-white text-slate-700 hover:border-violet-300 hover:text-violet-700"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="text-3xl font-extrabold tracking-tight">
              Semua pakej
            </h3>
            <p className="mt-2 text-slate-600">
              Klik pada pakej untuk lihat maklumat lanjut, preview dan pilihan
              pembelian.
            </p>
          </div>

          <div className="text-sm text-slate-500">
            Jumlah pakej dipaparkan: {packages.length}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {packages.map((pkg) => (
            <div
              key={pkg.slug}
              className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div
                className={`relative h-64 bg-gradient-to-br ${pkg.gradient} p-5 text-white`}
              >
                {pkg.thumbnail ? (
                  <div className="absolute inset-0">
                    <img
                      src={pkg.thumbnail}
                      alt={pkg.title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-900/25 to-transparent" />
                  </div>
                ) : null}

                <div className="relative z-10 flex h-full flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <span className="rounded-full bg-amber-300 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-950">
                      {pkg.subcategory}
                    </span>
                    <span className="rounded-full bg-white/15 px-3 py-1 text-xs backdrop-blur-sm">
                      {pkg.category}
                    </span>
                  </div>

                  <div className="mt-auto">
                    <h4 className="text-3xl font-extrabold leading-tight">
                      {pkg.title}
                    </h4>
                  </div>
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-center justify-between text-sm text-slate-500">
                  <span>{pkg.slides} slide</span>
                  <span>{pkg.category}</span>
                </div>

                <p className="mt-4 text-slate-600">{pkg.description}</p>

                <div className="mt-6 flex items-end justify-between gap-4">
                  <div>
                    <div className="text-3xl font-extrabold text-violet-700">
                      {pkg.price}
                    </div>
                    <div className="text-sm text-slate-500">
                      atau full set {pkg.bundle}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/catalog/${pkg.slug}`}
                      className="rounded-2xl border border-slate-300 px-4 py-2.5 font-semibold hover:border-violet-300 hover:text-violet-700"
                    >
                      Lihat
                    </Link>
                    <Link
                      href="/cart"
                      className="rounded-2xl bg-emerald-500 px-4 py-2.5 font-semibold text-white hover:bg-emerald-600"
                    >
                      Ambil Pakej
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-14">
        <div className="rounded-[2rem] bg-slate-900 px-8 py-12 text-center text-white">
          <h3 className="text-4xl font-extrabold">
            Mahu pakej yang lebih lengkap?
          </h3>
          <p className="mx-auto mt-4 max-w-2xl text-white/75">
            Anda boleh mula dengan pakej utama dahulu, kemudian tambah
            infographic pack atau bundle untuk pembentangan yang lebih mantap.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/cart"
              className="rounded-2xl bg-violet-600 px-6 py-3.5 text-lg font-bold text-white hover:bg-violet-700"
            >
              Pergi ke Cart
            </Link>
            <Link
              href="/"
              className="rounded-2xl border border-white/20 bg-white/10 px-6 py-3.5 text-lg font-bold text-white hover:bg-white/15"
            >
              Kembali Home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}