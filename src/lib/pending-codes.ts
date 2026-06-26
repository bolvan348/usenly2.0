/**
 * JWT-based pending verification codes — no KV/database required.
 * The signed token is returned to the client and sent back on verify.
 * Stateless, works on Vercel Serverless/Edge without any storage setup.
 */
import { SignJWT, jwtVerify } from "jose";

const secret = () =>
  new TextEncoder().encode(process.env.JWT_SECRET ?? "usenly-fallback-secret-change-me");

const TTL_SECONDS = 600; // 10 minutes

export const pendingCodes = {
  /** Create a signed JWT containing pending registration data. Return to client. */
  async createToken(email: string, passwordHash: string, code: string): Promise<string> {
    return new SignJWT({ email, passwordHash, code })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(`${TTL_SECONDS}s`)
      .sign(secret());
  },

  /**
   * Verify a token + user-entered code.
   * Returns { email, passwordHash } on success, null on any failure.
   */
  async verify(
    token: string,
    code: string,
  ): Promise<{ email: string; passwordHash: string } | null> {
    try {
      const { payload } = await jwtVerify(token, secret());
      if (typeof payload.code !== "string") return null;
      if (payload.code !== code.trim()) return null;
      return {
        email:        payload.email as string,
        passwordHash: payload.passwordHash as string,
      };
    } catch {
      return null;
    }
  },
};
