import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { randomInt } from "crypto";
import { db } from "@/lib/db";
import { pendingCodes } from "@/lib/pending-codes";
import { sendVerificationEmail } from "@/lib/emailjs";

export async function POST(req: NextRequest) {
  try {
    let email: string, password: string;
    try {
      ({ email, password } = await req.json());
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    if (typeof email !== "string" || !email.trim() || typeof password !== "string" || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check duplicate — graceful if DB not configured
    try {
      const existing = await db.users.findByEmail(normalizedEmail);
      if (existing) {
        return NextResponse.json({ error: "This email is already registered" }, { status: 409 });
      }
    } catch (err) {
      console.error("[send-code] storage unavailable:", err);
      return NextResponse.json({ error: "Account service is temporarily unavailable. Please try again later." }, { status: 503 });
    }

    const passwordHash = await hash(password, 12);
    const code = String(randomInt(100000, 1000000));

    // JWT carries email + passwordHash + code — no DB write needed at this step
    const pendingToken = await pendingCodes.createToken(normalizedEmail, passwordHash, code);

    try {
      await sendVerificationEmail(normalizedEmail, code);
    } catch (err) {
      console.error("[send-code] email error:", err);
      return NextResponse.json({ error: "Failed to send verification email" }, { status: 500 });
    }

    return NextResponse.json({ ok: true, pendingToken });
  } catch (err) {
    console.error("[send-code] unexpected:", err);
    return NextResponse.json({ error: "Server error. Please try again." }, { status: 500 });
  }
}
