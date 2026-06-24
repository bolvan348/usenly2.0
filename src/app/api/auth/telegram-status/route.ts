/**
 * Polled by the frontend to check if Telegram verification is complete.
 * The bot must have called /api/auth/telegram-verify first.
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

function generateVerifyCode(email: string): string {
  let h = 5381;
  for (let i = 0; i < email.length; i++) h = ((h * 33) ^ email.charCodeAt(i)) >>> 0;
  const C = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "", n = h;
  for (let i = 0; i < 6; i++) { code += C[n % C.length]; n = Math.floor(n / C.length); }
  return `USENLY-${code}`;
}

export async function GET(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get("email");
    if (!email) return NextResponse.json({ verified: false }, { status: 400 });

    const code = generateVerifyCode(email.toLowerCase());

    const entry = await db.kv.get<{ verified: boolean }>(`tg:${code}`);
    if (entry?.verified) {
      await db.kv.del(`tg:${code}`);
      return NextResponse.json({ verified: true });
    }

    return NextResponse.json({ verified: false });
  } catch (err) {
    console.error("[telegram-status]", err);
    return NextResponse.json({ verified: false });
  }
}
