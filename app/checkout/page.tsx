import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/download-map";
import CheckoutClient from "./CheckoutClient";

type PageProps = {
  searchParams: Promise<{
    slug?: string;
  }>;
};

export default async function CheckoutPage({ searchParams }: PageProps) {
  const { slug } = await searchParams;

  if (!slug || typeof slug !== "string") {
    notFound();
  }

  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return <CheckoutClient product={product} />;
}