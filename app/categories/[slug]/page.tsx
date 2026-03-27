type Props = {
  params: {
    slug: string;
  };
};

export default function CategoryDetailPage({ params }: Props) {
  return (
    <main style={{ padding: "40px", color: "white", background: "#07111f", minHeight: "100vh" }}>
      <h1>Category Route OK</h1>
      <p>Slug: {params.slug}</p>
    </main>
  );
}