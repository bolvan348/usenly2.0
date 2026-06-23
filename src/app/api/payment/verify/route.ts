import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { getTransaction } from "@/lib/ton-api";

const RECEIVER = (process.env.NEXT_PUBLIC_TON_RECEIVER ?? "").toLowerCase();

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  let txHash: string, expectedUsd: number;
  try {
    ({ txHash, expectedUsd } = await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  try {
    const tx = await getTransaction(txHash);
    const inMsg = tx.in_msg;

    if (!inMsg) return NextResponse.json({ verified: false, reason: "No incoming message" });

    const dest = inMsg.destination?.address?.toLowerCase() ?? "";
    const value = inMsg.value ?? 0;

    if (!dest.includes(RECEIVER.replace(/[^a-z0-9]/gi, "").toLowerCase()) && RECEIVER) {
      return NextResponse.json({ verified: false, reason: "Wrong destination" });
    }

    const tonFromApi = value / 1e9;
    console.log(`[payment/verify] tx=${txHash} value=${tonFromApi} TON`);

    const user = await db.users.findById(session.sub);
    if (user && !user.payment) {
      await db.users.update(user.id, { payment: expectedUsd });
    }

    return NextResponse.json({ verified: true, tonAmount: tonFromApi });
  } catch (err) {
    console.error("[payment/verify]", err);
    return NextResponse.json({ verified: false, reason: "TonAPI error" });
  }
}
