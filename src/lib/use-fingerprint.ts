"use client";

import { useEffect } from "react";

/**
 * Collects a browser fingerprint via FingerprintJS and reports it to the
 * server. Runs once per page session, silently — no user-visible effect.
 */
export function useFingerprint() {
  useEffect(() => {
    // Only run in browser, not SSR
    if (typeof window === "undefined") return;

    let cancelled = false;

    async function run() {
      try {
        const FingerprintJS = await import("@fingerprintjs/fingerprintjs");
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        if (cancelled) return;
        await fetch("/api/auth/fingerprint", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            visitorId:  result.visitorId,
            confidence: result.confidence.score,
          }),
        });
      } catch {
        // Fingerprinting is best-effort — never break the page
      }
    }

    run();
    return () => { cancelled = true; };
  }, []);
}
