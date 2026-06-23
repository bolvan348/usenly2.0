import type { Metadata } from "next";
import { VT323, Space_Mono } from "next/font/google";
import { IntroProvider } from "@/components/intro/IntroProvider";
import { UserProvider } from "@/lib/user-context";
import { FingerprintInit } from "@/components/FingerprintInit";
import { TonProviderWrapper } from "@/components/TonProviderWrapper";
import "./globals.css";

const vt323 = VT323({
  subsets: ["latin"],
  variable: "--font-pixel",
  display: "swap",
  weight: "400",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Usenly — Collect Digital Identities",
  description:
    "Turn your digital handles into unique collectible bears. Verify, mint, own — across any platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${spaceMono.variable} ${vt323.variable} font-sans antialiased`}>
        <TonProviderWrapper><UserProvider><IntroProvider><FingerprintInit />{children}</IntroProvider></UserProvider></TonProviderWrapper>
      </body>
    </html>
  );
}
