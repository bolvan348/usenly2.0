const BASE    = "https://tonapi.io/v2";
const API_KEY = process.env.TONAPI_KEY ?? "";

function headers() {
  return { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" };
}

/** Get recent transactions for an address (raw account form: 0:abcd...) */
export async function getAccountTransactions(address: string, limit = 30) {
  const res = await fetch(
    `${BASE}/accounts/${encodeURIComponent(address)}/transactions?limit=${limit}`,
    { headers: headers(), next: { revalidate: 0 } },
  );
  if (!res.ok) throw new Error(`TonAPI ${res.status}`);
  return res.json() as Promise<{ transactions: TonTransaction[] }>;
}

/** Get a single transaction by hash */
export async function getTransaction(hash: string) {
  const res = await fetch(`${BASE}/transactions/${hash}`, {
    headers: headers(), next: { revalidate: 0 },
  });
  if (!res.ok) throw new Error(`TonAPI ${res.status}`);
  return res.json() as Promise<TonTransaction>;
}

/** Get account info (balance etc.) */
export async function getAccount(address: string) {
  const res = await fetch(`${BASE}/accounts/${encodeURIComponent(address)}`, {
    headers: headers(),
  });
  if (!res.ok) throw new Error(`TonAPI ${res.status}`);
  return res.json();
}

export interface TonTransaction {
  hash:        string;
  utime:       number;
  in_msg?: {
    source?:   { address: string };
    destination?: { address: string };
    value:     number;   // nanotons
    decoded_body?: { text?: string };
  };
  out_msgs?: Array<{
    destination?: { address: string };
    value:        number;
  }>;
}
