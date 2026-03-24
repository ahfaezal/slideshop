import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type Item = {
  title: string;
  price: number;
};

export async function sendDownloadEmail({
  to,
  name,
  items,
  total,
  downloadUrl,
  orderNo,
}: {
  to: string;
  name: string;
  items: Item[];
  total: number;
  downloadUrl: string;
  orderNo: string;
}) {
  // fallback kalau tiada items (single product case)
  const safeItems =
    items && items.length > 0
      ? items
      : [{ title: "Produk Digital", price: total }];

  const itemsHtml = safeItems
    .map((i) => `<li>${i.title} — RM${i.price.toFixed(2)}</li>`)
    .join("");

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">
      <h2>Pembayaran berjaya diterima</h2>

      <p>Hai ${name},</p>

      <p>
        Terima kasih atas pembelian anda di <strong>Slideshop.my</strong>.
        Pembayaran anda telah berjaya diproses.
      </p>

      <p><strong>No. Pesanan:</strong> ${orderNo}</p>

      <h3>Ringkasan pembelian</h3>
      <ul>${itemsHtml}</ul>

      <p><strong>Jumlah bayaran: RM${total.toFixed(2)}</strong></p>

      <p>
        Pautan download ini sah selama <strong>24 jam</strong> sahaja atas faktor keselamatan.
      </p>

      <p>
        <a href="${downloadUrl}" 
          style="display:inline-block;padding:12px 18px;background:#6d28d9;color:#fff;text-decoration:none;border-radius:10px;font-weight:bold;">
          Muat Turun Sekarang
        </a>
      </p>

      <p>Jika butang tidak berfungsi, gunakan pautan ini:</p>
      <p><a href="${downloadUrl}">${downloadUrl}</a></p>

      <hr style="margin:24px 0;border:none;border-top:1px solid #eee;" />

      <p style="font-size:12px;color:#666">
        Ini adalah email automatik. Sila simpan pautan download anda.
      </p>

      <p>Terima kasih,<br/>Slideshop.my</p>
    </div>
  `;

  return resend.emails.send({
    from: process.env.SMTP_FROM || "Slideshop <sales@slideshop.my>",
    to,
    subject: `Pembelian berjaya - ${orderNo}`,
    html,
  });
}