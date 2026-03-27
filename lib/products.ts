import productsData from "@/data/products.json";

export type ProductInfo = {
  title?: string;
  slug?: string;
  category?: string;
  price?: number | string;
  description?: string;
  thumbnail?: string;
  previews?: string[];
  file?: string;
  fileKey?: string;
};

export type ProductCard = {
  slug: string;
  title: string;
  category: string;
  price: number;
  thumbnail: string | null;
  previews: string[];
  pptx: string | null;
  description?: string;
};

function normalizeProduct(item: ProductInfo): ProductCard {
  const slug = item.slug?.trim() || "";

  return {
    slug,
    title: item.title?.trim() || slugToTitle(slug),
    category: item.category?.trim() || inferCategoryFromSlug(slug),
    price: Number(item.price ?? 9.9),
    thumbnail: item.thumbnail?.trim() || null,
    previews: Array.isArray(item.previews)
      ? item.previews.filter(Boolean)
      : [],
    pptx: item.fileKey?.trim() || item.file?.trim() || null,
    description: item.description?.trim() || undefined,
  };
}

export function getAllProducts(): ProductCard[] {
  if (!Array.isArray(productsData)) {
    return [];
  }

  return (productsData as ProductInfo[])
    .map(normalizeProduct)
    .filter((product) => product.slug)
    .sort((a, b) => a.title.localeCompare(b.title));
}

export function getProductsByPrefix(prefix: string): ProductCard[] {
  return getAllProducts().filter((product) => product.slug.startsWith(prefix));
}

export function getProductBySlug(slug: string): ProductCard | undefined {
  return getAllProducts().find((product) => product.slug === slug);
}

export function getProductsByCategory(category: string): ProductCard[] {
  return getAllProducts().filter(
    (product) => product.category.toLowerCase() === category.toLowerCase()
  );
}

export function getFeaturedProducts(limit = 6): ProductCard[] {
  return getAllProducts().slice(0, limit);
}

export function getAllCategories(): string[] {
  return Array.from(
    new Set(getAllProducts().map((product) => product.category).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b));
}

function slugToTitle(slug: string): string {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function inferCategoryFromSlug(slug: string): string {
  if (slug.startsWith("company-profile-")) return "Company Profile";
  if (slug.startsWith("business-plan-")) return "Business Plan";
  if (slug.startsWith("pitch-deck-")) return "Pitch Deck";
  return "Presentation";
}