"use client";

import { TonConnectUIProvider } from "@tonconnect/ui-react";

export function TonProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <TonConnectUIProvider manifestUrl="/tonconnect-manifest.json">
      {children}
    </TonConnectUIProvider>
  );
}
