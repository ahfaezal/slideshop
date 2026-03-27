import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

type Params = Promise<{
  slug: string;
}>;

export async function GET(
  _req: Request,
  { params }: { params: Params }
) {
  const { slug } = await params;

  const infoPath = path.join(
    process.cwd(),
    "protected-downloads",
    slug,
    "info.json"
  );

  console.log("API SLUG:", slug);
  console.log("INFO PATH:", infoPath);
  console.log("EXISTS:", fs.existsSync(infoPath));

  if (!fs.existsSync(infoPath)) {
    return NextResponse.json(
      {
        error: "Produk tidak dijumpai.",
        slug,
        infoPath,
      },
      { status: 404 }
    );
  }

  try {
    const raw = fs.readFileSync(infoPath, "utf8");
    const info = JSON.parse(raw);

    return NextResponse.json({
      product: {
        slug,
        title: info.title || slug,
        price: Number(info.price) || 9.9,
        category: info.category || "Presentation",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Gagal membaca info produk.",
        slug,
        infoPath,
      },
      { status: 500 }
    );
  }
}