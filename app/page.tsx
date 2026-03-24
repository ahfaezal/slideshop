import Link from "next/link";

const categories = [
  {
    name: "Korporat",
    desc: "Company profile, business proposal, business plan, annual report",
    color: "from-violet-700 to-blue-700",
  },
  {
    name: "Pendidikan",
    desc: "Workshop, kelas, latihan, modul pembelajaran",
    color: "from-amber-100 to-orange-50",
  },
  {
    name: "Kreatif",
    desc: "Portfolio, photographer, art, design",
    color: "from-pink-100 to-rose-50",
  },
  {
    name: "Dakwah",
    desc: "Kuliah, ceramah, pengajian, bahan masjid",
    color: "from-emerald-100 to-teal-50",
  },
];

const featuredPackages = [
  {
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
    title: "Adventure Photographer Portfolio",
    category: "Kreatif",
    subcategory: "Portfolio",
    slides: 20,
    price: "RM1/slide",
    bundle: "RM19.90",
    gradient: "from-slate-700 via-stone-800 to-zinc-900",
    description:
      "Sesuai untuk pembentangan profesional dengan susunan slide lengkap dan kemas.",
  },
  {
    title: "Asian Food Workshop",
    category: "Pendidikan",
    subcategory: "Workshop / Seminar",
    slides: 18,
    price: "RM1/slide",
    bundle: "RM19.90",
    gradient: "from-stone-900 via-neutral-950 to-black",
    description:
      "Sesuai untuk pembentangan profesional dengan susunan slide lengkap dan kemas.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">
              slideshop<span className="text-violet-700">.my</span>
            </h1>
            <p className="text-xs text-slate-500">
              Slide profesional PowerPoint untuk pasaran Malaysia
            </p>
          </div>

          <nav className="hidden gap-8 md:flex">
            <Link href="/" className="font-medium hover:text-violet-700">
              Home
            </Link>
            <Link href="/catalog" className="font-medium hover:text-violet-700">
              Katalog
            </Link>
            <Link href="/cart" className="font-medium hover:text-violet-700">
              Cart
            </Link>
          </nav>

          <Link
            href="/catalog"
            className="rounded-2xl bg-violet-700 px-4 py-2.5 font-semibold text-white hover:bg-violet-800"
          >
            Lihat Pakej
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden bg-gradient-to-br from-violet-900 via-fuchsia-800 to-indigo-900 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <div className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm">
              230+ pakej • 1000+ slide
            </div>

            <h2 className="mt-6 text-5xl font-extrabold leading-tight sm:text-6xl">
              Slide PowerPoint
              <span className="block">siap guna & mudah edit</span>
            </h2>

            <p className="mt-6 max-w-xl text-lg text-white/85">
              Pilih sendiri slide yang diperlukan atau ambil pakej lengkap pada
              harga lebih jimat. Sesuai untuk korporat, pendidikan, kreatif dan
              dakwah.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/catalog"
                className="rounded-2xl bg-emerald-500 px-6 py-3.5 text-lg font-bold text-white hover:bg-emerald-600"
              >
                Mula Pilih Slide
              </Link>
              <Link
                href="/catalog"
                className="rounded-2xl bg-white px-6 py-3.5 text-lg font-bold text-violet-800 hover:bg-slate-100"
              >
                Lihat Contoh Pakej
              </Link>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {[
                "PowerPoint boleh edit",
                "Struktur siap guna",
                "Pilihan single & bundle",
                "Sesuai untuk kerja sebenar",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
            {featuredPackages.slice(0, 3).map((pkg, idx) => (
              <div
                key={pkg.title}
                className={`overflow-hidden rounded-3xl border border-white/15 bg-white/10 shadow-2xl ${
                  idx === 1 ? "lg:mt-10" : ""
                }`}
              >
                <div className={`h-40 bg-gradient-to-br ${pkg.gradient} p-4`}>
                  <div className="text-xs uppercase tracking-[0.25em] text-white/70">
                    {pkg.category}
                  </div>
                  <div className="mt-8 text-2xl font-extrabold leading-tight">
                    {pkg.title}
                  </div>
                </div>
                <div className="bg-white/90 p-4 text-slate-900">
                  <div className="text-sm text-slate-500">{pkg.slides} slide</div>
                  <div className="mt-1 font-semibold">Bundle {pkg.bundle}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="text-center">
          <h3 className="text-4xl font-extrabold tracking-tight">
            Pilih mengikut kategori
          </h3>
          <p className="mt-3 text-slate-600">
            Susun ikut kegunaan supaya pengguna tidak pening dengan terlalu
            banyak pilihan.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className={`rounded-3xl bg-gradient-to-br ${cat.color} p-6 shadow-sm ring-1 ring-slate-200`}
            >
              <div className="text-3xl font-extrabold">{cat.name}</div>
              <p className="mt-3 text-sm text-slate-700">{cat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h3 className="text-4xl font-extrabold tracking-tight">
                Pakej pilihan
              </h3>
              <p className="mt-2 text-slate-600">
                Paparkan pakej dahulu. Dalam detail page, pengguna boleh pilih
                satu per satu atau ambil bundle terus.
              </p>
            </div>

            <Link href="/catalog" className="font-semibold text-violet-700">
              Lihat semua
            </Link>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {featuredPackages.slice(0, 3).map((pkg) => (
              <div
                key={pkg.title}
                className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
              >
                <div
                  className={`relative h-56 bg-gradient-to-br ${pkg.gradient} p-5 text-white`}
                >
                  {pkg.thumbnail ? (
                    <div className="absolute inset-0">
                      <img
                        src={pkg.thumbnail}
                        alt={pkg.title}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/20 to-transparent" />
                    </div>
                  ) : null}

                  <div className="relative z-10 flex h-full flex-col">
                    <div className="flex items-start justify-between">
                      <span className="rounded-full bg-amber-300 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-950">
                        Popular
                      </span>
                      <span className="rounded-full bg-white/15 px-3 py-1 text-xs backdrop-blur-sm">
                        {pkg.category}
                      </span>
                    </div>

                    <div className="mt-auto">
                      <div className="text-3xl font-extrabold leading-tight">
                        {pkg.title}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <p className="text-slate-600">{pkg.description}</p>

                  <div className="mt-6 flex items-end justify-between">
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
                        href="/catalog/elegant-business-proposal"
                        className="rounded-2xl border border-slate-300 px-4 py-2.5 font-semibold"
                      >
                        Lihat
                      </Link>
                      <Link
                        href="/catalog"
                        className="rounded-2xl bg-emerald-500 px-4 py-2.5 font-semibold text-white"
                      >
                        Ambil Pakej
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="rounded-[2rem] bg-slate-900 px-8 py-12 text-center text-white">
          <h3 className="text-4xl font-extrabold">
            Siap bina slide anda hari ini
          </h3>
          <p className="mx-auto mt-4 max-w-2xl text-white/75">
            Pilih pakej yang sesuai, edit dalam PowerPoint dan terus guna untuk
            proposal, latihan, kelas atau pembentangan profesional.
          </p>
          <div className="mt-8">
            <Link
              href="/catalog"
              className="rounded-2xl bg-violet-600 px-6 py-3.5 text-lg font-bold text-white hover:bg-violet-700"
            >
              Browse Semua Pakej
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}