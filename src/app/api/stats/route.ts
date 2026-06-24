import { NextResponse } from "next/server";
import { db } from "@/lib/db";

const TOTAL = 10_000;

export const revalidate = 60; // cache for 60s

export async function GET() {
  try {
    const count = await db.kv.get<number>("mint:count") ?? 0;
    return NextResponse.json({
      total:     TOTAL,
      minted:    count,
      remaining: TOTAL - count,
      pct:       Math.round((count / TOTAL) * 100),
    });
  } catch {
    // KV not configured — return defaults
    return NextResponse.json({
      total:     TOTAL,
      minted:    0,
      remaining: TOTAL,
      pct:       0,
    });
  }
}
