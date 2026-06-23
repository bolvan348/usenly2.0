import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { signToken, attachSession } from "@/lib/auth";

const CLEAR = "Path=/; HttpOnly; Max-Age=0";
function clearCookies(headers: Headers) {
  for (const name of ["oauth_state", "oauth_email"])
    headers.append("Set-Cookie", `${name}=; ${CLEAR}`);
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const code  = searchParams.get("code");
  const state = searchParams.get("state");
  const origin = req.nextUrl.origin;

  const savedState = req.cookies.get("oauth_state")?.value;
  const email      = decodeURIComponent(req.cookies.get("oauth_email")?.value ?? "");

  const headers = new Headers();
  clearCookies(headers);

  if (!code || !state || state !== savedState) {
    return NextResponse.redirect(`${origin}/start?error=oauth_failed`, { headers });
  }

  try {
    const clientId     = process.env.DISCORD_CLIENT_ID ?? "";
    const clientSecret = process.env.DISCORD_CLIENT_SECRET ?? "";

    const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type:    "authorization_code",
        client_id:     clientId,
        client_secret: clientSecret,
        redirect_uri:  `${origin}/api/auth/callback/discord`,
        code,
      }),
    });
    const token = await tokenRes.json();
    if (!token.access_token) throw new Error("no token");

    const userRes = await fetch("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${token.access_token}` },
    });
    const userData = await userRes.json();
    const username = userData.username ?? "";
    const discordEmail = userData.email || email || `discord_${username}@oauth.usenly`;

    const user = await db.users.upsertByEmail(discordEmail, {
      platform: "discord",
      socialUsername: username,
      verified: true,
    });

    const jwt = await signToken({ sub: user.id, email: user.email });
    const res = NextResponse.redirect(
      `${origin}/start?verified=discord&username=${encodeURIComponent(username)}&email=${encodeURIComponent(discordEmail)}`,
      { headers },
    );
    return attachSession(res, jwt);
  } catch {
    return NextResponse.redirect(`${origin}/start?error=oauth_failed`, { headers });
  }
}
