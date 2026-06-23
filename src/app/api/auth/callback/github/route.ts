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
    const clientId     = process.env.GITHUB_CLIENT_ID ?? "";
    const clientSecret = process.env.GITHUB_CLIENT_SECRET ?? "";

    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        client_id:     clientId,
        client_secret: clientSecret,
        code,
        redirect_uri:  `${origin}/api/auth/callback/github`,
      }),
    });
    const token = await tokenRes.json();
    if (!token.access_token) throw new Error("no token");

    const userRes = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
        "User-Agent":  "Usenly",
      },
    });
    const userData = await userRes.json();
    const username    = userData.login ?? "";
    const githubEmail = userData.email || email || `github_${username}@oauth.usenly`;

    const user = await db.users.upsertByEmail(githubEmail, {
      platform: "github",
      socialUsername: username,
      verified: true,
    });

    const jwt = await signToken({ sub: user.id, email: user.email });
    const res = NextResponse.redirect(
      `${origin}/start?verified=github&username=${encodeURIComponent(username)}&email=${encodeURIComponent(githubEmail)}`,
      { headers },
    );
    return attachSession(res, jwt);
  } catch {
    return NextResponse.redirect(`${origin}/start?error=oauth_failed`, { headers });
  }
}
