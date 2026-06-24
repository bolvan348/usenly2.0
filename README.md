# Usenly 2.0

Collect digital identities as unique pixel penguins. Next.js 15 app with Telegram / X / Discord / GitHub verification and TON payments.

## Stack

- Next.js 15 (App Router)
- TypeScript, Tailwind CSS v4
- Framer Motion, shadcn/ui
- Vercel KV (user storage)
- TON Connect, Resend (email)

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy on Vercel

1. Push this repo to GitHub and import in [Vercel](https://vercel.com).
2. Framework preset: **Next.js** (auto-detected).
3. Add environment variables in Project Settings → Environment Variables:

| Variable | Required | Description |
|----------|----------|-------------|
| `KV_REST_API_URL` | Yes | Vercel KV REST URL |
| `KV_REST_API_TOKEN` | Yes | Vercel KV REST token |
| `JWT_SECRET` | Yes | Random secret for auth sessions |
| `RESEND_API_KEY` | Yes | Resend API key for email codes |
| `RESEND_FROM` | Yes | Verified sender email |
| `NEXT_PUBLIC_APP_URL` | Yes | Production URL (e.g. `https://your-app.vercel.app`) |

4. Link a **Vercel KV** store to the project (Storage tab).
5. Deploy — build command: `npm run build`.

`vercel.json` is included with `iad1` region and Next.js framework settings.

## Project structure

- `src/components/landing/` — Hero, Navbar, Footer, gallery
- `src/components/bear/PixelPenguin.tsx` — procedural pixel penguins
- `src/app/api/auth/` — registration, OAuth, claim
- `src/lib/db.ts` — Vercel KV user store
