/**
 * JWT-based pending registration token — no KV/database required.
 * Carries email + passwordHash so we can create the user after Supabase OTP verification.
 * The actual OTP code is managed by Supabase Auth — we never generate it ourselves.
 */
import { SignJWT, jwtVerify } from "jose";

const secret = () =>
  new TextEncoder().encode(process.env.JWT_SECRET ?? "usenly-fallback-secret-change-me");

const TTL_SECONDS = 600; // 10 minutes

export const pendingCodes = {
  /** Create a signed JWT containing pending registration data. Return to client. */
  async createToken(email: string, passwordHash: string): Promise<string> {
    return new SignJWT({ email, passwordHash })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(`${TTL_SECONDS}s`)
      .sign(secret());
  },

  /**
   * Decode and verify the pending token (JWT signature + expiry only).
   * Returns { email, passwordHash } on success, null on any failure.
   */
  async decode(token: string): Promise<{ email: string; passwordHash: string } | null> {
    try {
      const { payload } = await jwtVerify(token, secret());
      if (typeof payload.email !== "string" || typeof payload.passwordHash !== "string") {
        return null;
      }
      return {
        email:        payload.email,
        passwordHash: payload.passwordHash,
      };
    } catch {
      return null;
    }
  },
};
