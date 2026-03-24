type Props = {
  searchParams: Promise<{
    product_slug?: string;
  }>;
};

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const params = await searchParams;
  const productSlug = params.product_slug || "";

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-6 shadow">
        <h1 className="text-3xl font-bold">Terima kasih</h1>
        <p className="mt-3 text-slate-600">
          Anda telah kembali dari halaman bayaran ToyyibPay.
        </p>

        <div className="mt-4 rounded-lg bg-slate-100 p-4">
          <p className="text-sm text-slate-500">product_slug</p>
          <p className="font-medium">{productSlug || "-"}</p>
        </div>

        <p className="mt-4 text-sm text-slate-600">
          Status sebenar bayaran akan disahkan melalui callback server.
        </p>
      </div>
    </main>
  );
}