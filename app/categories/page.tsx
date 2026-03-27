import Link from "next/link";
import SiteNavbar from "@/app/components/layout/SiteNavbar";
import SectionHeader from "@/app/components/shared/SectionHeader";
import { getAllProducts } from "@/lib/products";
import type { Product } from "@/app/components/products/ProductCard";

type CategoryItem = {
  name: string;
  slug: string;
  description: string;
};

const categoryList: CategoryItem[] = [
  {
    name: "Company Profile",
    slug: "company-profile",
    description: "Template profesional untuk syarikat, agensi dan organisasi.",
  },
  {
    name: "Business Plan",
    slug: "business-plan",
    description: "Pembentangan kemas untuk pelan perniagaan dan pitching.",
  },
  {
    name: "Proposal",
    slug: "proposal",
    description: "Slide rasmi untuk cadangan projek, tender dan pembentangan.",
  },
  {
    name: "Pitch Deck",
    slug: "pitch-deck",
    description: "Direka untuk startup, fundraising dan investor presentation.",
  },
  {
    name: "Education",
    slug: "education",
    description: "Sesuai untuk pensyarah, guru dan pembentangan akademik.",
  },
  {
    name: "Creative",
    slug: "creative",
    description: "Visual moden untuk designer, agency dan freelancer.",
  },
  {
    name: "Marketing",
    slug: "marketing",
    description: "Untuk sales deck, branding dan strategi pemasaran.",
  },
  {
    name: "Dakwah",
    slug: "dakwah",
    description: "Template Islamik premium untuk ceramah dan perkongsian.",
  },
];

function getCategoryCount(products: Product[], slug: string) {
  return products.filter((product) => {
    const cat = (product.category || "").toLowerCase().trim();
    const target = slug.toLowerCase().trim();

    return (
      cat === target ||
      cat.includes(target.replace(/-/g, " ")) ||
      target.includes(cat.replace(/\s+/g, "-"))
    );
  }).length;
}

export default function CategoriesPage() {
  const products = (getAllProducts() as Product[]) ?? [];

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
                href="/"
                className="inline-flex items-center text-sm font-medium text-slate-400 transition hover:text-white"
              >
                ← Kembali ke homepage
              </Link>

              <div className="inline-flex w-fit rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-300">
                {categoryList.length} kategori tersedia
              </div>
            </div>

            <SectionHeader
              eyebrow="All Categories"
              title="Pilih kategori template yang anda perlukan"
              description="Susunan kategori untuk memudahkan pelanggan mencari jenis pembentangan yang sesuai dengan keperluan mereka."
            />

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {categoryList.map((category) => (
                <Link
                  key={category.slug}
                  href={`/categories/${category.slug}`}
                  className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.25)] backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-400/30 hover:bg-white/[0.06]"
                >
                  <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-emerald-400/10 blur-2xl transition duration-300 group-hover:bg-emerald-400/20" />

                  <div className="relative">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-black/30 text-lg font-black text-white">
                      {category.name.charAt(0)}
                    </div>

                    <h3 className="mt-5 text-xl font-bold text-white">
                      {category.name}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-slate-400">
                      {category.description}
                    </p>

                    <div className="mt-5 flex items-center justify-between">
                      <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-300">
                        {getCategoryCount(products, category.slug)} produk
                      </span>

                      <span className="text-sm font-semibold text-white transition group-hover:translate-x-1">
                        View →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}