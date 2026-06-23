"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PixelPenguin } from "@/components/bear/PixelPenguin";
import { SHOWCASE_BEARS } from "@/lib/bear-generator";
import { RARITY_LABELS, type BearRarity } from "@/lib/bear-types";

const ANSI_PILL: Record<BearRarity, { border: string; text: string; shadow: string }> = {
  common:    { border: "border-[#CC0000]", text: "text-[#CC0000]",  shadow: "shadow-[3px_3px_0_#CC0000]"  },
  rare:      { border: "border-[#2979FF]", text: "text-[#2979FF]",  shadow: "shadow-[3px_3px_0_#2979FF]"  },
  epic:      { border: "border-[#D500F9]", text: "text-[#D500F9]",  shadow: "shadow-[3px_3px_0_#D500F9]"  },
  legendary: { border: "border-[#FFD600]", text: "text-[#FFD600]",  shadow: "shadow-[3px_3px_0_#FFD600]"  },
  mythic:    { border: "border-[#FF1744]", text: "text-[#FF1744]",  shadow: "shadow-[3px_3px_0_#FF1744]"  },
};

/* ── One visible penguin card ── */
function PenguinCard({ item, i, animate }: {
  item: { seed: string; rarity: BearRarity };
  i: number;
  animate?: boolean;
}) {
  const pill = ANSI_PILL[item.rarity];
  const card = (
    <div className="flex flex-col items-center">
      <motion.div
        whileHover={{ x: -3, y: -3 }}
        className={`cursor-default border-2 border-[#0A0A0A] bg-white p-1.5 transition-shadow sm:p-2 ${pill.shadow}`}
      >
        <PixelPenguin seed={item.seed} rarity={item.rarity} pixelSize={7} />
      </motion.div>
      <div className="mt-3 flex flex-col items-center gap-1.5">
        <span className="font-pixel text-[11px] uppercase tracking-widest text-[#0A0A0A]/55">
          {item.seed}
        </span>
        <span className={`border px-2 py-0.5 font-pixel text-[10px] tracking-widest ${pill.border} ${pill.text}`}>
          [{RARITY_LABELS[item.rarity].toUpperCase()}]
        </span>
      </div>
    </div>
  );

  if (!animate) return card;
  return (
    <motion.div
      key={item.seed}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.07, duration: 0.4 }}
    >
      {card}
    </motion.div>
  );
}

/* ── Mystery card ── */
function MysteryCard({ i }: { i: number }) {
  // match real penguin card: pixelSize=7, 14×20 grid
  const W = 7 * 14 + 8;   // 106px
  const H = 7 * 20 + 8;   // 148px
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 + i * 0.07, duration: 0.4 }}
      className="flex flex-col items-center"
    >
      <div
        className="border-2 border-dashed border-[#0A0A0A]/25 bg-[#EFEFED] shadow-[3px_3px_0_rgba(10,10,10,0.08)]"
        style={{ width: W, height: H }}
      >
        <div className="flex h-full w-full items-center justify-center">
          <span className="select-none font-pixel text-[28px] text-[#0A0A0A]/18">?</span>
        </div>
      </div>
      <div className="mt-2.5 flex flex-col items-center gap-1">
        <span className="font-pixel text-[10px] tracking-widest text-[#0A0A0A]/18">?????????</span>
        <span className="border border-dashed border-[#0A0A0A]/18 px-2 py-0.5 font-pixel text-[9px] tracking-widest text-[#0A0A0A]/18">
          [?????]
        </span>
      </div>
    </motion.div>
  );
}

const FUTURE_SEASONS = [2, 3, 4, 5];

/* ── Full-screen overlay ── */
function NextSeasonOverlay({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      key="overlay"
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
      className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-[#F7F7F5]"
    >
      {/* Sticky top bar */}
      <div className="shrink-0 flex items-center justify-between border-b-2 border-[#0A0A0A]/10 bg-[#F7F7F5] px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="font-pixel text-[14px] text-[#CC0000]">&gt;</span>
          <span className="font-pixel text-[11px] tracking-widest text-[#0A0A0A]/50 sm:text-[12px]">ALL SEASONS</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="border-2 border-[#0A0A0A] bg-white px-3 py-1 font-pixel text-[10px] tracking-widest text-[#0A0A0A] shadow-[2px_2px_0_#0A0A0A] transition-all hover:shadow-none sm:px-4 sm:py-1.5 sm:text-[11px] sm:shadow-[3px_3px_0_#0A0A0A]"
        >
          ✕ CLOSE
        </button>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto">

        {/* ── Season 1 (live) ── */}
        <div className="mx-auto max-w-6xl px-4 pt-8 pb-10 sm:px-6 sm:pt-12 sm:pb-14">
          <SeasonHeader season={1} live />
          <SeasonRow>
            {SHOWCASE_BEARS.map((item, i) => (
              <PenguinCard key={item.seed} item={item} i={i} animate />
            ))}
          </SeasonRow>
        </div>

        {/* ── Seasons 2–5 (mystery) ── */}
        {FUTURE_SEASONS.map((s) => (
          <div key={s} className="border-t-2 border-dashed border-[#0A0A0A]/10">
            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
              <SeasonHeader season={s} />
              <SeasonRow>
                {Array.from({ length: 5 }).map((_, i) => (
                  <MysteryCard key={i} i={i} />
                ))}
              </SeasonRow>
            </div>
          </div>
        ))}

        {/* ── Black bottom ── */}
        <div className="bg-[#0A0A0A] px-4 py-14 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <p className="mb-8 text-center font-pixel text-[10px] tracking-widest text-white/20 sm:mb-10 sm:text-[11px]">
              BEYOND SEASON 5 — UNKNOWN
            </p>
            <div className="flex items-end justify-center gap-2 sm:gap-6">
              {[44, 58, 72, 58, 44].map((mSize, i) => {
                const dSize = [72, 96, 120, 96, 72][i];
                return (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.4 }}
                    className="select-none font-pixel leading-none text-white/10"
                    style={{ fontSize: `clamp(${mSize}px, ${(dSize / 14).toFixed(1)}vw, ${dSize}px)` }}
                  >
                    ?
                  </motion.span>
                );
              })}
            </div>
            <p className="mt-8 text-center font-pixel text-[9px] tracking-[0.2em] text-white/15 sm:mt-10 sm:text-[10px] sm:tracking-[0.3em]">
              MORE SEASONS · MORE TRAITS · MORE MYSTERY
            </p>
          </div>
        </div>

      </div>
    </motion.div>
  );
}

/* ── Horizontal scroll on mobile, 5-col grid on sm+ ── */
function SeasonRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-5 -mx-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:overflow-x-visible sm:px-0 sm:pb-0">
      <div className="inline-flex gap-4 sm:grid sm:w-full sm:grid-cols-5 sm:gap-6">
        {children}
      </div>
    </div>
  );
}

function SeasonHeader({ season, live }: { season: number; live?: boolean }) {
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <span className={`shrink-0 border-2 px-2.5 py-0.5 font-pixel text-[10px] tracking-widest sm:px-3 sm:py-1 sm:text-[11px] ${
        live
          ? "border-[#0A0A0A] bg-[#0A0A0A] text-white"
          : "border-dashed border-[#0A0A0A]/25 bg-white text-[#0A0A0A]/35"
      }`}>
        SEASON {season}
      </span>
      <div className="flex-1 border-t-2 border-dashed border-[#0A0A0A]/10" />
      {live ? (
        <>
          <span className="hidden font-pixel text-[10px] tracking-widest text-[#0A0A0A]/30 sm:inline">LIVE</span>
          <span className="h-2 w-2 animate-pulse bg-[#00C853]" />
        </>
      ) : (
        <span className="font-pixel text-[9px] tracking-widest text-[#0A0A0A]/20 sm:text-[10px]">SOON</span>
      )}
    </div>
  );
}

/* ══════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════ */
export function BearGallery() {
  const [showNext, setShowNext] = useState(false);

  return (
    <>
      <section
        id="collection"
        className="relative border-t-2 border-dashed border-[#0A0A0A]/15 bg-white px-4 py-16 sm:px-6 sm:py-24 lg:py-32"
      >
        <div className="mx-auto max-w-6xl">

          {/* Section label + button */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="flex flex-wrap items-center gap-2 sm:gap-3"
          >
            <span className="font-pixel text-[14px] text-[#CC0000]">&gt;</span>
            <span className="font-pixel text-[12px] tracking-widest text-[#0A0A0A]/38">COLLECTION</span>
            <div className="flex-1 min-w-[20px] border-t border-dashed border-[#0A0A0A]/15" />
            <button
              type="button"
              onClick={() => setShowNext(true)}
              className="shrink-0 border-2 border-[#0A0A0A] bg-white px-2.5 py-1 font-pixel text-[9px] tracking-widest text-[#0A0A0A] shadow-[3px_3px_0_#CC0000] transition-all hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 sm:px-3 sm:text-[10px]"
            >
              NEXT SEASON →
            </button>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="mt-5 font-pixel text-[1.8rem] tracking-wide text-[#0A0A0A] sm:text-[2.4rem] lg:text-[3rem]"
          >
            EVERY PENGUIN IS UNIQUE
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-3 max-w-md font-sans text-[15px] leading-relaxed text-[#0A0A0A]/50"
          >
            5 rarity tiers. Each pixel penguin seeded deterministically from your identity handle.
          </motion.p>

          {/* Penguin grid */}
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:mt-14 sm:grid-cols-3 sm:gap-x-8 sm:gap-y-12 lg:grid-cols-5">
            {SHOWCASE_BEARS.map((item, i) => (
              <motion.div
                key={item.seed}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ delay: i * 0.09, duration: 0.5 }}
              >
                <PenguinCard item={item} i={i} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {showNext && <NextSeasonOverlay onClose={() => setShowNext(false)} />}
      </AnimatePresence>
    </>
  );
}
