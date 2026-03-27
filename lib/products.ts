import fs from "fs";
import path from "path";

export type ProductInfo = {
  title?: string;
  slug?: string;
  category?: string;
  price?: number;
  description?: string;
};

export type ProductCard = {
  slug: string;
  title: string;
  category: string;
  price: number;
  thumbnail: string | null;
  previews: string[];
  pptx: string | null;
};

const PRODUCTS_DIR = path.join(process.cwd(), "protected-downloads");
const PREVIEWS_DIR = path.join(process.cwd(), "public", "product-previews");

export function getAllProducts(): ProductCard[] {
  if (!fs.existsSync(PRODUCTS_DIR)) {
    return [];
  }

  const folders = fs
    .readdirSync(PRODUCTS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory());

  const products = folders.map((folder) => {
    const slug = folder.name;
    const productDir = path.join(PRODUCTS_DIR, slug);
    const previewDir = path.join(PREVIEWS_DIR, slug);

    const productFiles = fs.existsSync(productDir)
      ? fs.readdirSync(productDir)
      : [];

    const previewFiles = fs.existsSync(previewDir)
      ? fs.readdirSync(previewDir)
      : [];

    const pptx =
      productFiles.find((file) => file.toLowerCase().endsWith(".pptx")) ?? null;

    const infoPath = path.join(productDir, "info.json");

    let info: ProductInfo = {};
    if (fs.existsSync(infoPath)) {
      try {
        info = JSON.parse(fs.readFileSync(infoPath, "utf8"));
      } catch {
        info = {};
      }
    }

    const thumbnail =
      previewFiles.find((file) => file.toLowerCase() === "thumbnail.jpg") ??
      null;

    const previews = previewFiles
      .filter((file) => /^preview-\d+\.jpg$/i.test(file))
      .sort();

    return {
      slug,
      title: info.title || slugToTitle(slug),
      category: info.category || inferCategoryFromSlug(slug),
      price: typeof info.price === "number" ? info.price : 9.9,
      thumbnail,
      previews,
      pptx,
    };
  });

  return products.sort((a, b) => a.title.localeCompare(b.title));
}

export function getProductsByPrefix(prefix: string): ProductCard[] {
  return getAllProducts().filter((product) => product.slug.startsWith(prefix));
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