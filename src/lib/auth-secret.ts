/** A shared signing secret; production must never use a public fallback. */
export function authSecret(): string {
  const secret = process.env.JWT_SECRET?.trim();
  if (secret) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error("JWT_SECRET is not configured");
  }
  return "usenly-local-development-only";
}
