import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let handle: string, rarity: string, payment: number;
  try {
    ({ handle, rarity, payment } = await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!handle?.trim()) {
    return NextResponse.json({ error: "Handle is required" }, { status: 400 });
  }

  const normalizedHandle = handle.trim().startsWith("@")
    ? handle.trim()
    : `@${handle.trim()}`;

  const user = await db.users.update(session.sub, {
    handle: normalizedHandle,
    rarity,
    payment,
  });

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json({ success: true, handle: normalizedHandle, rarity });
}
