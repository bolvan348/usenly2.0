import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { db } from "@/lib/db";
import { pendingCodes } from "@/lib/pending-codes";
import { sendVerificationEmail } from "@/lib/emailjs";

export async function POST(req: NextRequest) {
  let email: string, password: string;
  try {
    ({ email, password } = await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!email?.trim() || !password) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
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

  // Rate-limit: 60 s between sends
  const existing = await pendingCodes.get(normalizedEmail);
  if (existing) {
    const elapsed = Date.now() - new Date(existing.sentAt).getTime();
    if (elapsed < 60_000) {
      return NextResponse.json({ error: "Please wait before requesting a new code" }, { status: 429 });
    }
  }

  const passwordHash = await hash(password, 12);
  const code = String(Math.floor(100000 + Math.random() * 900000));
  await pendingCodes.set(normalizedEmail, passwordHash, code);

  try {
    await sendVerificationEmail(normalizedEmail, code);
  } catch (err) {
    console.error("[send-code]", err);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
