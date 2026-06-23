"use client";

import Link from "next/link";
import { useState } from "react";
import { Input } from "@/components/ui/input";

const DOCS = [
  {
    icon:  "◈",
    title: "RARITY SYSTEM",
    desc:  "How the 5 rarity tiers work and what determines each bear's traits.",
    href:  "/docs/nft",
  },
  {
    icon:  "⊞",
    title: "MINTING POLICY",
    desc:  "Rules around one collectible per identity and what happens on conflict.",
    href:  "/docs/nft",
  },
  {
    icon:  "⟡",
    title: "USERNAME CLAIM",
    desc:  "Step-by-step guide to verifying ownership of your digital handle.",
    href:  "/docs/telegram",
  },
  {
    icon:  "◎",
    title: "SUPPORT",
    desc:  "Get help, report issues, or reach the team directly.",
    href:  "/docs/support",
  },
];

const NAV_COLS = [
  {
    title: "PRODUCT",
    links: [
      { href: "/#how",         label: "HOW IT WORKS" },
      { href: "/#collection",  label: "COLLECTION"   },
      { href: "/start",        label: "GET STARTED"  },
      { href: "/docs/support", label: "CONTACT"      },
    ],
  },
  {
    title: "LEGAL",
    links: [
      { href: "/docs/terms",   label: "TERMS"   },
      { href: "/docs/privacy", label: "PRIVACY" },
      { href: "/docs/cookies", label: "COOKIES" },
    ],
  },
  {
    title: "SOCIAL",
    links: [
      { href: "https://t.me",          label: "TELEGRAM"   },
      { href: "https://x.com",         label: "X / TWITTER" },
      { href: "https://instagram.com", label: "INSTAGRAM"  },
    ],
  },
];

export function Footer({ hideDocs = false }: { hideDocs?: boolean }) {
  const [email, setEmail] = useState("");

  return (
    <footer className="relative">

      {/* ── Bridge: white → terminal ── */}
      <div className="border-t-2 border-dashed border-[#0A0A0A]/15 bg-white py-6">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex items-center gap-2.5">
            <span className="h-2 w-2 animate-pulse bg-[#CC0000]" />
            <span className="font-pixel text-[11px] tracking-widest text-[#0A0A0A]/30">
              CONNECTING TO TERMINAL...
            </span>
          </div>
        </div>
      </div>

      {/* ── Terminal dark section ── */}
      <div className="bg-[#0A0A0A]">

        {/* ── Documentation ── */}
        {!hideDocs && <div className="border-b border-white/[0.07] px-4 py-8 sm:px-6 lg:py-12 overflow-hidden">
          <div className="mx-auto max-w-6xl overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-pixel text-[14px] text-[#CC0000]">&gt;</span>
                <span className="font-pixel text-[12px] tracking-widest text-white/35">
                  DOCUMENTATION
                </span>
              </div>
              <Link
                href="/docs"
                className="font-pixel text-[11px] tracking-widest text-white/25 transition-colors hover:text-white/60"
              >
                BROWSE ALL →
              </Link>
            </div>

            {/* Compact doc rows */}
            <div className="mt-5 grid sm:grid-cols-2">
              {DOCS.map((doc) => (
                <Link
                  key={doc.title}
                  href={doc.href}
                  className="group flex items-center gap-3 border-t border-white/[0.07] py-4 transition-colors hover:border-white/[0.14] overflow-hidden"
                >
                  <span className="w-6 shrink-0 text-center font-pixel text-[14px] text-white/28 transition-colors group-hover:text-[#CC0000]">
                    {doc.icon}
                  </span>
                  <div className="min-w-0 flex-1 overflow-hidden">
                    <p className="font-pixel text-[13px] tracking-wide text-white/60 transition-colors group-hover:text-white/90 break-words">
                      {doc.title}
                    </p>
                    <p className="mt-0.5 font-sans text-[11.5px] text-white/25 break-words leading-snug">
                      {doc.desc}
                    </p>
                  </div>
                  <span className="shrink-0 font-pixel text-[12px] text-white/18 transition-all group-hover:translate-x-0.5 group-hover:text-[#CC0000]">
                    →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>}

        {/* ── Main footer ── */}
        <div className="px-4 py-10 sm:px-6 lg:py-20">
          <div className="mx-auto max-w-6xl">

            <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">

              {/* Brand + newsletter */}
              <div className="max-w-sm">
                <Link
                  href="/"
                  className="font-pixel text-[1.5rem] tracking-widest text-white hover:text-[#CC0000] transition-colors"
                >
                  &gt; USENLY
                </Link>
                <p className="mt-3 font-sans text-[13.5px] leading-relaxed text-white/32">
                  Turn any digital identity into a unique collectible. Verify, mint, own.
                </p>

                {/* Newsletter */}
                <div className="mt-8">
                  <p className="font-pixel text-[11px] tracking-widest text-white/28">
                    [ STAY IN THE LOOP ]
                  </p>
                  <form
                    className="mt-3 flex border-2 border-white/[0.12] bg-white/[0.04]"
                    onSubmit={(e) => e.preventDefault()}
                  >
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="h-11 flex-1 rounded-none border-0 bg-transparent px-4 font-pixel text-[13px] text-white shadow-none placeholder:text-white/20 focus-visible:ring-0"
                    />
                    <button
                      type="submit"
                      className="flex h-11 items-center border-l-2 border-white/[0.12] px-5 font-pixel text-[12px] tracking-widest text-white/40 transition-colors hover:bg-[#CC0000] hover:text-[#0A0A0A]"
                      aria-label="Subscribe"
                    >
                      SUB
                    </button>
                  </form>
                </div>
              </div>

              {/* Nav columns */}
              <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
                {NAV_COLS.map((col) => (
                  <div key={col.title}>
                    <p className="font-pixel text-[11px] tracking-widest text-[#CC0000]">
                      {col.title}
                    </p>
                    <ul className="mt-5 space-y-3.5">
                      {col.links.map((link) => (
                        <li key={`${col.title}-${link.label}`}>
                          <Link
                            href={link.href}
                            className="font-pixel text-[12px] tracking-wide text-white/28 transition-colors hover:text-white/65"
                          >
                            &gt; {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom strip */}
            <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-white/[0.07] pt-7 sm:flex-row sm:items-center">
              <p className="font-pixel text-[11px] tracking-wide text-white/20">
                © {new Date().getFullYear()} USENLY. ALL RIGHTS RESERVED.
              </p>
              <div className="flex items-center gap-5 font-pixel text-[11px] tracking-wide text-white/20">
                <Link href="/docs/privacy" className="transition-colors hover:text-white/50">PRIVACY</Link>
                <Link href="/docs/terms"   className="transition-colors hover:text-white/50">TERMS</Link>
                <Link href="/docs/cookies" className="transition-colors hover:text-white/50">COOKIES</Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </footer>
  );
}
