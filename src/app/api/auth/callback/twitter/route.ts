import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { signToken, attachSession } from "@/lib/auth";

const CLEAR = "Path=/; HttpOnly; Max-Age=0";
function clearCookies(headers: Headers) {
  for (const name of ["oauth_state", "oauth_email", "oauth_verifier"])
    headers.append("Set-Cookie", `${name}=; ${CLEAR}`);
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const code  = searchParams.get("code");
  const state = searchParams.get("state");
  const origin = req.nextUrl.origin;

  const savedState = req.cookies.get("oauth_state")?.value;
  const email      = decodeURIComponent(req.cookies.get("oauth_email")?.value ?? "");
  const verifier   = req.cookies.get("oauth_verifier")?.value ?? "";

  const headers = new Headers();
  clearCookies(headers);

  if (!code || !state || state !== savedState) {
    return NextResponse.redirect(`${origin}/start?error=oauth_failed`, { headers });
  }

  try {
    const clientId     = process.env.TWITTER_CLIENT_ID ?? "";
    const clientSecret = process.env.TWITTER_CLIENT_SECRET ?? "";

    const tokenRes = await fetch("https://api.twitter.com/2/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type:    "authorization_code",
        code,
        redirect_uri:  `${origin}/api/auth/callback/twitter`,
        code_verifier: verifier,
      }),
    });
    const token = await tokenRes.json();
    if (!token.access_token) throw new Error("no token");

    const userRes = await fetch("https://api.twitter.com/2/users/me", {
      headers: { Authorization: `Bearer ${token.access_token}` },
    });
    const userData = await userRes.json();
    const username   = userData.data?.username ?? "";
    const oauthEmail = email || `twitter_${username}@oauth.usenly`;

    const user = await db.users.upsertByEmail(oauthEmail, {
      platform: "twitter",
      socialUsername: username,
      verified: true,
    });

    const jwt = await signToken({ sub: user.id, email: user.email });
    const res = NextResponse.redirect(
      `${origin}/start?verified=twitter&username=${encodeURIComponent(username)}&email=${encodeURIComponent(oauthEmail)}`,
      { headers },
    );
    return attachSession(res, jwt);
  } catch {
    return NextResponse.redirect(`${origin}/start?error=oauth_failed`, { headers });
  }
}
