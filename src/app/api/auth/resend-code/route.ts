import { NextRequest, NextResponse } from "next/server";
import { pendingCodes } from "@/lib/pending-codes";
import { getSupabaseAdmin } from "@/lib/supabase-server";

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

    // Verify the old token is still valid (not expired, correct signature)
    const pending = await pendingCodes.decode(pendingToken);
    if (!pending) {
      return NextResponse.json(
        { error: "Invalid or expired session. Please restart registration." },
        { status: 400 },
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Resend OTP via Supabase — same pendingToken returned (passwordHash unchanged)
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.auth.signInWithOtp({
      email: normalizedEmail,
      options: { shouldCreateUser: true },
    });

    if (error) {
      console.error("[resend-code] Supabase OTP error:", error);
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }

    return NextResponse.json({ ok: true, pendingToken });
  } catch (err) {
    console.error("[resend-code] unexpected:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
