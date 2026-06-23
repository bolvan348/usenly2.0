"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { generateBearTraits } from "@/lib/bear-generator";
import type { BearRarity } from "@/lib/bear-types";
import { RARITY_LABELS } from "@/lib/bear-types";
import { PlushBearDefs, PlushBearSvg } from "./PlushBearSvg";

/* ─── ANSI terminal accent per rarity ─── */
const ANSI: Record<BearRarity, string> = {
  common:    "#CC0000", // terminal green
  rare:      "#2979FF", // terminal blue
  epic:      "#D500F9", // terminal magenta
  legendary: "#FFD600", // terminal yellow
  mythic:    "#FF1744", // terminal red
};

/* ─── Card dimensions (SVG user units) ─── */
const CW   = 272;   // card width
const CH   = 336;   // card height
const SD   = 4;     // shadow offset
const HDR  = 60;    // header height
const FTR  = 56;    // footer/info height
const BEAR_H = CH - HDR - FTR; // = 220

interface BearPackageProps {
  seed?:          string;
  rarity?:        BearRarity;
  size?:          number;
  floating?:      boolean;
  floatDuration?: number;
  floatDelay?:    number;
  /** @deprecated no longer used — tilt removed in terminal redesign */
  interactive?:   boolean;
}

export function BearPackage({
  seed          = "usenly",
  rarity,
  size          = 260,
  floating      = false,
  floatDuration = 5.5,
  floatDelay    = 0,
}: BearPackageProps) {
  const traits    = useMemo(() => generateBearTraits(seed, rarity), [seed, rarity]);
  const ansiColor = ANSI[traits.rarity];
  const rLabel    = RARITY_LABELS[traits.rarity].toUpperCase();

  const uid  = `pkg-${seed.replace(/[^a-z0-9]/gi, "").slice(0, 10)}-${size}`;
  const svgW = size;
  const svgH = Math.round(size * ((CH + SD) / (CW + SD)));

  /* ── Bear scale: fit 280×320 viewBox into the bear window ── */
  const bearScale = Math.min((CW - 24) / 280, (BEAR_H - 8) / 320);
  const bsW       = 280 * bearScale;
  const bsH       = 320 * bearScale;
  const bearTx    = (CW - bsW) / 2;
  const bearTy    = HDR + (BEAR_H - bsH) / 2;

  const bearTop = HDR;
  const bearBot = HDR + BEAR_H; // = 280

  return (
    <motion.div
      className="relative select-none"
      style={{ width: svgW, height: svgH }}
      animate={floating ? { y: [0, -6, 0] } : undefined}
      transition={
        floating
          ? { duration: floatDuration, repeat: Infinity, ease: "easeInOut", delay: floatDelay }
          : undefined
      }
    >
      <svg
        viewBox={`0 0 ${CW + SD} ${CH + SD}`}
        width={svgW}
        height={svgH}
        className="overflow-visible"
        aria-hidden
      >
        <defs>
          <PlushBearDefs uid={uid} seed={traits.seed} palette={traits.palette} />

          {/* Clip bear to its window */}
          <clipPath id={`${uid}-bclip`}>
            <rect x="0" y={bearTop} width={CW} height={BEAR_H} />
          </clipPath>

          {/* Bear background radial gradient */}
          <radialGradient id={`${uid}-bbg`} cx="48%" cy="36%" r="64%">
            <stop offset="0%"   stopColor={traits.backgroundAccent} stopOpacity="0.55" />
            <stop offset="100%" stopColor={traits.backgroundColor} />
          </radialGradient>
        </defs>

        {/* ── ANSI COLOR PIXEL SHADOW ── */}
        <rect x={SD} y={SD} width={CW} height={CH} fill={ansiColor} />

        {/* ── MAIN CARD ── */}
        <rect x="0" y="0" width={CW} height={CH}
          fill="#ffffff" stroke="#0A0A0A" strokeWidth="2"
        />

        {/* ── HEADER BAND ── */}
        <rect x="0" y="0" width={CW} height={HDR} fill="#0A0A0A" />

        {/* Scanlines */}
        {Array.from({ length: 15 }, (_, i) => (
          <line key={i}
            x1="0"  y1={i * 4 + 2}
            x2={CW} y2={i * 4 + 2}
            stroke="#fff" strokeWidth="0.6" opacity={0.05}
          />
        ))}

        {/* macOS-style traffic lights (terminal window hint) */}
        <circle cx={CW - 20} cy="18" r="4.5" fill="#FF5F57" opacity={0.85} />
        <circle cx={CW - 34} cy="18" r="4.5" fill="#FFBD2E" opacity={0.85} />
        <circle cx={CW - 48} cy="18" r="4.5" fill="#28C840" opacity={0.85} />

        {/* Brand */}
        <text
          x="14" y="29"
          fill="#CC0000" fontSize="12.5" fontWeight="700"
          letterSpacing="0.24em"
          fontFamily="'Courier New', Courier, monospace"
        >
          &gt; USENLY
        </text>

        {/* Rarity */}
        <text
          x="14" y="49"
          fill={ansiColor} fontSize="10"
          letterSpacing="0.1em"
          fontFamily="'Courier New', Courier, monospace"
        >
          [{rLabel}]
        </text>

        {/* ── BEAR BACKGROUND ── */}
        <rect x="0" y={bearTop} width={CW} height={BEAR_H}
          fill={`url(#${uid}-bbg)`}
        />

        {/* ── BEAR SVG ── */}
        <g clipPath={`url(#${uid}-bclip)`}>
          <g transform={`translate(${bearTx.toFixed(1)}, ${bearTy.toFixed(1)}) scale(${bearScale.toFixed(4)})`}>
            <PlushBearSvg traits={traits} uid={uid} />
          </g>
        </g>

        {/* ── BEAR AREA BORDERS ── */}
        {/* Top separator (solid) */}
        <line x1="0" y1={bearTop} x2={CW} y2={bearTop}
          stroke="#0A0A0A" strokeWidth="2"
        />
        {/* Bottom separator (subtle) */}
        <line x1="0" y1={bearBot} x2={CW} y2={bearBot}
          stroke="#0A0A0A" strokeWidth="1" opacity={0.25}
        />

        {/* Corner brackets — TL */}
        <path
          d={`M 9 ${bearTop + 9} L 9 ${bearTop + 18} M 9 ${bearTop + 9} L 18 ${bearTop + 9}`}
          stroke="#0A0A0A" strokeWidth="1.5" opacity={0.28} fill="none"
        />
        {/* TR */}
        <path
          d={`M ${CW - 9} ${bearTop + 9} L ${CW - 9} ${bearTop + 18} M ${CW - 9} ${bearTop + 9} L ${CW - 18} ${bearTop + 9}`}
          stroke="#0A0A0A" strokeWidth="1.5" opacity={0.28} fill="none"
        />
        {/* BL */}
        <path
          d={`M 9 ${bearBot - 9} L 9 ${bearBot - 18} M 9 ${bearBot - 9} L 18 ${bearBot - 9}`}
          stroke="#0A0A0A" strokeWidth="1.5" opacity={0.28} fill="none"
        />
        {/* BR */}
        <path
          d={`M ${CW - 9} ${bearBot - 9} L ${CW - 9} ${bearBot - 18} M ${CW - 9} ${bearBot - 9} L ${CW - 18} ${bearBot - 9}`}
          stroke="#0A0A0A" strokeWidth="1.5" opacity={0.28} fill="none"
        />

        {/* ── INFO STRIP ── */}
        <rect x="0" y={bearBot} width={CW} height={FTR}
          fill="#0A0A0A" opacity={0.05}
        />

        {/* Seed */}
        <text
          x="14" y={bearBot + 22}
          fill="#0A0A0A" fontSize="9.5" opacity={0.38}
          letterSpacing="0.1em"
          fontFamily="'Courier New', Courier, monospace"
        >
          #{traits.seed.toUpperCase().slice(0, 10)}
        </text>

        {/* Status */}
        <text
          x="14" y={bearBot + 42}
          fill="#CC0000" fontSize="9.5"
          letterSpacing="0.06em"
          fontFamily="'Courier New', Courier, monospace"
        >
          STATUS: VERIFIED ✓
        </text>

        {/* 1/1 label */}
        <text
          x={CW - 14} y={bearBot + 42}
          fill="#0A0A0A" fontSize="9" opacity={0.22}
          textAnchor="end"
          fontFamily="'Courier New', Courier, monospace"
        >
          1 OF 1
        </text>
      </svg>
    </motion.div>
  );
}
