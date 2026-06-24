/**
 * Called by the Telegram bot when a user sends /start <code>.
 * Stores verification status in KV with a 10-minute TTL.
 *
 * Auth: shared BOT_SECRET env var (set in both Vercel and bot env).
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const BOT_SECRET = process.env.BOT_SECRET ?? "";
const TTL = 600; // 10 minutes

export async function POST(req: NextRequest) {
  try {
    let code: string, secret: string;
    try {
      ({ code, secret } = await req.json());
    } catch {
      return NextResponse.json({ error: "Invalid body" }, { status: 400 });
    }

    // In production BOT_SECRET must match; in dev allow if BOT_SECRET not set
    const isDev = process.env.NODE_ENV !== "production";
    if (BOT_SECRET && secret !== BOT_SECRET) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (!BOT_SECRET && !isDev) {
      return NextResponse.json({ error: "BOT_SECRET not configured" }, { status: 500 });
    }

    if (!code?.startsWith("USENLY-")) {
      return NextResponse.json({ error: "Invalid code format" }, { status: 400 });
    }

    await db.kv.set(`tg:${code}`, { verified: true, at: new Date().toISOString() }, { ex: TTL });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[telegram-verify]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
