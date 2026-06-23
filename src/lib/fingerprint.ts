/**
 * Browser fingerprint utilities.
 * Client-side: collect fingerprint via FingerprintJS.
 * Server-side: store in DB and flag suspicious multi-accounts.
 */

export interface FingerprintData {
  visitorId: string;
  confidence: number;
}

/** Load FingerprintJS and return a visitorId */
export async function getFingerprint(): Promise<FingerprintData | null> {
  try {
    const FingerprintJS = await import("@fingerprintjs/fingerprintjs");
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    return { visitorId: result.visitorId, confidence: result.confidence.score };
  } catch {
    return null;
  }
}
