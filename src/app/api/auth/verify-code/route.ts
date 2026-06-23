import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  let code: string;
  try {
    ({ code } = await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!code || typeof code !== "string") {
    return NextResponse.json({ error: "Code is required" }, { status: 400 });
  }

  const user = await db.users.findById(session.sub);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  if (user.emailVerified) {
    return NextResponse.json({ ok: true, alreadyVerified: true });
  }

  if (!user.emailCode || !user.emailCodeExpiry) {
    return NextResponse.json({ error: "No code sent — request a new one" }, { status: 400 });
  }

  if (new Date() > new Date(user.emailCodeExpiry)) {
    return NextResponse.json({ error: "Code expired — request a new one" }, { status: 400 });
  }

  if (code.trim() !== user.emailCode) {
    return NextResponse.json({ error: "Incorrect code" }, { status: 400 });
  }

  await db.users.update(user.id, {
    emailVerified:   true,
    emailCode:       undefined,
    emailCodeExpiry: undefined,
  });

  return NextResponse.json({ ok: true });
}
