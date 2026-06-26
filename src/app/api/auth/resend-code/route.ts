/**
 * Resend a verification code by issuing a fresh JWT token.
 * Client must pass the old pendingToken so we can extract email/passwordHash.
 */
import { NextRequest, NextResponse } from "next/server";
import { pendingCodes } from "@/lib/pending-codes";
import { sendVerificationEmail } from "@/lib/emailjs";

export async function POST(req: NextRequest) {
  try {
    let email: string, pendingToken: string;
    try {
      ({ email, pendingToken } = await req.json());
    } catch {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    if (!email?.trim()) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Extract passwordHash from old token (code mismatch is fine — we issue a new one)
    let passwordHash = "";
    try {
      const { jwtVerify } = await import("jose");
      const secret = new TextEncoder().encode(
        process.env.JWT_SECRET ?? "usenly-fallback-secret-change-me",
      );
      const { payload } = await jwtVerify(pendingToken, secret);
      passwordHash = payload.passwordHash as string;
    } catch {
      return NextResponse.json(
        { error: "Invalid or expired session. Please restart registration." },
        { status: 400 },
      );
    }

    const newCode = String(Math.floor(100000 + Math.random() * 900000));
    const newToken = await pendingCodes.createToken(normalizedEmail, passwordHash, newCode);

    try {
      await sendVerificationEmail(normalizedEmail, newCode);
    } catch (err) {
      console.error("[resend-code] email error:", err);
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }

    return NextResponse.json({ ok: true, pendingToken: newToken });
  } catch (err) {
    console.error("[resend-code] unexpected:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
