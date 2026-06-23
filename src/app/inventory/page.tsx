"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { PixelPenguin } from "@/components/bear/PixelPenguin";
import { useUser } from "@/lib/user-context";
import { RARITY_LABELS } from "@/lib/bear-types";
import type { BearRarity } from "@/lib/bear-types";

const RARITY_COLOR: Record<BearRarity, string> = {
  common:    "#888888",
  rare:      "#2979FF",
  epic:      "#D500F9",
  legendary: "#FFD600",
  mythic:    "#CC0000",
};

const TIER_LABEL: Record<number, string> = { 2:"STANDARD", 3:"PLUS", 4:"PRO", 5:"ELITE" };

export default function InventoryPage() {
  const { user, hydrated } = useUser();

  /* ── Not logged in ── */
  if (hydrated && !user) {
    return (
      <main className="min-h-screen bg-white">
        <Navbar />
        <section className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
          <p className="font-pixel text-[14px] tracking-widest text-[#0A0A0A]/40">[ NO SESSION ]</p>
          <h2 className="mt-3 font-pixel text-[1.6rem] text-[#0A0A0A]">NOT SIGNED IN</h2>
          <p className="mt-3 font-sans text-[14px] text-[#0A0A0A]/50">Sign in or register to view your inventory.</p>
          <Link href="/start"
            className="mt-6 border-2 border-[#0A0A0A] bg-[#0A0A0A] px-8 py-3 font-pixel text-[13px] tracking-widest text-white shadow-[4px_4px_0_#CC0000] transition-all hover:shadow-none hover:translate-x-1 hover:translate-y-1">
            [ GO TO START ]
          </Link>
        </section>
        <Footer />
      </main>
    );
  }

  /* ── Logged in but no NFT yet ── */
  if (hydrated && user && !user.handle) {
    return (
      <main className="min-h-screen bg-white">
        <Navbar />
        <section className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
          <div className="border-2 border-dashed border-[#0A0A0A]/20 p-10">
            <p className="font-pixel text-[64px] text-[#0A0A0A]/10">?</p>
            <p className="mt-2 font-pixel text-[11px] tracking-widest text-[#0A0A0A]/35">YOUR PENGUIN AWAITS</p>
          </div>
          <h2 className="mt-6 font-pixel text-[1.4rem] text-[#0A0A0A]">NO NFT MINTED YET</h2>
          <p className="mt-2 font-sans text-[14px] text-[#0A0A0A]/50">Complete the onboarding to mint your unique pixel penguin.</p>
          <Link href="/start"
            className="mt-6 border-2 border-[#0A0A0A] bg-[#0A0A0A] px-8 py-3 font-pixel text-[13px] tracking-widest text-white shadow-[4px_4px_0_#CC0000] transition-all hover:shadow-none hover:translate-x-1 hover:translate-y-1">
            [ CLAIM YOUR PENGUIN ]
          </Link>
        </section>
        <Footer />
      </main>
    );
  }

  const rarity  = (user?.rarity  ?? "common") as BearRarity;
  const handle  = user?.handle  ?? "@unknown";
  const payment = user?.payment ?? 2;
  const seed    = handle.replace("@", "").toLowerCase();

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* ── Hero bar ── */}
      <section className="border-b-2 border-dashed border-[#0A0A0A]/15 bg-white px-4 pt-28 pb-8 sm:px-6 sm:pt-36">
        <div className="mx-auto max-w-6xl">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
            className="flex items-center gap-3">
            <span className="font-pixel text-[14px] text-[#CC0000]">&gt;</span>
            <span className="font-pixel text-[12px] tracking-widest text-[#0A0A0A]/38">INVENTORY</span>
            <div className="flex-1 border-t border-dashed border-[#0A0A0A]/15" />
            <span className="border-2 border-[#0A0A0A]/15 px-3 py-1 font-pixel text-[10px] tracking-widest text-[#0A0A0A]/35">
              1 ITEM
            </span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.08 }}
            className="mt-4 font-pixel text-[2rem] leading-tight text-[#0A0A0A] sm:text-[2.6rem]">
            YOUR COLLECTION
          </motion.h1>
        </div>
      </section>

      {/* ── NFT card ── */}
      {!hydrated ? (
        <section className="px-4 py-14 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <div className="h-80 animate-pulse border-2 border-dashed border-[#0A0A0A]/15 bg-[#F7F7F5]" />
          </div>
        </section>
      ) : (
        <section className="px-4 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-6xl">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
              className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

              {/* Card */}
              <div className="border-2 border-[#0A0A0A] bg-white shadow-[6px_6px_0_#CC0000]">
                {/* Title bar */}
                <div className="flex items-center gap-2 border-b-2 border-[#0A0A0A]/15 bg-[#0A0A0A] px-4 py-2">
                  <span className="h-2 w-2 rounded-full bg-[#FF5F57]" />
                  <span className="h-2 w-2 rounded-full bg-[#FFBD2E]" />
                  <span className="h-2 w-2 rounded-full bg-[#28C840]" />
                  <span className="ml-2 font-pixel text-[10px] tracking-widest text-white/40 truncate">
                    {handle}.usenly
                  </span>
                </div>

                {/* Penguin display */}
                <div className="flex items-center justify-center border-b-2 border-dashed border-[#0A0A0A]/10 bg-[#F7F7F5] py-8">
                  <PixelPenguin seed={seed} rarity={rarity} pixelSize={14} />
                </div>

                {/* Details */}
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-pixel text-[15px] tracking-wide text-[#0A0A0A]">{handle}</p>
                    <span
                      className="border px-2 py-0.5 font-pixel text-[10px] tracking-widest"
                      style={{ borderColor: RARITY_COLOR[rarity], color: RARITY_COLOR[rarity] }}
                    >
                      {RARITY_LABELS[rarity].toUpperCase()}
                    </span>
                  </div>
                  <div className="space-y-1 border-t border-dashed border-[#0A0A0A]/10 pt-3">
                    {[
                      ["EDITION",  "1 OF 1"],
                      ["PACKAGE",  `$${payment} · ${TIER_LABEL[payment] ?? "STANDARD"}`],
                      ["STATUS",   "MINTED ✓"],
                      ["NETWORK",  "USENLY · v1"],
                    ].map(([k, v]) => (
                      <p key={k} className="font-pixel text-[11px] tracking-wide text-[#0A0A0A]/60">
                        <span className="text-[#0A0A0A]/30">{k}: </span>{v}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex border-t-2 border-[#0A0A0A]/10">
                  <button
                    onClick={() => { if (navigator.share) navigator.share({ title: `${handle} — Usenly NFT`, url: window.location.origin }); }}
                    className="flex-1 border-r border-[#0A0A0A]/10 py-2.5 font-pixel text-[10px] tracking-widest text-[#0A0A0A]/40 transition-colors hover:bg-[#F7F7F5] hover:text-[#0A0A0A]">
                    [ SHARE ]
                  </button>
                  <Link href="/start"
                    className="flex-1 py-2.5 text-center font-pixel text-[10px] tracking-widest text-[#0A0A0A]/40 transition-colors hover:bg-[#F7F7F5] hover:text-[#0A0A0A]">
                    [ VIEW FLOW ]
                  </Link>
                </div>
              </div>

              {/* Traits panel */}
              <div className="space-y-4 md:col-span-1 lg:col-span-2">
                <div className="border-2 border-[#0A0A0A] bg-white p-5">
                  <p className="font-pixel text-[11px] tracking-widest text-[#CC0000] mb-4">&gt; TRAITS</p>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {[
                      { trait: "RARITY",   value: RARITY_LABELS[rarity].toUpperCase(), color: RARITY_COLOR[rarity] },
                      { trait: "TYPE",     value: "PIXEL PENGUIN",  color: undefined },
                      { trait: "PLATFORM", value: "TELEGRAM",       color: undefined },
                      { trait: "EDITION",  value: "1 OF 1",         color: undefined },
                      { trait: "SEED",     value: seed.slice(0,8).toUpperCase(), color: undefined },
                      { trait: "VERSION",  value: "V1 · GENESIS",   color: undefined },
                    ].map(({ trait, value, color }) => (
                      <div key={trait} className="border border-dashed border-[#0A0A0A]/15 bg-[#F7F7F5] px-3 py-2.5">
                        <p className="font-pixel text-[8px] tracking-widest text-[#0A0A0A]/35 mb-1">{trait}</p>
                        <p className="font-pixel text-[11px] tracking-wide"
                          style={{ color: color ?? "#0A0A0A" }}>
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Terminal info */}
                <div className="border-2 border-[#0A0A0A] bg-[#0A0A0A] p-5 space-y-1.5">
                  <p className="font-pixel text-[11px] tracking-wide text-[#CC0000] mb-3">$ ./usenly --show-nft {handle}</p>
                  {[
                    ["OWNER",    user?.email ?? "—"],
                    ["HANDLE",   handle],
                    ["RARITY",   RARITY_LABELS[rarity].toUpperCase()],
                    ["PACKAGE",  `$${payment} ${TIER_LABEL[payment] ?? ""}`],
                    ["STATUS",   "ACTIVE ●"],
                    ["VERIFIED", "EMAIL + TELEGRAM"],
                  ].map(([k, v]) => (
                    <p key={k} className="font-pixel text-[11px] sm:text-[12px] tracking-wide text-white/70">
                      <span className="text-white/35">&gt; {k}: </span>
                      <span className={k === "STATUS" ? "text-[#28C840]" : ""}>{v}</span>
                    </p>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
