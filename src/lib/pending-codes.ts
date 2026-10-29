/** Encrypted registration state: neither the code nor password hash is public. */
import { createHash } from "crypto";
import { EncryptJWT, jwtDecrypt } from "jose";
import { authSecret } from "@/lib/auth-secret";

const key = () => createHash("sha256").update(authSecret()).digest();
const issuer = "usenly-registration";

export const pendingCodes = {
  async createToken(email: string, passwordHash: string, code: string): Promise<string> {
    return new EncryptJWT({ email, passwordHash, code })
      .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
      .setIssuer(issuer)
      .setIssuedAt()
      .setExpirationTime("10m")
      .encrypt(key());
  },

  async read(token: string): Promise<{ email: string; passwordHash: string; code: string } | null> {
    try {
      const { payload } = await jwtDecrypt(token, key(), { issuer });
      if (typeof payload.email !== "string" || typeof payload.passwordHash !== "string" ||
          typeof payload.code !== "string" || !/^\d{6}$/.test(payload.code)) return null;
      return { email: payload.email, passwordHash: payload.passwordHash, code: payload.code };
    } catch {
      return null;
    }
  },

  async verify(token: string, code: string): Promise<{ email: string; passwordHash: string } | null> {
    const pending = await pendingCodes.read(token);
    if (!pending || pending.code !== code.trim()) return null;
    return { email: pending.email, passwordHash: pending.passwordHash };
  },
};
