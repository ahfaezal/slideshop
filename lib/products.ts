import fs from "fs";
import path from "path";

export type ProductInfo = {
  title?: string;
  slug?: string;
  category?: string;
  price?: number | string;
  description?: string;
  thumbnail?: string;
  previews?: string[];
  file?: string;
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

function safeReadJson(filePath: string): ProductInfo {
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    const cleanRaw = raw.replace(/^\uFEFF/, "").trim();
    return JSON.parse(cleanRaw);
  } catch {
    return {};
  }
}

export function getAllProducts(): ProductCard[] {
  if (!fs.existsSync(PRODUCTS_DIR)) {
    return [];
  }

  const folders = fs
    .readdirSync(PRODUCTS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory());

  const products = folders.map((folder) => {
    const folderSlug = folder.name;
    const productDir = path.join(PRODUCTS_DIR, folderSlug);
    const previewDir = path.join(PREVIEWS_DIR, folderSlug);

    const productFiles = fs.existsSync(productDir)
      ? fs.readdirSync(productDir)
      : [];

    const previewFiles = fs.existsSync(previewDir)
      ? fs.readdirSync(previewDir)
      : [];

    const infoPath = path.join(productDir, "info.json");
    const info: ProductInfo = fs.existsSync(infoPath)
      ? safeReadJson(infoPath)
      : {};

    const slug = info.slug || folderSlug;

    const pptx =
      info.file ||
      productFiles.find((file) => file.toLowerCase().endsWith(".pptx")) ||
      null;

    const thumbnail =
      (typeof info.thumbnail === "string" && info.thumbnail) ||
      previewFiles.find((file) => file.toLowerCase() === "thumbnail.jpg") ||
      null;

    const previews =
      Array.isArray(info.previews) && info.previews.length > 0
        ? [...info.previews].sort()
        : previewFiles
            .filter((file) => /^preview-\d+\.jpg$/i.test(file))
            .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

    return {
      slug,
      title: info.title || slugToTitle(slug),
      category: info.category || inferCategoryFromSlug(slug),
      price: Number(info.price ?? 9.9),
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