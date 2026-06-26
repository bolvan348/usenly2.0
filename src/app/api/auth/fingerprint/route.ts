import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  let visitorId: string, confidence: number;
  try {
    ({ visitorId, confidence } = await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  if (!visitorId) return NextResponse.json({ ok: true });

  try {
    // Check for existing accounts with the same fingerprint
    const existing = await db.users.findByFingerprint(visitorId);
    const suspicious = existing.length >= 2;

    // If user is logged in, attach fingerprint to their account
    const session = await getSession();
    if (session?.sub) {
      const user = await db.users.findById(session.sub);
      if (user && !user.fingerprintId) {
        await db.users.update(session.sub, {
          fingerprintId:    visitorId,
          fingerprintScore: confidence,
          suspicious:       suspicious || (user.suspicious ?? false),
        });
      } else if (user && user.fingerprintId && suspicious) {
        await db.users.update(session.sub, { suspicious: true });
      }
    }

    return NextResponse.json({ ok: true, suspicious });
  } catch (err) {
    // KV not configured or unavailable — fingerprint tracking skipped
    console.warn("[fingerprint] KV unavailable, skipping:", err);
    return NextResponse.json({ ok: true, suspicious: false });
  }
}
