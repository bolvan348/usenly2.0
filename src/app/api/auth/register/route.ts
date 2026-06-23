import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
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
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (await db.users.findByEmail(normalizedEmail)) {
    return NextResponse.json({ error: "This email is already registered" }, { status: 409 });
  }

  const passwordHash = await hash(password, 12);
  const user = await db.users.create({
    email: normalizedEmail,
    passwordHash,
    verified: false,
    emailVerified: false,
  });

  const token = await signToken({ sub: user.id, email: user.email });
  const res = NextResponse.json(
    { id: user.id, email: user.email, emailVerified: false },
    { status: 201 },
  );
  return attachSession(res, token);
}
