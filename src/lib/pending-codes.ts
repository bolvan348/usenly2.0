/**
 * Vercel KV-backed pending code store.
 * Key: pending:{email} → PendingEntry (TTL 10 min)
 */
import { kv } from "@vercel/kv";

export interface PendingEntry {
  email: string;
  passwordHash: string;
  code: string;
  expiry: string;
  sentAt: string;
  used: boolean;
}

const TTL = 600; // 10 minutes in seconds

export const pendingCodes = {
  async set(email: string, passwordHash: string, code: string): Promise<PendingEntry> {
    const entry: PendingEntry = {
      email: email.toLowerCase(),
      passwordHash,
      code,
      expiry: new Date(Date.now() + TTL * 1000).toISOString(),
      sentAt: new Date().toISOString(),
      used: false,
    };
    await kv.set(`pending:${email.toLowerCase()}`, entry, { ex: TTL });
    return entry;
  },

  async get(email: string): Promise<PendingEntry | undefined> {
    return (await kv.get<PendingEntry>(`pending:${email.toLowerCase()}`)) ?? undefined;
  },

  async updateCode(email: string, newCode: string): Promise<boolean> {
    const existing = await kv.get<PendingEntry>(`pending:${email.toLowerCase()}`);
    if (!existing) return false;
    const updated: PendingEntry = {
      ...existing,
      code: newCode,
      expiry: new Date(Date.now() + TTL * 1000).toISOString(),
      sentAt: new Date().toISOString(),
      used: false,
    };
    await kv.set(`pending:${email.toLowerCase()}`, updated, { ex: TTL });
    return true;
  },

  async remove(email: string): Promise<void> {
    await kv.del(`pending:${email.toLowerCase()}`);
  },
};
