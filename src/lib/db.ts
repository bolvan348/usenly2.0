/**
 * Vercel KV-backed user store.
 * Key layout:
 *   user:{id}               → DBUser JSON
 *   idx:email:{email}       → user id
 *   idx:fp:{fingerprintId}  → Redis Set of user ids
 */
import { kv } from "@vercel/kv";
import { randomUUID } from "crypto";

export interface DBUser {
  id: string;
  email: string;
  passwordHash: string;
  handle?: string;
  rarity?: string;
  payment?: number;
  platform?: string;
  socialUsername?: string;
  verified: boolean;
  createdAt: string;
  fingerprintId?: string;
  fingerprintScore?: number;
  suspicious?: boolean;
  emailCode?: string;
  emailCodeExpiry?: string;
  emailVerified?: boolean;
}

export const db = {
  users: {
    async findByEmail(email: string): Promise<DBUser | undefined> {
      const id = await kv.get<string>(`idx:email:${email.toLowerCase()}`);
      if (!id) return undefined;
      return (await kv.get<DBUser>(`user:${id}`)) ?? undefined;
    },

    async findById(id: string): Promise<DBUser | undefined> {
      return (await kv.get<DBUser>(`user:${id}`)) ?? undefined;
    },

    async findByFingerprint(fingerprintId: string): Promise<DBUser[]> {
      const ids = await kv.smembers(`idx:fp:${fingerprintId}`) as string[];
      if (!ids?.length) return [];
      const users = await Promise.all(ids.map((id: string) => kv.get<DBUser>(`user:${id}`)));
      return users.filter(Boolean) as DBUser[];
    },

    async create(data: Omit<DBUser, "id" | "createdAt">): Promise<DBUser> {
      const user: DBUser = {
        id: randomUUID(),
        createdAt: new Date().toISOString(),
        ...data,
      };
      await kv.set(`user:${user.id}`, user);
      await kv.set(`idx:email:${user.email.toLowerCase()}`, user.id);
      if (data.fingerprintId) {
        await kv.sadd(`idx:fp:${data.fingerprintId}`, user.id);
      }
      return user;
    },

    async update(id: string, data: Partial<DBUser>): Promise<DBUser | undefined> {
      const existing = await kv.get<DBUser>(`user:${id}`);
      if (!existing) return undefined;
      const updated = { ...existing, ...data };
      await kv.set(`user:${id}`, updated);
      if (data.fingerprintId && data.fingerprintId !== existing.fingerprintId) {
        await kv.sadd(`idx:fp:${data.fingerprintId}`, id);
      }
      return updated;
    },

    async upsertByEmail(
      email: string,
      data: Partial<Omit<DBUser, "id" | "createdAt" | "email">>,
    ): Promise<DBUser> {
      const existing = await db.users.findByEmail(email);
      if (existing) {
        return (await db.users.update(existing.id, data)) as DBUser;
      }
      return db.users.create({
        email: email.toLowerCase(),
        passwordHash: "",
        verified: true,
        ...data,
      });
    },
  },
};
