import { NextRequest, NextResponse } from "next/server";
import { pendingCodes } from "@/lib/pending-codes";
import { sendVerificationEmail } from "@/lib/emailjs";

export async function POST(req: NextRequest) {
  let email: string;
  try {
    ({ email } = await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!email?.trim()) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const existing = await pendingCodes.get(normalizedEmail);

  if (!existing) {
    return NextResponse.json({ error: "No pending verification for this email" }, { status: 400 });
  }

  const elapsed = Date.now() - new Date(existing.sentAt).getTime();
  if (elapsed < 60_000) {
    return NextResponse.json({ error: "Please wait before requesting a new code" }, { status: 429 });
  }

  const newCode = String(Math.floor(100000 + Math.random() * 900000));
  await pendingCodes.updateCode(normalizedEmail, newCode);

  try {
    await sendVerificationEmail(normalizedEmail, newCode);
  } catch (err) {
    console.error("[resend-code]", err);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
