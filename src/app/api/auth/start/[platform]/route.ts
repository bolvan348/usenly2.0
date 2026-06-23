import { NextRequest, NextResponse } from "next/server";
import { randomBytes, createHash } from "crypto";

function b64url(buf: Buffer): string {
  return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

const COOKIE = "Path=/; HttpOnly; SameSite=Lax; Max-Age=600";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ platform: string }> },
) {
  const { platform } = await params;
  const email  = req.nextUrl.searchParams.get("email") ?? "";
  const origin = req.nextUrl.origin;
  const cb     = `${origin}/api/auth/callback`;

  const state   = b64url(randomBytes(32));
  const headers = new Headers();
  headers.append("Set-Cookie", `oauth_state=${state}; ${COOKIE}`);
  headers.append("Set-Cookie", `oauth_email=${encodeURIComponent(email)}; ${COOKIE}`);

  let url: string;

  if (platform === "twitter") {
    const verifier  = b64url(randomBytes(32));
    const challenge = b64url(createHash("sha256").update(verifier).digest());
    headers.append("Set-Cookie", `oauth_verifier=${verifier}; ${COOKIE}`);

    url = "https://twitter.com/i/oauth2/authorize?" + new URLSearchParams({
      response_type:         "code",
      client_id:             process.env.TWITTER_CLIENT_ID ?? "",
      redirect_uri:          `${cb}/twitter`,
      scope:                 "users.read tweet.read",
      state,
      code_challenge:        challenge,
      code_challenge_method: "S256",
    });
  } else if (platform === "discord") {
    url = "https://discord.com/oauth2/authorize?" + new URLSearchParams({
      response_type: "code",
      client_id:     process.env.DISCORD_CLIENT_ID ?? "",
      redirect_uri:  `${cb}/discord`,
      scope:         "identify email",
      state,
    });
  } else if (platform === "github") {
    url = "https://github.com/login/oauth/authorize?" + new URLSearchParams({
      client_id:    process.env.GITHUB_CLIENT_ID ?? "",
      redirect_uri: `${cb}/github`,
      scope:        "read:user user:email",
      state,
    });
  } else {
    return NextResponse.json({ error: "unknown platform" }, { status: 400 });
  }

  return NextResponse.redirect(url, { headers });
}
