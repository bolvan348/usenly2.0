import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "usenly-dev-secret-change-this-in-production",
);

export const SESSION_COOKIE = "usenly_session";
const EXPIRY = "7d";

export interface SessionPayload extends JWTPayload {
  sub: string;   // user id
  email: string;
}

export async function signToken(payload: Omit<SessionPayload, keyof JWTPayload>): Promise<string> {
  return new SignJWT(payload as JWTPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(EXPIRY)
    .sign(SECRET);
}

export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as SessionPayload;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}

/** Attach Set-Cookie header to an existing NextResponse. */
export function attachSession(res: NextResponse, token: string): NextResponse {
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    secure: process.env.NODE_ENV === "production",
  });
  return res;
}

/** Clear the session cookie. */
export function clearSession(res: NextResponse): NextResponse {
  res.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}
