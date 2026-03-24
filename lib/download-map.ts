export type DownloadProduct = {
  slug: string;
  title: string;
  price: number;
  fileKey: string;
};

export const DOWNLOAD_MAP: Record<string, DownloadProduct> = {
  "test-slide": {
    slug: "test-slide",
    title: "Test Slide Download",
    price: 1.99,
    fileKey: "test-slide.zip",
  },

  "abstract-company-profile": {
    slug: "abstract-company-profile",
    title: "Abstract Company Profile",
    price: 1.99,
    fileKey: "abstract-company-profile.zip",
  },

  "adventure-photographer-portfolio": {
    slug: "adventure-photographer-portfolio",
    title: "Adventure Photographer Portfolio",
    price: 19.9,
    fileKey: "adventure-photographer-portfolio.zip",
  },

  "asian-food-workshop": {
    slug: "asian-food-workshop",
    title: "Asian Food Workshop",
    price: 19.9,
    fileKey: "asian-food-workshop.zip",
  },

  // ✅ PRODUK UTAMA (WAJIB ADA)
  "elegant-business-proposal": {
    slug: "elegant-business-proposal",
    title: "Elegant Business Proposal Pack",
    price: 19.9,
    fileKey: "elegant-business-proposal-bundle.zip",
  },

  // ✅ ALIAS (elak error slug dari frontend)
  "elegant-business-proposal-proposal": {
    slug: "elegant-business-proposal",
    title: "Elegant Business Proposal Pack",
    price: 19.9,
    fileKey: "elegant-business-proposal-bundle.zip",
  },
};

export function getProductBySlug(slug: string) {
  if (!slug) return null;

  // direct match
  if (DOWNLOAD_MAP[slug]) {
    return DOWNLOAD_MAP[slug];
  }

  // fallback normalize (buang -proposal / -bundle berulang)
  const normalized = slug
    .replace(/-(proposal|bundle)$/, "")
    .replace(/-(proposal|bundle)$/, "");

  return DOWNLOAD_MAP[normalized] || null;
}