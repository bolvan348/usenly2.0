# usenly-bot

Telegram bot for Usenly account verification.

## Setup

### 1. Install dependencies
```
npm install
```

### 2. Create .env file
```
cp .env.example .env
```
Fill in:
- `BOT_TOKEN` — get from @BotFather on Telegram (create a bot named `@usenlybot`)
- `BOT_SECRET` — any random string (copy the same value to Vercel env as `BOT_SECRET`)
- `SITE_URL` — your deployed site URL, e.g. `https://usenly.io`

### 3. Set BOT_SECRET in Vercel
Add `BOT_SECRET=<same value>` to your Vercel project Environment Variables.

### 4. Run locally (dev)
```
npm run dev
```

### 5. Deploy to production
Deploy to any Node.js host (Railway, Fly.io, Render, VPS, etc.).

```
npm run build
npm start
```

## How it works

1. Site generates a code `USENLY-XXXXXX` from the user's email hash
2. User opens `t.me/usenlybot?start=USENLY-XXXXXX` (deeplink button on site)
3. Bot receives `/start USENLY-XXXXXX` and POSTs to `/api/auth/telegram-verify` on the site
4. Site stores `tg:{code} = verified` in KV for 10 minutes
5. Frontend polls `/api/auth/telegram-status?email=...` every 2s
6. When verified, user proceeds to the payment step

## Vercel env vars required
| Variable | Description |
|---|---|
| `KV_REST_API_URL` | Vercel KV (create in Vercel dashboard → Storage → KV) |
| `KV_REST_API_TOKEN` | Vercel KV token |
| `BOT_SECRET` | Shared secret between bot and site |
| `JWT_SECRET` | Random secret for JWT signing |
| `EMAILJS_*` | EmailJS credentials (already set) |
| `NEXT_PUBLIC_TON_RECEIVER` | Your TON wallet address |
