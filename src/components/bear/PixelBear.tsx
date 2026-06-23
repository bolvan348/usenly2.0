"use client";

import { useMemo } from "react";
import { generateBearTraits } from "@/lib/bear-generator";
import type { BearRarity } from "@/lib/bear-types";

/* ── ANSI-style palettes per rarity ── */
const PIXEL_PALETTES: Record<
  BearRarity,
  { fur: string; dark: string; muzzle: string; eye: string; nose: string; cheek: string }
> = {
  common:    { fur: "#C8A878", dark: "#8B6040", muzzle: "#F0D0A0", eye: "#180800", nose: "#180800", cheek: "#F0A0A8" },
  rare:      { fur: "#6890D8", dark: "#2848A0", muzzle: "#A8C8F8", eye: "#080818", nose: "#080818", cheek: "#88B0F0" },
  epic:      { fur: "#B078E0", dark: "#6020A0", muzzle: "#D8B8FF", eye: "#100820", nose: "#100820", cheek: "#C880FF" },
  legendary: { fur: "#E0B838", dark: "#906800", muzzle: "#F8E870", eye: "#180800", nose: "#180800", cheek: "#FFD860" },
  mythic:    { fur: "#484848", dark: "#181818", muzzle: "#787878", eye: "#000000", nose: "#000000", cheek: "#606060" },
};

/* ── 16×20 pixel-art bear grid ──
   f = fur     d = dark fur    m = muzzle (light)
   e = eye     n = nose        c = cheek
   . = transparent
*/
const BEAR_GRID = [
  "....ffffffff....",  //  0 head top
  "...ffffffffff...",  //  1
  "..ffddffffddff..",  //  2 ears
  "..ffddffffddff..",  //  3 ears
  ".ffffffffffffff.",  //  4 head
  ".ffffffffffffff.",  //  5
  "ffffffffffffffff",  //  6 full head width
  "fffeeffffffeefff",  //  7 eyes
  "fffeeffffffeefff",  //  8 eyes
  "ffcffffffffffcff",  //  9 cheeks (cols 2 & 13)
  "ffffmmmmmmmmffff",  // 10 muzzle top
  "fffmmmmnnnnmmfff",  // 11 nose area
  "fffmmmnnnnnmmfff",  // 12 nose center
  "fffmmmmnnnnmmfff",  // 13 nose area
  "ffffmmmmmmmmffff",  // 14 muzzle bottom
  ".ffffffffffffff.",  // 15 body
  ".ffffffffffffff.",  // 16
  "..ffffffffffff..",  // 17 body narrows
  "..ffdd....ddff..",  // 18 legs / paws
  "..ffdd....ddff..",  // 19 paws
];

const COLS = 16;
const ROWS = BEAR_GRID.length; // 20

interface PixelBearProps {
  seed?:       string;
  rarity?:     BearRarity;
  /** Size of each pixel square in SVG units. Controls overall bear size. */
  pixelSize?:  number;
  className?:  string;
}

export function PixelBear({
  seed      = "usenly",
  rarity,
  pixelSize = 12,
  className = "",
}: PixelBearProps) {
  const traits = useMemo(() => generateBearTraits(seed, rarity), [seed, rarity]);
  const pal    = PIXEL_PALETTES[traits.rarity];

  const COLOR_MAP: Record<string, string> = {
    f: pal.fur,
    d: pal.dark,
    m: pal.muzzle,
    e: pal.eye,
    n: pal.nose,
    c: pal.cheek,
  };

  const W = COLS * pixelSize;
  const H = ROWS * pixelSize;

  /* Build rect list once per render */
  const rects = useMemo(() => {
    const out: { x: number; y: number; color: string; key: string }[] = [];
    for (let r = 0; r < ROWS; r++) {
      const row = BEAR_GRID[r];
      for (let c = 0; c < COLS; c++) {
        const ch = row[c];
        if (ch !== "." && COLOR_MAP[ch]) {
          out.push({ x: c * pixelSize, y: r * pixelSize, color: COLOR_MAP[ch], key: `${r}-${c}` });
        }
      }
    }
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [traits.rarity, pixelSize]);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={W}
      height={H}
      style={{ imageRendering: "pixelated" }}
      className={className}
      aria-label={`Pixel bear — ${traits.rarity}`}
    >
      {rects.map(({ x, y, color, key }) => (
        <rect key={key} x={x} y={y} width={pixelSize} height={pixelSize} fill={color} />
      ))}
    </svg>
  );
}
