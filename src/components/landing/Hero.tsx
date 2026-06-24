"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PixelPenguin } from "@/components/bear/PixelPenguin";
import type { BearRarity } from "@/lib/bear-types";

const STATS = [
  { val: "5",   label: "RARITY TIERS"      },
  { val: "∞",   label: "UNIQUE IDENTITIES" },
  { val: "1:1", label: "PER HANDLE"        },
];

const INTEGRATIONS = ["TELEGRAM", "X / TWITTER", "DISCORD", "GITHUB"];

const FEATURES = [
  "1-TO-1 PER HANDLE — NO DUPLICATES",
  "5 RARITY TIERS: COMMON → MYTHIC",
  "DETERMINISTIC GENERATION",
  "NO CRYPTO WALLET REQUIRED",
  "INSTANT DELIVERY",
];

const PREVIEW_PENGUINS: { seed: string; rarity: BearRarity }[] = [
  { seed: "openchat",  rarity: "common"    },
  { seed: "novadev",   rarity: "rare"      },
  { seed: "cryptok",   rarity: "epic"      },
  { seed: "aria",      rarity: "legendary" },
];

/* ── Animated counter ── */
function CounterNumber({ to, duration = 2.2 }: { to: number; duration?: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, v => Math.floor(v).toLocaleString("en-US"));

  useEffect(() => {
    const controls = animate(count, to, { duration, ease: "easeOut" });
    return controls.stop;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <motion.span>{rounded}</motion.span>;
}

/* ── Mint progress bar — fetches real data from /api/stats ── */
const TOTAL = 10_000;

function MintProgress() {
  const [minted, setMinted] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/stats")
      .then(r => r.json())
      .then(d => {
        if (typeof d.minted === "number") {
          setMinted(d.minted);
        }
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  const pct = Math.round((minted / TOTAL) * 100);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: loaded ? 1 : 0 }}
      transition={{ delay: 0.82, duration: 0.5 }}
      className="mt-8 border-t-2 border-dashed border-[#0A0A0A]/15 pt-6"
    >
      <div className="flex items-end justify-between mb-2">
        <div>
          <p className="font-pixel text-[1.8rem] leading-none text-[#0A0A0A] sm:text-[2.2rem]">
            <CounterNumber to={TOTAL - minted} />
          </p>
          <p className="mt-1.5 font-pixel text-[9px] tracking-widest text-[#0A0A0A]/35 sm:text-[10px]">
            REMAINING
          </p>
        </div>
        <p className="font-pixel text-[10px] tracking-widest text-[#0A0A0A]/30 sm:text-[11px]">
          {minted.toLocaleString("en-US")} / {TOTAL.toLocaleString("en-US")} MINTED
        </p>
      </div>
      <div className="h-2 w-full bg-[#0A0A0A]/10 border border-[#0A0A0A]/10">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ delay: 1, duration: 1.4, ease: "easeOut" }}
          className="h-full bg-[#CC0000]"
        />
      </div>
      <p className="mt-1.5 font-pixel text-[9px] tracking-widest text-[#0A0A0A]/25">
        LIMIT: 10,000 · {pct}% CLAIMED
      </p>
    </motion.div>
  );
}

export function Hero() {
  return (
    <section className="relative bg-white px-4 pt-24 pb-16 sm:px-6 lg:pt-36 lg:pb-28 overflow-x-hidden">
      <div className="mx-auto grid max-w-7xl items-start gap-10 lg:grid-cols-2 lg:gap-14">

        {/* ── Left: copy ── */}
        <div className="max-w-xl">

          {/* Status badge */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-6 inline-flex items-center gap-2.5 border-2 border-[#0A0A0A] bg-white px-3 py-1.5"
          >
            <span className="h-2 w-2 animate-pulse bg-[#CC0000]" />
            <span className="font-pixel text-[11px] tracking-widest text-[#0A0A0A] sm:text-[13px]">
              EARLY ACCESS · NOW LIVE
            </span>
          </motion.div>

          {/* Headline */}
          <h1 className="font-pixel text-[2rem] leading-[1.12] tracking-wide text-[#0A0A0A] sm:text-[2.6rem] lg:text-[3.5rem]">
            {[
              { text: "COLLECT YOUR",       red: false },
              { text: "DIGITAL IDENTITY",   red: false },
              { text: "AS A RARE PENGUIN.", red: true  },
            ].map(({ text, red }, i) => (
              <motion.span
                key={text}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1, duration: 0.45 }}
                className={`block ${red ? "text-[#CC0000]" : ""}`}
              >
                {text}
                {red && <span className="cursor-blink" />}
              </motion.span>
            ))}
          </h1>

          {/* Sub-copy */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.38, duration: 0.5 }}
            className="mt-5 w-full max-w-[400px] font-sans text-[14px] leading-relaxed text-[#0A0A0A]/55 sm:text-[15px]"
          >
            Verify any digital handle across platforms and receive a one-of-a-kind
            pixel penguin — seeded uniquely from your identity.
          </motion.p>

          {/* Integration tags */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="mt-4 flex flex-wrap items-center gap-2"
          >
            <span className="font-pixel text-[11px] tracking-widest text-[#0A0A0A]/35">
              WORKS WITH:
            </span>
            {INTEGRATIONS.map((name) => (
              <span
                key={name}
                className="border border-[#0A0A0A] bg-white px-2 py-0.5 font-pixel text-[10px] tracking-widest text-[#0A0A0A]/60 sm:text-[11px]"
              >
                {name}
              </span>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4"
          >
            <Link
              href="/start"
              className="border-2 border-[#0A0A0A] bg-[#0A0A0A] px-5 py-3 text-center font-pixel text-[13px] tracking-widest text-white shadow-[4px_4px_0_#CC0000] transition-all hover:shadow-none hover:translate-x-1 hover:translate-y-1 sm:px-7 sm:text-[15px]"
            >
              &gt; [ CLAIM YOUR PENGUIN ]
            </Link>
            <Link
              href="/#how"
              className="border-2 border-[#0A0A0A] bg-white px-5 py-3 text-center font-pixel text-[13px] tracking-widest text-[#0A0A0A] shadow-[4px_4px_0_#0A0A0A] transition-all hover:shadow-none hover:translate-x-1 hover:translate-y-1 sm:px-7 sm:text-[15px]"
            >
              HOW IT WORKS
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.78, duration: 0.5 }}
            className="mt-8 flex items-center gap-6 border-t-2 border-dashed border-[#0A0A0A]/15 pt-6 sm:gap-10"
          >
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="font-pixel text-[1.8rem] leading-none text-[#0A0A0A] sm:text-[2.2rem]">{s.val}</p>
                <p className="mt-1.5 font-pixel text-[9px] tracking-widest text-[#0A0A0A]/35 sm:text-[10px]">{s.label}</p>
              </div>
            ))}
          </motion.div>

          {/* Mint progress */}
          <MintProgress />
        </div>

        {/* ── Right: terminal info panel ── */}
        <div className="flex flex-col gap-4">
          {/* Terminal window */}
          <div className="border-2 border-[#0A0A0A] shadow-[6px_6px_0_#CC0000]">

            {/* Title bar */}
            <div className="flex items-center gap-2 border-b-2 border-[#0A0A0A]/20 bg-[#0A0A0A] px-4 py-2.5">
              <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
              <span className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
              <span className="h-3 w-3 rounded-full bg-[#28C840]" />
              <span className="ml-3 font-pixel text-[11px] tracking-widest text-white/45 sm:text-[12px]">
                usenly.exe — PROJECT INFO
              </span>
            </div>

            {/* Content */}
            <div className="space-y-1.5 overflow-x-auto bg-white px-4 py-4 sm:px-5 sm:py-5">
              <p className="font-pixel text-[12px] tracking-wide text-[#CC0000] sm:text-[13px]">
                $ ./usenly --status
              </p>
              <div className="mt-3 space-y-1">
                {[
                  ["PLATFORM",           "ONLINE ●"],
                  ["VERSION",            "v1.0.0-beta"],
                  ["COLLECTION LIMIT",   "10,000 PENGUINS"],
                  ["PENGUINS MINTED",    "1,247 / 10,000"],
                  ["REMAINING",          "8,753"],
                  ["RARITY TIERS",       "5  (COMMON → MYTHIC)"],
                  ["SUPPORTED PLATFORMS","4"],
                ].map(([key, val]) => (
                  <p key={key} className="font-pixel text-[11px] tracking-wide text-[#0A0A0A] sm:text-[12px]">
                    <span className="text-[#0A0A0A]/40">&gt; {key}:</span>{" "}
                    <span className={key === "PLATFORM" || key === "REMAINING" ? "text-[#CC0000]" : ""}>{val}</span>
                  </p>
                ))}
              </div>

              <div className="mt-4 border-t border-dashed border-[#0A0A0A]/12 pt-3">
                <p className="mb-2 font-pixel text-[11px] tracking-widest text-[#0A0A0A]/40 sm:text-[12px]">
                  FEATURES:
                </p>
                {FEATURES.map((f) => (
                  <p key={f} className="font-pixel text-[11px] tracking-wide text-[#0A0A0A] sm:text-[12px]">
                    <span className="text-[#CC0000]">[✓]</span> {f}
                  </p>
                ))}
              </div>
            </div>

            {/* Status bar */}
            <div className="flex items-center gap-2.5 border-t border-[#0A0A0A]/10 bg-[#0A0A0A] px-4 py-2">
              <span className="h-2 w-2 animate-pulse bg-[#CC0000]" />
              <span className="font-pixel text-[10px] tracking-widest text-[#CC0000] sm:text-[11px]">
                SYSTEM ONLINE · LATENCY: 12ms
              </span>
            </div>
          </div>

          {/* Pixel penguin preview row */}
          <div className="flex flex-wrap items-end justify-center gap-3 border-2 border-[#0A0A0A] bg-white px-4 py-3 shadow-[4px_4px_0_#0A0A0A]">
            <span className="self-center font-pixel text-[10px] tracking-widest text-[#0A0A0A]/30">
              PREVIEW:
            </span>
            {PREVIEW_PENGUINS.map((b) => (
              <div key={b.seed} className="flex flex-col items-center gap-1">
                <PixelPenguin seed={b.seed} rarity={b.rarity} pixelSize={6} />
                <span className="font-pixel text-[8px] uppercase tracking-widest text-[#0A0A0A]/35">
                  {b.rarity}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
