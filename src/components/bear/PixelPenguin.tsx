"use client";

import { useMemo } from "react";
import { generateBearTraits, generatePenguinAccessories } from "@/lib/bear-generator";
import type { BearRarity, PenguinAccessories } from "@/lib/bear-types";

type PenguinPal = { k:string; G:string; g:string; w:string; y:string };

/* ── Rarity colour palettes + extra colour variants ── */
const PALETTES: Record<string, PenguinPal> = {
  /* rarity-based */
  common:    { k:"#111111", G:"#5A5A5A", g:"#8C8C8C", w:"#F4EED8", y:"#E8C010" },
  rare:      { k:"#081040", G:"#2248A0", g:"#4070C8", w:"#D8EAFF", y:"#60B0FF" },
  epic:      { k:"#160028", G:"#581898", g:"#8840C8", w:"#EED8FF", y:"#C058FF" },
  legendary: { k:"#180800", G:"#905818", g:"#C88828", w:"#FFF0C0", y:"#F0C000" },
  mythic:    { k:"#000000", G:"#101010", g:"#282828", w:"#C0C0C0", y:"#CC0000" },
  /* extra colour variants for falling penguins */
  green:     { k:"#0A2A0A", G:"#1A7020", g:"#2EAA40", w:"#D8FFD8", y:"#80FF40" },
  red:       { k:"#3A0000", G:"#8A1010", g:"#CC2828", w:"#FFD8D8", y:"#FF9000" },
  orange:    { k:"#2A1000", G:"#A04000", g:"#E06800", w:"#FFF0D0", y:"#FFCC00" },
  pink:      { k:"#3A0025", G:"#A02060", g:"#E040A0", w:"#FFD8F0", y:"#FF60C8" },
  cyan:      { k:"#001A30", G:"#006088", g:"#00A8CC", w:"#D0F8FF", y:"#40DFFF" },
  teal:      { k:"#001A18", G:"#007060", g:"#00A890", w:"#D0FFF8", y:"#40FFD0" },
  yellow:    { k:"#2A2000", G:"#906000", g:"#C89000", w:"#FFFFF0", y:"#FF4040" },
};

/* All palette keys for cycling in falling penguins */
export const ALL_PALETTE_KEYS = Object.keys(PALETTES);

const PENGUIN_GRID = [
  "....kkkkkkkk....",  //  0
  "...kGGGGGGGGk...",  //  1
  "..kGGGGGGGGGGk..",  //  2
  "..kGGGwwwwGGGk..",  //  3
  ".kGGGwwwwwwGGGk.",  //  4
  ".kGwwwwwwwwwwGk.",  //  5
  ".kGwwkkwwkkwwGk.",  //  6  eyes: k at cols 4-5, 8-9
  ".kGwwwwwwwwwwGk.",  //  7
  ".kGwwwwyyywwwGk.",  //  8  beak: y at cols 6-8
  ".kGGwwwyywwwGGk.",  //  9
  ".kGGGwwwwwGGGk..",  // 10
  "kgGGGGwwwwGGGGgk",  // 11
  "kggGGGwwwwGGGggk",  // 12
  "kggGGGwwwwGGGggk",  // 13
  "kggGGGwwwwGGGggk",  // 14
  ".kggGGGGGGGGggk.",  // 15
  "..kGGGGGGGGGGk..",  // 16
  "...kGGGGGGGGk...",  // 17
  "....kyyykyyy....",  // 18  feet: y at cols 5-7, 9-11
  "....kyyykyyy....",  // 19
];

const COLS      = 16;
const ROWS      = 20;
const HAT_ROWS  = 5;   // extra canvas rows above head for hats
const TOTAL_ROWS = ROWS + HAT_ROWS;

// Accessory pixel: [row, col, color]
// row < 0 → above head (hat space)
// row 0–19 → overlaid on penguin
type AP = [number, number, string];

/* ─────────── Hat layers ─────────── */
function getHatPixels(hat: PenguinAccessories["hat"]): AP[] {
  switch (hat) {
    case "tophat": return [
      [-4,5,"#1a1a1a"],[-4,6,"#333"],  [-4,7,"#1a1a1a"],[-4,8,"#1a1a1a"],[-4,9,"#1a1a1a"],[-4,10,"#1a1a1a"],
      [-3,5,"#800000"],[-3,6,"#800000"],[-3,7,"#800000"],[-3,8,"#800000"],[-3,9,"#800000"],[-3,10,"#800000"],
      [-2,5,"#1a1a1a"],[-2,6,"#1a1a1a"],[-2,7,"#1a1a1a"],[-2,8,"#1a1a1a"],[-2,9,"#1a1a1a"],[-2,10,"#1a1a1a"],
      [-1,4,"#1a1a1a"],[-1,5,"#1a1a1a"],[-1,6,"#1a1a1a"],[-1,7,"#1a1a1a"],[-1,8,"#1a1a1a"],[-1,9,"#1a1a1a"],[-1,10,"#1a1a1a"],[-1,11,"#1a1a1a"],
    ];
    case "crown": return [
      [-3,5,"#FFD700"],[-3,7,"#FFD700"],[-3,9,"#FFD700"],
      [-2,4,"#FFD700"],[-2,5,"#FFD700"],[-2,6,"#FFD700"],[-2,7,"#FFD700"],[-2,8,"#FFD700"],[-2,9,"#FFD700"],[-2,10,"#FFD700"],
      [-1,4,"#CC9900"],[-1,5,"#CC9900"],[-1,6,"#CC9900"],[-1,7,"#CC9900"],[-1,8,"#CC9900"],[-1,9,"#CC9900"],[-1,10,"#CC9900"],
      [-2,5,"#CC2020"],[-2,7,"#2060CC"],[-2,9,"#CC2020"],
    ];
    case "cap_red": return [
      [-2,5,"#CC0000"],[-2,6,"#CC0000"],[-2,7,"#CC0000"],[-2,8,"#CC0000"],[-2,9,"#CC0000"],[-2,10,"#CC0000"],
      [-1,5,"#CC0000"],[-1,6,"#CC0000"],[-1,7,"#CC0000"],[-1,8,"#CC0000"],[-1,9,"#CC0000"],[-1,10,"#CC0000"],
      [0,3,"#111"],[0,4,"#111"],[0,5,"#111"],[0,6,"#111"],[0,7,"#111"],[0,8,"#111"],[0,9,"#111"],[0,10,"#111"],[0,11,"#111"],[0,12,"#111"],
      [-2,7,"#FFDDDD"],
    ];
    case "cap_blue": return [
      [-2,5,"#1a3a8a"],[-2,6,"#1a3a8a"],[-2,7,"#1a3a8a"],[-2,8,"#1a3a8a"],[-2,9,"#1a3a8a"],[-2,10,"#1a3a8a"],
      [-1,5,"#1a3a8a"],[-1,6,"#1a3a8a"],[-1,7,"#1a3a8a"],[-1,8,"#1a3a8a"],[-1,9,"#1a3a8a"],[-1,10,"#1a3a8a"],
      [0,3,"#111"],[0,4,"#111"],[0,5,"#111"],[0,6,"#111"],[0,7,"#111"],[0,8,"#111"],[0,9,"#111"],[0,10,"#111"],[0,11,"#111"],[0,12,"#111"],
      [-2,7,"#D0D8FF"],
    ];
    case "beanie_red": return [
      [-3,7,"#F5F5F5"],[-3,8,"#F5F5F5"],
      [-2,5,"#CC0000"],[-2,6,"#EE1111"],[-2,7,"#CC0000"],[-2,8,"#EE1111"],[-2,9,"#CC0000"],[-2,10,"#EE1111"],
      [-1,4,"#CC0000"],[-1,5,"#EE1111"],[-1,6,"#CC0000"],[-1,7,"#EE1111"],[-1,8,"#CC0000"],[-1,9,"#EE1111"],[-1,10,"#CC0000"],[-1,11,"#EE1111"],
      [0,4,"#CC0000"],[0,5,"#CC0000"],[0,6,"#CC0000"],[0,7,"#CC0000"],[0,8,"#CC0000"],[0,9,"#CC0000"],[0,10,"#CC0000"],[0,11,"#CC0000"],
    ];
    case "beanie_blue": return [
      [-3,7,"#F5F5F5"],[-3,8,"#F5F5F5"],
      [-2,5,"#1a3a8a"],[-2,6,"#2050AA"],[-2,7,"#1a3a8a"],[-2,8,"#2050AA"],[-2,9,"#1a3a8a"],[-2,10,"#2050AA"],
      [-1,4,"#1a3a8a"],[-1,5,"#2050AA"],[-1,6,"#1a3a8a"],[-1,7,"#2050AA"],[-1,8,"#1a3a8a"],[-1,9,"#2050AA"],[-1,10,"#1a3a8a"],[-1,11,"#2050AA"],
      [0,4,"#1a3a8a"],[0,5,"#1a3a8a"],[0,6,"#1a3a8a"],[0,7,"#1a3a8a"],[0,8,"#1a3a8a"],[0,9,"#1a3a8a"],[0,10,"#1a3a8a"],[0,11,"#1a3a8a"],
    ];
    case "frog_hat": return [
      [-4,5,"#0A6010"],[-4,6,"#000000"],[-4,7,"#0A6010"],
      [-4,9,"#0A6010"],[-4,10,"#000000"],[-4,11,"#0A6010"],
      [-3,4,"#1EAA30"],[-3,5,"#1EAA30"],[-3,6,"#E8FFE8"],[-3,7,"#1EAA30"],
      [-3,8,"#1EAA30"],[-3,9,"#1EAA30"],[-3,10,"#E8FFE8"],[-3,11,"#1EAA30"],[-3,12,"#1EAA30"],
      [-2,4,"#2CC840"],[-2,5,"#0A6010"],[-2,6,"#2CC840"],[-2,7,"#2CC840"],
      [-2,8,"#2CC840"],[-2,9,"#2CC840"],[-2,10,"#0A6010"],[-2,11,"#2CC840"],
      [-1,3,"#1A8A25"],[-1,4,"#1A8A25"],[-1,5,"#1A8A25"],[-1,6,"#1A8A25"],
      [-1,7,"#1A8A25"],[-1,8,"#1A8A25"],[-1,9,"#1A8A25"],[-1,10,"#1A8A25"],
      [-1,11,"#1A8A25"],[-1,12,"#1A8A25"],
    ];
    case "party_hat": return [
      [-4,8,"#FF40A0"],
      [-3,7,"#FF40A0"],[-3,8,"#FF40A0"],[-3,9,"#FFD700"],
      [-2,6,"#FF40A0"],[-2,7,"#FFD700"],[-2,8,"#FF40A0"],[-2,9,"#FF40A0"],[-2,10,"#FFD700"],
      [-1,5,"#FF40A0"],[-1,6,"#FFD700"],[-1,7,"#FF40A0"],[-1,8,"#FF40A0"],[-1,9,"#FFD700"],[-1,10,"#FF40A0"],[-1,11,"#FF40A0"],
      // pompom
      [-4,7,"#FFFFFF"],[-4,8,"#FFFFFF"],[-4,9,"#FFFFFF"],
    ];
    case "wizard_hat": return [
      [-4,8,"#5010A0"],
      [-4,7,"#FFD700"], // star
      [-3,7,"#6A20C0"],[-3,8,"#6A20C0"],[-3,9,"#FFD700"],
      [-2,6,"#6A20C0"],[-2,7,"#6A20C0"],[-2,8,"#6A20C0"],[-2,9,"#6A20C0"],[-2,10,"#FFD700"],
      [-1,4,"#4A1090"],[-1,5,"#4A1090"],[-1,6,"#4A1090"],[-1,7,"#4A1090"],
      [-1,8,"#4A1090"],[-1,9,"#4A1090"],[-1,10,"#4A1090"],[-1,11,"#4A1090"],
    ];
    case "santa_hat": return [
      [-4,8,"#FFFFFF"],[-4,9,"#FFFFFF"],
      [-3,7,"#CC0000"],[-3,8,"#CC0000"],[-3,9,"#CC0000"],[-3,10,"#CC0000"],
      [-2,6,"#CC0000"],[-2,7,"#CC0000"],[-2,8,"#CC0000"],[-2,9,"#CC0000"],[-2,10,"#CC0000"],[-2,11,"#CC0000"],
      [-1,4,"#FFFFFF"],[-1,5,"#FFFFFF"],[-1,6,"#FFFFFF"],[-1,7,"#FFFFFF"],
      [-1,8,"#FFFFFF"],[-1,9,"#FFFFFF"],[-1,10,"#FFFFFF"],[-1,11,"#FFFFFF"],[-1,12,"#FFFFFF"],
    ];
    case "cowboy_hat": return [
      [-3,6,"#8B5A2B"],[-3,7,"#8B5A2B"],[-3,8,"#8B5A2B"],[-3,9,"#8B5A2B"],[-3,10,"#8B5A2B"],
      [-2,6,"#A0692A"],[-2,7,"#A0692A"],[-2,8,"#A0692A"],[-2,9,"#A0692A"],[-2,10,"#A0692A"],
      [-2,7,"#CC8800"],[-2,9,"#CC8800"], // band detail
      [-1,3,"#7A4A1A"],[-1,4,"#7A4A1A"],[-1,5,"#7A4A1A"],[-1,6,"#7A4A1A"],
      [-1,7,"#7A4A1A"],[-1,8,"#7A4A1A"],[-1,9,"#7A4A1A"],[-1,10,"#7A4A1A"],
      [-1,11,"#7A4A1A"],[-1,12,"#7A4A1A"],[-1,13,"#7A4A1A"],
    ];
    case "viking_helmet": return [
      [-3,5,"#888"],[-3,6,"#AAA"],[-3,7,"#AAA"],[-3,8,"#AAA"],[-3,9,"#AAA"],[-3,10,"#AAA"],[-3,11,"#888"],
      [-2,4,"#999"],[-2,5,"#BBB"],[-2,6,"#BBB"],[-2,7,"#BBB"],[-2,8,"#BBB"],[-2,9,"#BBB"],[-2,10,"#BBB"],[-2,11,"#BBB"],[-2,12,"#999"],
      [-1,4,"#888"],[-1,5,"#888"],[-1,6,"#888"],[-1,7,"#888"],[-1,8,"#888"],[-1,9,"#888"],[-1,10,"#888"],[-1,11,"#888"],[-1,12,"#888"],
      // horns
      [-4,3,"#EEE"],[-4,4,"#EEE"],[-3,3,"#DDD"],[-3,4,"#EEE"],
      [-4,12,"#EEE"],[-4,13,"#EEE"],[-3,12,"#EEE"],[-3,13,"#DDD"],
    ];
    case "flower_crown": return [
      [-1,4,"#228B22"],[-1,5,"#228B22"],[-1,6,"#228B22"],[-1,7,"#228B22"],
      [-1,8,"#228B22"],[-1,9,"#228B22"],[-1,10,"#228B22"],[-1,11,"#228B22"],
      // flowers
      [-2,4,"#FF4040"],[-2,5,"#FF4040"],
      [-2,7,"#FFD700"],[-2,8,"#FFD700"],
      [-2,10,"#FF69B4"],[-2,11,"#FF69B4"],
      [-3,5,"#FF4040"],[-3,8,"#FFD700"],[-3,10,"#FF69B4"],
      // flower centers
      [-2,4,"#FFFF00"],[-2,7,"#FF8800"],[-2,10,"#FFFFFF"],
    ];
    case "halo": return [
      [-3,5,"#FFD700"],[-3,6,"#FFD700"],[-3,7,"#FFE066"],[-3,8,"#FFE066"],
      [-3,9,"#FFE066"],[-3,10,"#FFD700"],[-3,11,"#FFD700"],
      [-2,4,"#FFD700"],[-2,12,"#FFD700"],
    ];
    default: return [];
  }
}

/* ─────────── Glasses layers ─────────── */
function getGlassesPixels(glasses: PenguinAccessories["glasses"]): AP[] {
  switch (glasses) {
    case "sunglasses": return [
      [5,3,"#2a2a2a"],[5,4,"#0d0d0d"],[5,5,"#0d0d0d"],[5,6,"#2a2a2a"],
      [6,3,"#2a2a2a"],[6,4,"#0d0d0d"],[6,5,"#0d0d0d"],[6,6,"#2a2a2a"],
      [6,7,"#444"],
      [5,8,"#2a2a2a"],[5,9,"#0d0d0d"],[5,10,"#0d0d0d"],[5,11,"#2a2a2a"],
      [6,8,"#2a2a2a"],[6,9,"#0d0d0d"],[6,10,"#0d0d0d"],[6,11,"#2a2a2a"],
    ];
    case "round_glasses": return [
      [5,4,"#8B6914"],[5,5,"#8B6914"],
      [6,3,"#8B6914"],[6,6,"#8B6914"],
      [7,4,"#8B6914"],[7,5,"#8B6914"],
      [6,7,"#8B6914"],
      [5,9,"#8B6914"],[5,10,"#8B6914"],
      [6,8,"#8B6914"],[6,11,"#8B6914"],
      [7,9,"#8B6914"],[7,10,"#8B6914"],
    ];
    case "star_glasses": return [
      [5,3,"#FF40A0"],[5,4,"#FF40A0"],[5,5,"#FF40A0"],[5,6,"#FF40A0"],
      [6,3,"#FF40A0"],[6,4,"#FFFFFF"],[6,5,"#FF40A0"],[6,6,"#FF40A0"],
      [7,4,"#FF40A0"],[7,5,"#FF40A0"],
      [6,7,"#FF40A0"],
      [5,8,"#FF40A0"],[5,9,"#FF40A0"],[5,10,"#FF40A0"],[5,11,"#FF40A0"],
      [6,8,"#FF40A0"],[6,9,"#FFFFFF"],[6,10,"#FF40A0"],[6,11,"#FF40A0"],
      [7,9,"#FF40A0"],[7,10,"#FF40A0"],
    ];
    case "heart_glasses": return [
      [5,3,"#FF2060"],[5,4,"#FF2060"],[5,5,"#FF2060"],
      [5,7,"#FF2060"],[5,8,"#FF2060"],
      [5,9,"#FF2060"],[5,10,"#FF2060"],[5,11,"#FF2060"],
      [6,3,"#FF2060"],[6,4,"#FF2060"],[6,5,"#FF2060"],[6,6,"#FF2060"],
      [6,8,"#FF2060"],[6,9,"#FF2060"],[6,10,"#FF2060"],[6,11,"#FF2060"],
      [7,4,"#FF2060"],[7,5,"#FF2060"],[7,6,"#FF2060"],
      [7,8,"#FF2060"],[7,9,"#FF2060"],[7,10,"#FF2060"],
      [8,5,"#FF2060"],[8,6,"#FF2060"],[8,9,"#FF2060"],
    ];
    case "glasses_3d": return [
      [5,3,"#CC0000"],[5,4,"#CC0000"],[5,5,"#CC0000"],[5,6,"#CC0000"],
      [6,3,"#CC0000"],[6,4,"#FF6666"],[6,5,"#FF6666"],[6,6,"#CC0000"],
      [7,4,"#CC0000"],[7,5,"#CC0000"],
      [6,7,"#333"],
      [5,8,"#0044CC"],[5,9,"#0044CC"],[5,10,"#0044CC"],[5,11,"#0044CC"],
      [6,8,"#0044CC"],[6,9,"#6699FF"],[6,10,"#6699FF"],[6,11,"#0044CC"],
      [7,9,"#0044CC"],[7,10,"#0044CC"],
    ];
    default: return [];
  }
}

/* ─────────── Outfit layers ─────────── */
function getOutfitPixels(outfit: PenguinAccessories["outfit"]): AP[] {
  switch (outfit) {
    case "tie_red": return [
      [10,7,"#CC0000"],[10,8,"#CC0000"],
      [11,6,"#CC0000"],[11,7,"#CC0000"],[11,8,"#CC0000"],
      [12,7,"#CC0000"],[12,8,"#CC0000"],
      [13,7,"#CC0000"],[13,8,"#CC0000"],
      [14,7,"#CC0000"],
      [15,7,"#880000"],
    ];
    case "tie_blue": return [
      [10,7,"#1a3a8a"],[10,8,"#1a3a8a"],
      [11,6,"#1a3a8a"],[11,7,"#1a3a8a"],[11,8,"#1a3a8a"],
      [12,7,"#1a3a8a"],[12,8,"#1a3a8a"],
      [13,7,"#1a3a8a"],[13,8,"#1a3a8a"],
      [14,7,"#1a3a8a"],
      [15,7,"#0a205a"],
    ];
    case "scarf": return [
      [10,4,"#CC2020"],[10,5,"#FFFFFF"],[10,6,"#CC2020"],[10,7,"#FFFFFF"],
      [10,8,"#CC2020"],[10,9,"#FFFFFF"],[10,10,"#CC2020"],[10,11,"#FFFFFF"],
      [11,4,"#CC2020"],[11,5,"#FFFFFF"],
      [12,4,"#CC2020"],
    ];
    case "bow_tie": return [
      [10,4,"#CC0000"],[10,5,"#CC0000"],[10,6,"#CC0000"],
      [10,7,"#0A0A0A"],
      [10,8,"#CC0000"],[10,9,"#CC0000"],[10,10,"#CC0000"],
    ];
    case "hoodie": return [
      [10,4,"#555"],[ 10,5,"#555"],[10,6,"#555"],[10,7,"#555"],[10,8,"#555"],[10,9,"#555"],[10,10,"#555"],[10,11,"#555"],
      [11,3,"#555"],[11,4,"#555"],[11,5,"#555"],[11,6,"#555"],[11,7,"#555"],[11,8,"#555"],[11,9,"#555"],[11,10,"#555"],[11,11,"#555"],[11,12,"#555"],
      [12,3,"#555"],[12,4,"#555"],[12,12,"#555"],
      [13,3,"#444"],[13,4,"#444"],[13,12,"#444"],
      // pocket
      [12,7,"#444"],[12,8,"#444"],[13,7,"#444"],[13,8,"#444"],
    ];
    case "tuxedo": return [
      [10,4,"#111"],[10,5,"#111"],[10,6,"#FFF"],[10,7,"#FFF"],[10,8,"#FFF"],[10,9,"#FFF"],[10,10,"#111"],[10,11,"#111"],
      [11,3,"#111"],[11,4,"#111"],[11,5,"#FFF"],[11,6,"#FFF"],[11,7,"#FFF"],[11,8,"#FFF"],[11,9,"#FFF"],[11,10,"#111"],[11,11,"#111"],[11,12,"#111"],
      [12,3,"#111"],[12,4,"#111"],[12,5,"#111"],[12,11,"#111"],[12,12,"#111"],
      [13,3,"#111"],[13,4,"#111"],[13,11,"#111"],[13,12,"#111"],
      // bow tie
      [10,6,"#CC0000"],[10,7,"#111"],[10,8,"#CC0000"],
    ];
    case "hawaiian": return [
      [10,4,"#FF6020"],[10,5,"#FF6020"],[10,6,"#FF6020"],[10,7,"#FF6020"],[10,8,"#FF6020"],[10,9,"#FF6020"],[10,10,"#FF6020"],[10,11,"#FF6020"],
      [11,3,"#FF6020"],[11,4,"#FF6020"],[11,5,"#FF6020"],[11,6,"#FF6020"],[11,7,"#FF6020"],[11,8,"#FF6020"],[11,9,"#FF6020"],[11,10,"#FF6020"],[11,11,"#FF6020"],[11,12,"#FF6020"],
      // flower pattern
      [10,5,"#FFD700"],[10,9,"#FF2080"],
      [11,6,"#FF2080"],[11,10,"#FFD700"],
      [12,4,"#FFD700"],[12,7,"#FF2080"],
    ];
    default: return [];
  }
}

/* ─────────── Shoes layers ─────────── */
function getShoesPixels(shoes: PenguinAccessories["shoes"]): AP[] {
  switch (shoes) {
    case "sneakers": return [
      [18,5,"#CC0000"],[18,6,"#F0F0F0"],[18,7,"#F0F0F0"],
      [19,5,"#D0D0D0"],[19,6,"#D0D0D0"],[19,7,"#D0D0D0"],
      [18,9,"#CC0000"],[18,10,"#F0F0F0"],[18,11,"#F0F0F0"],
      [19,9,"#D0D0D0"],[19,10,"#D0D0D0"],[19,11,"#D0D0D0"],
    ];
    case "golden_shoes": return [
      [18,5,"#FFD700"],[18,6,"#FFD700"],[18,7,"#FFD700"],
      [19,5,"#CC9900"],[19,6,"#CC9900"],[19,7,"#CC9900"],
      [18,9,"#FFD700"],[18,10,"#FFD700"],[18,11,"#FFD700"],
      [19,9,"#CC9900"],[19,10,"#CC9900"],[19,11,"#CC9900"],
    ];
    case "boots": return [
      [17,5,"#5A3010"],[17,6,"#5A3010"],[17,7,"#5A3010"],
      [18,5,"#4A2008"],[18,6,"#4A2008"],[18,7,"#5A3010"],
      [19,4,"#3A1800"],[19,5,"#3A1800"],[19,6,"#3A1800"],[19,7,"#3A1800"],[19,8,"#3A1800"],
      [17,9,"#5A3010"],[17,10,"#5A3010"],[17,11,"#5A3010"],
      [18,9,"#5A3010"],[18,10,"#4A2008"],[18,11,"#4A2008"],
      [19,9,"#3A1800"],[19,10,"#3A1800"],[19,11,"#3A1800"],[19,12,"#3A1800"],
    ];
    default: return [];
  }
}

/* ─────────── Extra layers ─────────── */
function getExtraPixels(extra: PenguinAccessories["extra"]): AP[] {
  switch (extra) {
    case "badge": return [
      [12,3,"#FFD700"],[12,4,"#FFD700"],
      [13,3,"#CC0000"],[13,4,"#FFD700"],
    ];
    case "backpack": return [
      [11,13,"#8B4513"],[11,14,"#6B3410"],
      [12,13,"#A0522D"],[12,14,"#8B4513"],
      [13,13,"#A0522D"],[13,14,"#8B4513"],
      [14,13,"#8B4513"],[14,14,"#6B3410"],
    ];
    case "sword": return [
      [5,13,"#DDD"],[6,13,"#DDD"],[7,13,"#DDD"],[8,13,"#DDD"],[9,13,"#DDD"],
      [10,13,"#DDD"],[11,13,"#DDD"],[12,13,"#CC9900"],
      [11,12,"#DDD"],[11,14,"#DDD"], // crossguard
    ];
    case "magic_wand": return [
      [4,13,"#FFD700"],[4,14,"#FFD700"],
      [5,13,"#FF80FF"],
      [6,13,"#9944CC"],[7,13,"#9944CC"],[8,13,"#9944CC"],
      [9,13,"#9944CC"],[10,13,"#9944CC"],[11,13,"#9944CC"],
      // sparkles
      [4,12,"#FFD700"],[3,13,"#FFD700"],[3,14,"#FFD700"],[4,15,"#FFD700"],
    ];
    default: return [];
  }
}

/* ─────────── Component ─────────── */
interface PixelPenguinProps {
  seed?:        string;
  rarity?:      BearRarity;
  pixelSize?:   number;
  className?:   string;
  accessories?: PenguinAccessories;
  paletteKey?:  string; // override body colour (e.g. "green", "red", "pink")
}

export function PixelPenguin({
  seed        = "usenly",
  rarity,
  pixelSize   = 12,
  className   = "",
  accessories,
  paletteKey,
}: PixelPenguinProps) {
  const traits = useMemo(() => generateBearTraits(seed, rarity), [seed, rarity]);
  const pal    = (paletteKey && PALETTES[paletteKey]) ? PALETTES[paletteKey] : PALETTES[traits.rarity];

  const acc = useMemo(
    () => accessories ?? generatePenguinAccessories(seed, traits.rarity),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [seed, traits.rarity, accessories],
  );

  const W = COLS * pixelSize;
  const H = TOTAL_ROWS * pixelSize;

  /* Base rects shifted down by HAT_ROWS */
  const baseRects = useMemo(() => {
    const out: { x:number; y:number; color:string; id:string }[] = [];
    for (let r = 0; r < ROWS; r++) {
      const row = PENGUIN_GRID[r];
      for (let c = 0; c < COLS; c++) {
        const ch = row[c] as keyof typeof pal | ".";
        if (ch !== "." && pal[ch]) {
          out.push({ x: c*pixelSize, y: (r+HAT_ROWS)*pixelSize, color: pal[ch], id:`b${r}-${c}` });
        }
      }
    }
    return out;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [traits.rarity, pixelSize]);

  /* All accessory pixels */
  const accPixels = useMemo((): AP[] => [
    ...getHatPixels(acc.hat),
    ...getGlassesPixels(acc.glasses),
    ...getOutfitPixels(acc.outfit),
    ...getShoesPixels(acc.shoes),
    ...getExtraPixels(acc.extra),
  ], [acc]);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={W}
      height={H}
      style={{ imageRendering: "pixelated" }}
      shapeRendering="crispEdges"
      className={className}
      aria-label={`Pixel penguin — ${traits.rarity}`}
    >
      {baseRects.map(({ x, y, color, id }) => (
        <rect key={id} x={x} y={y} width={pixelSize} height={pixelSize} fill={color} />
      ))}
      {accPixels.map(([r, c, color], i) => (
        <rect
          key={`a${i}`}
          x={c * pixelSize}
          y={(r + HAT_ROWS) * pixelSize}
          width={pixelSize}
          height={pixelSize}
          fill={color}
        />
      ))}
    </svg>
  );
}
