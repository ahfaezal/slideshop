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
};

export function getProductBySlug(slug: string) {
  return DOWNLOAD_MAP[slug] || null;
}