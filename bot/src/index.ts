import "dotenv/config";
import { Telegraf, Context } from "telegraf";

const BOT_TOKEN  = process.env.BOT_TOKEN  ?? "";
const BOT_SECRET = process.env.BOT_SECRET ?? "";
const SITE_URL   = (process.env.SITE_URL  ?? "https://usenly.io").replace(/\/$/, "");

if (!BOT_TOKEN)  { console.error("❌ BOT_TOKEN is not set in .env");  process.exit(1); }
if (!BOT_SECRET) { console.error("❌ BOT_SECRET is not set in .env"); process.exit(1); }

const bot = new Telegraf(BOT_TOKEN);

async function verifyCode(code: string): Promise<boolean> {
  const res = await fetch(`${SITE_URL}/api/auth/telegram-verify`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ code, secret: BOT_SECRET }),
  });
  return res.ok;
}

/* /start USENLY-XXXXXX  —  deeplink from the site */
bot.start(async (ctx) => {
  const startPayload = (ctx as Context & { startPayload?: string }).startPayload ?? "";
  const code = startPayload.trim();

  if (!code.startsWith("USENLY-")) {
    return ctx.reply(
      "👋 Welcome to Usenly Bot!\n\n" +
      "Open usenly.io/start and follow the Telegram step to get your verification link.",
    );
  }

  try {
    const ok = await verifyCode(code);
    if (ok) {
      await ctx.reply(
        "✅ *Telegram verified!*\n\nGo back to the site to continue.",
        { parse_mode: "Markdown" },
      );
    } else {
      await ctx.reply("❌ Code is invalid or expired. Go back to the site and try again.");
    }
  } catch {
    await ctx.reply("⚠️ Could not reach Usenly servers. Try again in a moment.");
  }
});

/* /verify USENLY-XXXXXX  —  manual fallback */
bot.command("verify", async (ctx) => {
  const text  = "text" in ctx.message ? ctx.message.text : "";
  const code  = text.split(" ")[1]?.trim() ?? "";

  if (!code.startsWith("USENLY-")) {
    return ctx.reply("Usage: /verify USENLY-XXXXXX");
  }

  try {
    const ok = await verifyCode(code);
    await ctx.reply(
      ok
        ? "✅ *Verified!* Go back to the site to continue."
        : "❌ Code is invalid or expired. Please try again.",
      { parse_mode: "Markdown" },
    );
  } catch {
    await ctx.reply("⚠️ Server error. Try again later.");
  }
});

bot.help((ctx) =>
  ctx.reply(
    "Usenly Bot verifies your Telegram during registration.\n\n" +
    "1. Go to usenly.io/start\n" +
    "2. Complete the steps\n" +
    "3. The bot link is provided automatically",
  ),
);

bot.launch()
  .then(() => console.log(`✅ @usenlybot running — site: ${SITE_URL}`))
  .catch((err: Error) => { console.error("❌ Failed to start:", err); process.exit(1); });

process.once("SIGINT",  () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
