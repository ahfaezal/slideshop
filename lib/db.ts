import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var __pgPool: Pool | undefined;
}

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL belum diset dalam .env.local");
}

export const pool =
  global.__pgPool ||
  new Pool({
    connectionString,

    // 🔥 Supabase WAJIB guna SSL
    ssl: {
      rejectUnauthorized: false,
    },

    // 🔥 optional tuning (bagus untuk production)
    max: 10, // max connection
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });

// elak multiple connection masa dev (Next.js hot reload)
if (process.env.NODE_ENV !== "production") {
  global.__pgPool = pool;
}