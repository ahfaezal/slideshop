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
    fileKey: "test-slide.pptx",
  },
};

export function getProductBySlug(slug: string) {
  if (!slug) return null;

  return DOWNLOAD_MAP[slug] || null;
}