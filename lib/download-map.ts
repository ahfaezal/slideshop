import fs from "fs";
import path from "path";

export type DownloadProduct = {
  slug: string;
  title: string;
  category: string;
  price: number;
  fileKey: string;
  thumbnail: string;
  previews: string[];
};

type ProductInfoJson = {
  slug?: string;
  title?: string;
  category?: string;
  price?: number | string;
  file?: string;
  thumbnail?: string;
  previews?: string[];
};

const BASE_DIR = path.join(process.cwd(), "protected-downloads");

export function getProductBySlug(slug: string): DownloadProduct | null {
  if (!slug) return null;

  const cleanSlug = slug.trim();
  const folderPath = path.join(BASE_DIR, cleanSlug);
  const infoPath = path.join(folderPath, "info.json");

  if (!fs.existsSync(folderPath)) return null;
  if (!fs.existsSync(infoPath)) return null;

  try {
    const raw = fs.readFileSync(infoPath, "utf-8");
    const cleanRaw = raw.replace(/^\uFEFF/, "").trim();
    const data: ProductInfoJson = JSON.parse(cleanRaw);

    if (!data.title || !data.file) return null;

    return {
      slug: data.slug || cleanSlug,
      title: data.title,
      category: data.category || "Company Profile",
      price: Number(data.price ?? 0),
      fileKey: `${cleanSlug}/${data.file}`,
      thumbnail: data.thumbnail || "thumbnail.jpg",
      previews: Array.isArray(data.previews) ? data.previews : [],
    };
  } catch (error) {
    console.log("[getProductBySlug] Gagal parse info.json:", infoPath, error);
    return null;
  }
}

export function getAllProducts(): DownloadProduct[] {
  if (!fs.existsSync(BASE_DIR)) return [];

  const folders = fs.readdirSync(BASE_DIR, { withFileTypes: true });

  const products: DownloadProduct[] = [];

  for (const folder of folders) {
    if (!folder.isDirectory()) continue;

    const product = getProductBySlug(folder.name);
    if (product) products.push(product);
  }

  return products;
}