import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { pendingCodes } from "@/lib/pending-codes";
import { signToken, attachSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  let email: string, code: string;
  try {
    ({ email, code } = await req.json());
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  if (!email?.trim() || !code?.trim()) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const pending = await pendingCodes.get(normalizedEmail);

  // Every failure returns the same "invalid" — no technical details exposed
  if (!pending)                                   return NextResponse.json({ error: "invalid" }, { status: 400 });
  if (pending.used)                               return NextResponse.json({ error: "invalid" }, { status: 400 });
  if (new Date() > new Date(pending.expiry))      return NextResponse.json({ error: "invalid" }, { status: 400 });
  if (code.trim() !== pending.code)               return NextResponse.json({ error: "invalid" }, { status: 400 });

  // ✅ Code correct — remove entry immediately (prevents reuse)
  await pendingCodes.remove(normalizedEmail);

  // Create account (guard against race condition)
  let user = await db.users.findByEmail(normalizedEmail);
  if (!user) {
    user = await db.users.create({
      email:         normalizedEmail,
      passwordHash:  pending.passwordHash,
      verified:      true,
      emailVerified: true,
    });
  }

  const token = await signToken({ sub: user.id, email: user.email });
  const res = NextResponse.json(
    { ok: true, id: user.id, email: user.email },
    { status: 201 },
  );
  return attachSession(res, token);
}
