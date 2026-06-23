import { NextRequest, NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { db } from "@/lib/db";
import { signToken, attachSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  let email: string, password: string;
  try {
    ({ email, password } = await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!email?.trim() || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  }

  const user = await db.users.findByEmail(email.trim().toLowerCase());

  const INVALID = { error: "Invalid email or password" };
  if (!user) return NextResponse.json(INVALID, { status: 401 });
  if (!user.passwordHash) {
    return NextResponse.json(
      { error: "This account uses social login. Please sign in with your connected platform." },
      { status: 401 },
    );
  }

  const valid = await compare(password, user.passwordHash);
  if (!valid) return NextResponse.json(INVALID, { status: 401 });

  const token = await signToken({ sub: user.id, email: user.email });
  const res = NextResponse.json({
    id: user.id,
    email: user.email,
    handle: user.handle ?? null,
    rarity: user.rarity ?? null,
    payment: user.payment ?? null,
    platform: user.platform ?? null,
    emailVerified: user.emailVerified ?? false,
  });
  return attachSession(res, token);
}
