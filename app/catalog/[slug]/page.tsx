import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function LegacyCatalogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  redirect(`/product/${slug}`);
}