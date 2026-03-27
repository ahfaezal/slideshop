import Link from "next/link";
import SectionHeader from "@/app/components/shared/SectionHeader";
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

function CategoryCard({
  name,
  slug,
  description,
  count,
}: {
  name: string;
  slug: string;
  description: string;
  count: number;
}) {
  return (
    <Link
      href={`/categories/${slug}`}
      className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.25)] backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-400/30 hover:bg-white/[0.06]"
    >
      <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-emerald-400/10 blur-2xl transition duration-300 group-hover:bg-emerald-400/20" />

      <div className="relative">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-black/30 text-lg font-black text-white">
          {name.charAt(0)}
        </div>

        <h3 className="mt-5 text-xl font-bold text-white">{name}</h3>

        <p className="mt-3 text-sm leading-6 text-slate-400">{description}</p>

        <div className="mt-5 flex items-center justify-between">
          <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-300">
            {count} produk
          </span>
          <span className="text-sm font-semibold text-white transition group-hover:translate-x-1">
            Explore →
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function CategoryGridSection({
  products,
}: {
  products: Product[];
}) {
  return (
    <section className="relative py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Browse by Category"
          title="Terokai template mengikut kategori"
          description="Susunan kategori premium supaya pelanggan lebih mudah cari jenis slide yang mereka perlukan."
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {categoryList.map((category) => (
            <CategoryCard
              key={category.slug}
              name={category.name}
              slug={category.slug}
              description={category.description}
              count={getCategoryCount(products, category.slug)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}