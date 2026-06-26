/**
 * Database adapter with automatic fallback:
 *  - Vercel KV  (production) when KV_REST_API_URL + KV_REST_API_TOKEN are set
 *  - PostgreSQL  (production) when POSTGRES_URL is set (e.g. Supabase)
 *  - Local JSON file (.data/db.json) for local development — no setup needed
 */
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

/* ─────────────────────────────────────────────
   Generic KV interface
───────────────────────────────────────────── */
interface KVStore {
  get<T>(key: string): Promise<T | null>;
  set(key: string, value: unknown, opts?: { ex?: number }): Promise<void>;
  del(key: string): Promise<void>;
  incr(key: string): Promise<number>;
  sadd(key: string, ...members: string[]): Promise<void>;
  smembers(key: string): Promise<string[]>;
}

/* ─────────────────────────────────────────────
   Local JSON file adapter (dev only)
───────────────────────────────────────────── */
function makeFileAdapter(): KVStore {
  // Dynamic imports so Next.js doesn't bundle fs in the browser
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const fs   = require("fs")  as typeof import("fs");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const path = require("path") as typeof import("path");

  const DATA_DIR = path.join(process.cwd(), ".data");
  const DB_FILE  = path.join(DATA_DIR, "db.json");

  type Store = {
    kv:   Record<string, unknown>;
    sets: Record<string, string[]>;
    ttls: Record<string, number>;     // unix ms expiry
  };

  function read(): Store {
    try {
      if (!fs.existsSync(DB_FILE)) return { kv: {}, sets: {}, ttls: {} };
      return JSON.parse(fs.readFileSync(DB_FILE, "utf-8")) as Store;
    } catch {
      return { kv: {}, sets: {}, ttls: {} };
    }
  }

  function write(s: Store): void {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(DB_FILE, JSON.stringify(s, null, 2));
  }

  function isExpired(s: Store, key: string): boolean {
    const exp = s.ttls[key];
    return exp !== undefined && Date.now() > exp;
  }

  return {
    async get<T>(key: string): Promise<T | null> {
      const s = read();
      if (isExpired(s, key)) { delete s.kv[key]; delete s.ttls[key]; write(s); return null; }
      return (s.kv[key] as T) ?? null;
    },
    async set(key: string, value: unknown, opts?: { ex?: number }): Promise<void> {
      const s = read();
      s.kv[key] = value;
      if (opts?.ex) s.ttls[key] = Date.now() + opts.ex * 1000;
      write(s);
    },
    async del(key: string): Promise<void> {
      const s = read();
      delete s.kv[key]; delete s.ttls[key]; delete s.sets[key];
      write(s);
    },
    async incr(key: string): Promise<number> {
      const s = read();
      const cur = typeof s.kv[key] === "number" ? (s.kv[key] as number) : 0;
      s.kv[key] = cur + 1;
      write(s);
      return cur + 1;
    },
    async sadd(key: string, ...members: string[]): Promise<void> {
      const s = read();
      if (!Array.isArray(s.sets[key])) s.sets[key] = [];
      for (const m of members) if (!s.sets[key].includes(m)) s.sets[key].push(m);
      write(s);
    },
    async smembers(key: string): Promise<string[]> {
      const s = read();
      return s.sets[key] ?? [];
    },
  };
}

/* ─────────────────────────────────────────────
   Vercel KV adapter (production)
───────────────────────────────────────────── */
function makeKVAdapter(): KVStore {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { kv } = require("@vercel/kv") as { kv: import("@vercel/kv").VercelKV };
  return {
    get:      (key)          => kv.get(key),
    set:      (key, val, o)  => (o?.ex !== undefined ? kv.set(key, val, { ex: o.ex }) : kv.set(key, val)).then(() => undefined),
    del:      (key)          => kv.del(key).then(() => undefined),
    incr:     (key)          => kv.incr(key),
    sadd:     (key, ...m)    => kv.sadd(key, ...(m as [string, ...string[]])).then(() => undefined),
    smembers: (key)          => kv.smembers(key) as Promise<string[]>,
  };
}

/* ─────────────────────────────────────────────
   PostgreSQL adapter (Supabase / any Postgres)
───────────────────────────────────────────── */
function makePostgresAdapter(): KVStore {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Pool } = require("pg") as typeof import("pg");

  // Prefer non-pooling URL for serverless (avoids pgbouncer prepared-statement issues)
  const connectionString =
    process.env.POSTGRES_URL_NON_POOLING ?? process.env.POSTGRES_URL;

  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    max: 1, // keep connections minimal for serverless
  });

  return {
    async get<T>(key: string): Promise<T | null> {
      const { rows } = await pool.query<{ value: T }>(
        `SELECT value FROM kv_store
         WHERE key = $1 AND (expires_at IS NULL OR expires_at > NOW())`,
        [key],
      );
      return rows[0]?.value ?? null;
    },

    async set(key: string, value: unknown, opts?: { ex?: number }): Promise<void> {
      const expiresAt = opts?.ex
        ? new Date(Date.now() + opts.ex * 1000).toISOString()
        : null;
      await pool.query(
        `INSERT INTO kv_store (key, value, expires_at)
         VALUES ($1, $2::jsonb, $3)
         ON CONFLICT (key) DO UPDATE
           SET value = EXCLUDED.value, expires_at = EXCLUDED.expires_at`,
        [key, JSON.stringify(value), expiresAt],
      );
    },

    async del(key: string): Promise<void> {
      await pool.query(`DELETE FROM kv_store  WHERE key = $1`, [key]);
      await pool.query(`DELETE FROM set_store WHERE key = $1`, [key]);
    },

    async incr(key: string): Promise<number> {
      const { rows } = await pool.query<{ value: number }>(
        `INSERT INTO kv_store (key, value, expires_at)
         VALUES ($1, '1'::jsonb, NULL)
         ON CONFLICT (key) DO UPDATE
           SET value = to_jsonb((kv_store.value::text::int + 1))
         RETURNING value`,
        [key],
      );
      return rows[0].value;
    },

    async sadd(key: string, ...members: string[]): Promise<void> {
      for (const member of members) {
        await pool.query(
          `INSERT INTO set_store (key, member) VALUES ($1, $2)
           ON CONFLICT DO NOTHING`,
          [key, member],
        );
      }
    },

    async smembers(key: string): Promise<string[]> {
      const { rows } = await pool.query<{ member: string }>(
        `SELECT member FROM set_store WHERE key = $1`,
        [key],
      );
      return rows.map(r => r.member);
    },
  };
}

/* ─────────────────────────────────────────────
   Pick adapter at runtime
───────────────────────────────────────────── */
function getStore(): KVStore {
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    return makeKVAdapter();
  }
  if (process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING) {
    return makePostgresAdapter();
  }
  // Local dev fallback
  if (process.env.NODE_ENV !== "production") {
    console.warn("[db] No storage configured — using local .data/db.json");
    return makeFileAdapter();
  }
  throw new Error(
    "No storage configured. Set POSTGRES_URL (Supabase) or KV_REST_API_URL + KV_REST_API_TOKEN (Vercel KV).",
  );
}

// Singleton — created once per process
let _store: KVStore | null = null;
function store(): KVStore {
  if (!_store) _store = getStore();
  return _store;
}

/* ─────────────────────────────────────────────
   Public API — same as before
───────────────────────────────────────────── */
export const db = {
  users: {
    async findByEmail(email: string): Promise<DBUser | undefined> {
      const id = await store().get<string>(`idx:email:${email.toLowerCase()}`);
      if (!id) return undefined;
      return (await store().get<DBUser>(`user:${id}`)) ?? undefined;
    },

    async findById(id: string): Promise<DBUser | undefined> {
      return (await store().get<DBUser>(`user:${id}`)) ?? undefined;
    },

    async findByFingerprint(fingerprintId: string): Promise<DBUser[]> {
      const ids = await store().smembers(`idx:fp:${fingerprintId}`);
      if (!ids?.length) return [];
      const users = await Promise.all(ids.map(id => store().get<DBUser>(`user:${id}`)));
      return users.filter(Boolean) as DBUser[];
    },

    async create(data: Omit<DBUser, "id" | "createdAt">): Promise<DBUser> {
      const user: DBUser = {
        id: randomUUID(),
        createdAt: new Date().toISOString(),
        ...data,
      };
      await store().set(`user:${user.id}`, user);
      await store().set(`idx:email:${user.email.toLowerCase()}`, user.id);
      if (data.fingerprintId) {
        await store().sadd(`idx:fp:${data.fingerprintId}`, user.id);
      }
      return user;
    },

    async update(id: string, data: Partial<DBUser>): Promise<DBUser | undefined> {
      const existing = await store().get<DBUser>(`user:${id}`);
      if (!existing) return undefined;
      const updated = { ...existing, ...data };
      await store().set(`user:${id}`, updated);
      if (data.fingerprintId && data.fingerprintId !== existing.fingerprintId) {
        await store().sadd(`idx:fp:${data.fingerprintId}`, id);
      }
      return updated;
    },

    async upsertByEmail(
      email: string,
      data: Partial<Omit<DBUser, "id" | "createdAt" | "email">>,
    ): Promise<DBUser> {
      const existing = await db.users.findByEmail(email);
      if (existing) return (await db.users.update(existing.id, data)) as DBUser;
      return db.users.create({ email: email.toLowerCase(), passwordHash: "", verified: true, ...data });
    },
  },

  // Generic KV operations (used by stats, telegram, etc.)
  kv: {
    get:  <T>(key: string)                        => store().get<T>(key),
    set:  (key: string, val: unknown, opts?: { ex?: number }) => store().set(key, val, opts),
    del:  (key: string)                           => store().del(key),
    incr: (key: string)                           => store().incr(key),
  },
};
