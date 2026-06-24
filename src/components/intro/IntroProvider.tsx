"use client";

import { SiteIntro } from "@/components/intro/SiteIntro";

export function IntroProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteIntro />
      {children}
    </>
  );
}
