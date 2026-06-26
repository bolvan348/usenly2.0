import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { pendingCodes } from "@/lib/pending-codes";
import { signToken, attachSession } from "@/lib/auth";

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

    // Verify JWT token + entered code (stateless — no DB needed)
    const verified = await pendingCodes.verify(pendingToken, code.trim());
    if (!verified) {
      return NextResponse.json({ error: "invalid" }, { status: 400 });
    }

    // Ensure token email matches request email
    if (verified.email !== email.trim().toLowerCase()) {
      return NextResponse.json({ error: "invalid" }, { status: 400 });
    }

    // Create user in DB
    try {
      let user = await db.users.findByEmail(verified.email);
      if (!user) {
        user = await db.users.create({
          email:         verified.email,
          passwordHash:  verified.passwordHash,
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
