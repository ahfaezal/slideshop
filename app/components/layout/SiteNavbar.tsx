import Link from "next/link";

export default function SiteNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#07111f]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400 text-sm font-black text-slate-950 shadow-[0_10px_30px_rgba(52,211,153,0.35)]">
            S
          </div>
          <div>
            <div className="text-lg font-black tracking-tight text-white">
              Slideshop
            </div>
            <div className="text-xs text-slate-400">
              Premium PowerPoint Marketplace
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className="text-sm font-medium text-slate-300 transition hover:text-white"
          >
            Home
          </Link>
          <Link
            href="/catalog"
            className="text-sm font-medium text-slate-300 transition hover:text-white"
          >
            Products
          </Link>
          <Link
            href="/categories"
            className="text-sm font-medium text-slate-300 transition hover:text-white"
          >
            Categories
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/categories"
            className="hidden rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 sm:inline-flex"
          >
            Explore
          </Link>
          <Link
            href="/catalog"
            className="inline-flex rounded-2xl bg-emerald-400 px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-emerald-300"
          >
            Browse Templates
          </Link>
        </div>
      </div>
    </header>
  );
}