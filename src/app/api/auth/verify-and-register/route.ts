import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { pendingCodes } from "@/lib/pending-codes";
import { signToken, attachSession } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  try {
    let email: string, code: string, pendingToken: string;
    try {
      ({ email, code, pendingToken } = await req.json());
    } catch {
      return NextResponse.json({ error: "invalid" }, { status: 400 });
    }

    if (!email?.trim() || !code?.trim() || !pendingToken) {
      return NextResponse.json({ error: "invalid" }, { status: 400 });
    }

    // Decode JWT to get passwordHash (no code check — Supabase handles that)
    const pending = await pendingCodes.decode(pendingToken);
    if (!pending) {
      return NextResponse.json({ error: "invalid" }, { status: 400 });
    }

    // Ensure token email matches request email
    if (pending.email !== email.trim().toLowerCase()) {
      return NextResponse.json({ error: "invalid" }, { status: 400 });
    }

    // Verify OTP with Supabase Auth
    const supabase = getSupabaseAdmin();
    const { error: otpError } = await supabase.auth.verifyOtp({
      email: pending.email,
      token: code.trim(),
      type:  "email",
    });

    if (otpError) {
      console.warn("[verify-and-register] OTP invalid:", otpError.message);
      return NextResponse.json({ error: "invalid" }, { status: 400 });
    }

    // OTP verified — create user in our DB
    try {
      let user = await db.users.findByEmail(pending.email);
      if (!user) {
        user = await db.users.create({
          email:         pending.email,
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
    } catch (dbErr) {
      console.error("[verify-and-register] db error:", dbErr);
      return NextResponse.json(
        { error: "Database error — contact admin" },
        { status: 503 },
      );
    }
  } catch (err) {
    console.error("[verify-and-register] unexpected:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
