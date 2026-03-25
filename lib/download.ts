import crypto from "crypto";
import { pool } from "@/lib/db";

export type DownloadTokenRecord = {
  id: string;
  order_id: string;
  token: string;
  expires_at: string | null;
  used_count: number;
  created_at: string;
};

export async function createDownloadToken(params: {
  orderId: string;
  validHours?: number;
}) {
  const token = crypto.randomBytes(24).toString("hex");
  const validHours = params.validHours ?? 24;

  const result = await pool.query<DownloadTokenRecord>(
    `
    insert into download_tokens (
      order_id,
      token,
      expires_at
    )
    values (
      $1,
      $2,
      now() + ($3 || ' hours')::interval
    )
    returning id, order_id, token, expires_at, used_count, created_at
    `,
    [params.orderId, token, String(validHours)]
  );

  return result.rows[0];
}

export async function getDownloadByToken(token: string) {
  const result = await pool.query<
    DownloadTokenRecord & {
      slug: string;
      product_title: string;
      status: string;
      customer_email: string;
    }
  >(
    `
    select
      dt.id,
      dt.order_id,
      dt.token,
      dt.expires_at,
      dt.used_count,
      dt.created_at,
      o.slug,
      o.product_title,
      o.status,
      o.customer_email
    from download_tokens dt
    join orders o
      on o.order_id = dt.order_id
    where dt.token = $1
    limit 1
    `,
    [token]
  );

  return result.rows[0] || null;
}

export function isDownloadExpired(expiresAt: string | null) {
  if (!expiresAt) return false;
  return new Date(expiresAt).getTime() < Date.now();
}

export async function incrementDownloadCount(token: string) {
  await pool.query(
    `
    update download_tokens
    set used_count = used_count + 1
    where token = $1
    `,
    [token]
  );
}

export async function cleanupExpiredDownloads() {
  const result = await pool.query<DownloadTokenRecord>(
    `
    delete from download_tokens
    where expires_at is not null
      and expires_at < now()
    returning id, order_id, token, expires_at, used_count, created_at
    `
  );

  return result.rows;
}