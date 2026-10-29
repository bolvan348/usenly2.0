-- Run once against the PostgreSQL database configured in Vercel.
-- Existing data is preserved.
CREATE TABLE IF NOT EXISTS public.kv_store (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  expires_at timestamptz
);

CREATE TABLE IF NOT EXISTS public.set_store (
  key text NOT NULL,
  member text NOT NULL,
  PRIMARY KEY (key, member)
);

-- Only the server-side PostgreSQL adapter accesses these tables.
ALTER TABLE public.kv_store ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.set_store ENABLE ROW LEVEL SECURITY;
