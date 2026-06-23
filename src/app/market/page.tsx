"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Navbar } from "@/components/landing/Navbar";

const FILTERS = ["ALL", "COMMON", "RARE", "EPIC", "LEGENDARY", "MYTHIC"];
const SORT    = ["NEWEST", "PRICE ↑", "PRICE ↓", "RARITY"];

/* ── Single mystery listing card ── */
function MysteryCard({ i, size = "normal" }: { i: number; size?: "normal" | "featured" }) {
  const isFeatured = size === "featured";
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.06, duration: 0.4 }}
      className={`group relative border-2 border-dashed border-[#0A0A0A]/20 bg-[#F7F7F5] transition-all hover:border-[#0A0A0A]/40 hover:shadow-[4px_4px_0_rgba(10,10,10,0.08)] ${isFeatured ? "sm:col-span-2" : ""}`}
    >
      {/* Card image area */}
      <div
        className={`flex items-center justify-center border-b-2 border-dashed border-[#0A0A0A]/15 bg-white ${isFeatured ? "h-48 sm:h-64" : "h-36 sm:h-44"}`}
      >
        <span
          className={`select-none font-pixel text-[#0A0A0A]/10 transition-all group-hover:text-[#0A0A0A]/18 ${isFeatured ? "text-[80px] sm:text-[110px]" : "text-[56px] sm:text-[72px]"}`}
        >
          ?
        </span>
      </div>

      {/* Card info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-pixel text-[11px] tracking-widest text-[#0A0A0A]/25">
              ???????????
            </p>
            <div className="mt-1.5 flex items-center gap-1.5">
              <span className="border border-dashed border-[#0A0A0A]/20 px-2 py-0.5 font-pixel text-[9px] tracking-widest text-[#0A0A0A]/25">
                [?????]
              </span>
            </div>
          </div>
          <div className="shrink-0 text-right">
            <p className="font-pixel text-[10px] tracking-widest text-[#0A0A0A]/20">PRICE</p>
            <p className="font-pixel text-[16px] leading-none text-[#0A0A0A]/20">?</p>
          </div>
        </div>
        <button
          disabled
          className="mt-4 w-full cursor-not-allowed border-2 border-dashed border-[#0A0A0A]/15 py-2 font-pixel text-[10px] tracking-widest text-[#0A0A0A]/20"
        >
          [ COMING SOON ]
        </button>
      </div>

      {/* "Soon" badge */}
      <div className="absolute right-3 top-3 border border-dashed border-[#0A0A0A]/20 bg-white px-2 py-0.5">
        <span className="font-pixel text-[8px] tracking-widest text-[#0A0A0A]/30">SOON</span>
      </div>
    </motion.div>
  );
}

export default function MarketPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* ── Hero ── */}
      <section className="border-b-2 border-dashed border-[#0A0A0A]/15 bg-white px-4 pt-28 pb-10 sm:px-6 sm:pt-36 sm:pb-14">
        <div className="mx-auto max-w-6xl">

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-3"
          >
            <span className="font-pixel text-[14px] text-[#CC0000]">&gt;</span>
            <span className="font-pixel text-[12px] tracking-widest text-[#0A0A0A]/38">MARKETPLACE</span>
            <div className="flex-1 border-t border-dashed border-[#0A0A0A]/15" />
            <span className="border-2 border-dashed border-[#CC0000]/40 px-3 py-1 font-pixel text-[10px] tracking-widest text-[#CC0000]/60">
              COMING SOON
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="mt-5 font-pixel text-[2rem] leading-[1.12] tracking-wide text-[#0A0A0A] sm:text-[2.8rem] lg:text-[3.5rem]"
          >
            BUY, SELL &amp; TRADE<br />
            <span className="text-[#CC0000]">PIXEL PENGUINS.<span className="cursor-blink" /></span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.28, duration: 0.5 }}
            className="mt-4 max-w-lg font-sans text-[14px] leading-relaxed text-[#0A0A0A]/50 sm:text-[15px]"
          >
            The Usenly marketplace is under construction. Soon you&apos;ll be able to list,
            discover, and trade unique pixel penguins directly on-platform — no third-party needed.
          </motion.p>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.42, duration: 0.5 }}
            className="mt-8 flex flex-wrap items-center gap-6 sm:gap-10"
          >
            {[
              { val: "?", label: "LISTINGS" },
              { val: "?", label: "VOLUME"   },
              { val: "?", label: "FLOOR"    },
              { val: "?", label: "OWNERS"   },
            ].map((s) => (
              <div key={s.label}>
                <p className="font-pixel text-[2rem] leading-none text-[#0A0A0A]/20 sm:text-[2.4rem]">{s.val}</p>
                <p className="mt-1.5 font-pixel text-[9px] tracking-widest text-[#0A0A0A]/30 sm:text-[10px]">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Filters bar ── */}
      <section className="sticky top-[58px] z-40 border-b-2 border-[#0A0A0A]/10 bg-white/95 backdrop-blur-sm px-4 py-3 sm:px-6">
        <div className="mx-auto max-w-6xl flex items-center justify-between gap-4 overflow-x-auto">
          <div className="flex items-center gap-2 shrink-0">
            {FILTERS.map((f) => (
              <button
                key={f}
                disabled
                className={`shrink-0 border px-3 py-1.5 font-pixel text-[9px] tracking-widest cursor-not-allowed ${
                  f === "ALL"
                    ? "border-[#0A0A0A]/30 bg-[#0A0A0A]/5 text-[#0A0A0A]/40"
                    : "border-dashed border-[#0A0A0A]/15 text-[#0A0A0A]/25"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <span className="font-pixel text-[9px] tracking-widest text-[#0A0A0A]/25">SORT:</span>
            {SORT.map((s) => (
              <button
                key={s}
                disabled
                className="shrink-0 border border-dashed border-[#0A0A0A]/15 px-2.5 py-1.5 font-pixel text-[9px] tracking-widest text-[#0A0A0A]/20 cursor-not-allowed"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mystery cards grid ── */}
      <section className="px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 sm:gap-5">
            <MysteryCard i={0} size="featured" />
            {Array.from({ length: 11 }).map((_, i) => (
              <MysteryCard key={i} i={i + 1} />
            ))}
          </div>

          {/* Load more (disabled) */}
          <div className="mt-10 flex justify-center">
            <button
              disabled
              className="cursor-not-allowed border-2 border-dashed border-[#0A0A0A]/20 px-10 py-3 font-pixel text-[12px] tracking-widest text-[#0A0A0A]/25"
            >
              [ LOAD MORE ]
            </button>
          </div>
        </div>
      </section>

      {/* ── Dark bottom: what's coming + question marks ── */}
      <section className="bg-[#0A0A0A] px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-6xl">

          <div className="mb-10 flex items-center gap-3">
            <span className="font-pixel text-[14px] text-[#CC0000]">&gt;</span>
            <span className="font-pixel text-[12px] tracking-widest text-white/30">WHAT&apos;S COMING</span>
            <div className="flex-1 border-t border-dashed border-white/10" />
          </div>

          {/* Feature teasers */}
          <div className="grid gap-4 sm:grid-cols-3 mb-14">
            {[
              { icon: "◈", title: "P2P TRADING",   text: "Set your own price. Trade directly with other collectors, no middleman." },
              { icon: "⟡", title: "LIVE AUCTIONS",  text: "Timed auctions with pixel-art countdown. Highest bid wins the penguin." },
              { icon: "◎", title: "RARITY FLOOR",   text: "Per-rarity price floors. Common, Rare, Epic, Legendary, Mythic — each tracked separately." },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="border border-dashed border-white/10 p-6 hover:border-white/20 transition-colors"
              >
                <span className="font-pixel text-[20px] text-white/20">{f.icon}</span>
                <p className="mt-3 font-pixel text-[13px] tracking-wide text-white/50">{f.title}</p>
                <p className="mt-2 font-sans text-[13px] leading-relaxed text-white/25">{f.text}</p>
              </motion.div>
            ))}
          </div>

          {/* Giant question marks */}
          <div className="flex items-end justify-center gap-1 sm:gap-4">
            {[48, 64, 88, 112, 88, 64, 48].map((size, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.45 }}
                className="select-none font-pixel leading-none text-white/[0.08]"
                style={{ fontSize: size }}
              >
                ?
              </motion.span>
            ))}
          </div>

          <p className="mt-8 text-center font-pixel text-[9px] tracking-[0.25em] text-white/15 sm:tracking-[0.35em]">
            MORE FEATURES · MORE MYSTERY · MORE PENGUINS
          </p>

          {/* Notify CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-12 flex flex-col items-center gap-4"
          >
            <p className="font-pixel text-[11px] tracking-widest text-white/30">
              GET NOTIFIED WHEN MARKET OPENS
            </p>
            <div className="flex w-full max-w-sm border-2 border-white/15">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 min-w-0 bg-transparent px-4 py-3 font-pixel text-[12px] text-white placeholder:text-white/20 outline-none"
              />
              <button className="shrink-0 border-l-2 border-white/15 px-5 py-3 font-pixel text-[11px] tracking-widest text-white/40 transition-colors hover:bg-[#CC0000] hover:text-white hover:border-[#CC0000]">
                NOTIFY
              </button>
            </div>
            <Link
              href="/start"
              className="font-pixel text-[11px] tracking-widest text-white/20 transition-colors hover:text-white/50"
            >
              or claim your penguin first →
            </Link>
          </motion.div>

        </div>
      </section>

    </main>
  );
}
