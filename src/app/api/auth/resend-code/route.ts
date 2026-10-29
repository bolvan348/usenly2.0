/**
 * Resend a verification code by issuing a fresh JWT token.
 * Client must pass the old pendingToken so we can extract email/passwordHash.
 */
import { NextRequest, NextResponse } from "next/server";
import { randomInt } from "crypto";
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

    if (typeof email !== "string" || !email.trim() || typeof pendingToken !== "string") {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Extract passwordHash from old token (code mismatch is fine — we issue a new one)
    const pending = await pendingCodes.read(pendingToken);
    if (!pending || pending.email !== normalizedEmail) {
      return NextResponse.json(
        { error: "Invalid or expired session. Please restart registration." },
        { status: 400 },
      );
    }

    const newCode = String(randomInt(100000, 1000000));
    const newToken = await pendingCodes.createToken(normalizedEmail, pending.passwordHash, newCode);

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
