import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET() {
  try {
    const result = await pool.query("SELECT NOW()");
    return NextResponse.json({ ok: true, time: result.rows[0] });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false });
  }
}