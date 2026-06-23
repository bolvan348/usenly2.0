import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await db.users.findById(session.sub);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json({
    id: user.id,
    email: user.email,
    handle: user.handle ?? null,
    rarity: user.rarity ?? null,
    payment: user.payment ?? null,
    platform: user.platform ?? null,
    socialUsername: user.socialUsername ?? null,
    verified: user.verified,
  });
}
