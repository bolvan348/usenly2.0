import type {
  BearBackgroundPattern,
  BearPalette,
  BearRarity,
  BearTraits,
  PenguinAccessories,
  HatType,
  GlassesType,
  OutfitType,
  ShoesType,
  ExtraType,
} from "./bear-types";

function hashString(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hsl(h: number, s: number, l: number) {
  return `hsl(${h} ${s}% ${l}%)`;
}

function pickRarity(rand: () => number): BearRarity {
  const r = rand();
  if (r < 0.45) return "common";
  if (r < 0.72) return "rare";
  if (r < 0.88) return "epic";
  if (r < 0.96) return "legendary";
  return "mythic";
}

function pickPattern(rand: () => number): BearBackgroundPattern {
  const r = rand();
  if (r < 0.38) return "bears";
  if (r < 0.72) return "cars";
  return "dots";
}

/**
 * Each rarity gets a palette whose fur hue drives everything.
 * We store the raw hue so the caller can derive a tonal background.
 */
function paletteForRarity(
  rarity: BearRarity,
  rand: () => number
): { palette: BearPalette; furHue: number } {
  switch (rarity) {
    case "common": {
      const h = Math.floor(rand() * 40) + 18; // warm brown range
      return {
        furHue: h,
        palette: {
          fur:          hsl(h, 44, 56),
          furShadow:    hsl(h, 40, 40),
          furHighlight: hsl(h, 36, 72),
          muzzle:       hsl(h, 24, 83),
          innerEar:     hsl(h, 30, 74),
          eye:          "#080808",
          nose:         "#111",
          sweater:      hsl(Math.floor(rand() * 360), 12, 80),
          sweaterKnit:  hsl(Math.floor(rand() * 360), 10, 68),
          collar:       "#f8f8f8",
          collarStripe: hsl(Math.floor(rand() * 360), 50, 34),
          accent:       hsl(h, 38, 60),
          badgePrimary: hsl(Math.floor(rand() * 360), 55, 44),
          badgeSecondary: hsl(Math.floor(rand() * 360), 52, 44),
          chain:        "#c9a227",
          material:     "plush",
        },
      };
    }
    case "rare": {
      const h = Math.floor(rand() * 30) + 22;
      const sh = Math.floor(rand() * 360);
      return {
        furHue: h,
        palette: {
          fur:          hsl(h, 50, 52),
          furShadow:    hsl(h, 46, 38),
          furHighlight: hsl(h, 42, 70),
          muzzle:       hsl(h, 28, 85),
          innerEar:     hsl(h + 8, 34, 78),
          eye:          "#090909",
          nose:         "#111",
          sweater:      hsl(sh, 22, 82),
          sweaterKnit:  hsl(sh, 18, 72),
          collar:       "#fff",
          collarStripe: hsl(sh + 30, 35, 30),
          accent:       hsl(h, 44, 56),
          badgePrimary: hsl(sh, 52, 42),
          badgeSecondary: hsl(sh + 120, 46, 42),
          chain:        "#b8922a",
          material:     "plush",
        },
      };
    }
    case "epic": {
      const h = Math.floor(rand() * 25) + 20;
      const hue = Math.floor(rand() * 360);
      return {
        furHue: h,
        palette: {
          fur:          hsl(h, 42, 49),
          furShadow:    hsl(h, 38, 36),
          furHighlight: hsl(h, 34, 68),
          muzzle:       hsl(h, 22, 83),
          innerEar:     hsl(h, 26, 76),
          eye:          "#070707",
          nose:         "#0e0e0e",
          sweater:      hsl(hue, 28, 77),
          sweaterKnit:  hsl(hue, 22, 66),
          collar:       "#fff",
          collarStripe: "#1a1a1a",
          accent:       hsl(h, 38, 52),
          badgePrimary: hsl(hue, 55, 44),
          badgeSecondary: hsl(hue + 90, 50, 42),
          chain:        "#d4af37",
          material:     "plush",
        },
      };
    }
    case "legendary": {
      const warm = rand() > 0.5;
      const h    = warm ? 30 : 212;
      return {
        furHue: h,
        palette: {
          fur:          hsl(h, 24, 43),
          furShadow:    hsl(h, 22, 31),
          furHighlight: hsl(h, 18, 62),
          muzzle:       hsl(h, 10, 81),
          innerEar:     hsl(h, 16, 72),
          eye:          "#040404",
          nose:         "#0a0a0a",
          sweater:      hsl(h, 12, 88),
          sweaterKnit:  hsl(h, 10, 78),
          collar:       "#fff",
          collarStripe: "#111",
          accent:       hsl(h, 44, 48),
          badgePrimary: "#1b5e3a",
          badgeSecondary: "#8b1a1a",
          chain:        "#d4af37",
          material:     "plush",
        },
      };
    }
    case "mythic": {
      const gold = rand() > 0.35;
      if (gold) {
        return {
          furHue: 42,
          palette: {
            fur:          "#c9952a",
            furShadow:    "#8b6914",
            furHighlight: "#f5d878",
            muzzle:       "#fff4dc",
            innerEar:     "#f0d090",
            eye:          "#1a1208",
            nose:         "#221808",
            sweater:      "#f5f0e6",
            sweaterKnit:  "#e8dfd0",
            collar:       "#fff",
            collarStripe: "#1a1a1a",
            accent:       "#d4a017",
            badgePrimary: "#1b5e3a",
            badgeSecondary: "#8b1a1a",
            chain:        "#ffd700",
            material:     "metallic",
            metallicTone: "gold",
          },
        };
      }
      return {
        furHue: 215,
        palette: {
          fur:          "#9aa3b0",
          furShadow:    "#5c6675",
          furHighlight: "#e8ecf2",
          muzzle:       "#f7f9fc",
          innerEar:     "#d8dee8",
          eye:          "#0a0c10",
          nose:         "#12151a",
          sweater:      "#eef1f5",
          sweaterKnit:  "#d4dae3",
          collar:       "#fff",
          collarStripe: "#222",
          accent:       "#8fa0b0",
          badgePrimary: "#2a3a5c",
          badgeSecondary: "#5c2a2a",
          chain:        "#c0c8d4",
          material:     "metallic",
          metallicTone: "silver",
        },
      };
    }
  }
}

export function generateBearTraits(
  seed: string,
  forceRarity?: BearRarity
): BearTraits {
  const normalized = seed.trim().toLowerCase() || "usenly";
  const rng        = mulberry32(hashString(normalized));
  const rarity     = forceRarity ?? pickRarity(rng);
  const { palette, furHue } = paletteForRarity(rarity, rng);

  // ── Background tonal with fur hue ──
  // Each bear's background is a very desaturated, light version of its fur color
  let bgHue   = furHue;
  let bgSat   = 16;
  let bgLight = 94;
  let bgAccent = palette.accent;

  if (rarity === "mythic" && palette.metallicTone === "gold") {
    bgHue = 42;   bgSat = 38; bgLight = 94; bgAccent = "#c9952a";
  } else if (rarity === "mythic" && palette.metallicTone === "silver") {
    bgHue = 215;  bgSat = 14; bgLight = 93; bgAccent = "#9aa3b0";
  } else if (rarity === "legendary") {
    bgSat = 18; bgLight = 93; bgAccent = hsl(bgHue, 40, 52);
  } else if (rarity === "epic") {
    bgSat = 18; bgLight = 93; bgAccent = hsl(bgHue, 40, 54);
  } else if (rarity === "rare") {
    bgSat = 18; bgLight = 94; bgAccent = hsl(bgHue, 42, 56);
  } else {
    bgSat = 16; bgLight = 95; bgAccent = hsl(bgHue, 38, 58);
  }

  return {
    seed: normalized,
    rarity,
    palette,
    backgroundPattern: pickPattern(rng),
    backgroundColor:   hsl(bgHue, bgSat, bgLight),
    backgroundAccent:  bgAccent,
    earTilt:    (rng() - 0.5) * 6,
    eyeSize:    0.92 + rng() * 0.16,
    hasBadge:   rarity === "epic" || rarity === "legendary" || rarity === "mythic",
    hasChain:   rarity === "legendary" || rarity === "mythic",
    knitVariant: Math.floor(rng() * 3),
  };
}

/* ─────────────────────────────────────────────
   Penguin Accessories Generator
   Deterministic: same seed+rarity → same accessories
───────────────────────────────────────────── */
export function generatePenguinAccessories(
  seed:   string,
  rarity: BearRarity,
): PenguinAccessories {
  // Separate hash from main bear traits hash
  let h = 97;
  for (let i = 0; i < seed.length; i++) h = ((h * 53) ^ seed.charCodeAt(i)) >>> 0;
  const rng = mulberry32(h ^ 0xdeadc0de);
  function pick<T>(arr: T[]): T { return arr[Math.floor(rng() * arr.length)]; }

  const HATS: Record<BearRarity, HatType[]> = {
    common:    ["none","cap_red","beanie_red","frog_hat","party_hat","cowboy_hat"],
    rare:      ["none","cap_blue","beanie_blue","frog_hat","party_hat","cowboy_hat","flower_crown"],
    epic:      ["cap_red","cap_blue","tophat","frog_hat","wizard_hat","viking_helmet","flower_crown","party_hat"],
    legendary: ["tophat","crown","frog_hat","wizard_hat","viking_helmet","santa_hat","flower_crown","halo"],
    mythic:    ["crown","crown","tophat","frog_hat","wizard_hat","halo","santa_hat"],
  };
  const GLASSES: Record<BearRarity, GlassesType[]> = {
    common:    ["none","none","sunglasses","star_glasses"],
    rare:      ["none","sunglasses","round_glasses","heart_glasses","star_glasses"],
    epic:      ["none","sunglasses","round_glasses","heart_glasses","star_glasses","glasses_3d"],
    legendary: ["sunglasses","round_glasses","heart_glasses","star_glasses","glasses_3d"],
    mythic:    ["sunglasses","round_glasses","star_glasses","glasses_3d","heart_glasses"],
  };
  const OUTFITS: Record<BearRarity, OutfitType[]> = {
    common:    ["none","none","tie_red","hoodie"],
    rare:      ["none","tie_red","tie_blue","bow_tie","hoodie","hawaiian"],
    epic:      ["none","tie_red","scarf","bow_tie","hoodie","tuxedo","hawaiian"],
    legendary: ["scarf","bow_tie","tuxedo","hoodie","hawaiian","tie_blue"],
    mythic:    ["tuxedo","bow_tie","scarf","hawaiian","tie_red"],
  };
  const SHOES: Record<BearRarity, ShoesType[]> = {
    common:    ["none","none","sneakers","boots"],
    rare:      ["none","sneakers","sneakers","boots"],
    epic:      ["none","sneakers","golden_shoes","boots"],
    legendary: ["sneakers","golden_shoes","golden_shoes","boots"],
    mythic:    ["golden_shoes","golden_shoes","boots","sneakers"],
  };
  const EXTRAS: Record<BearRarity, ExtraType[]> = {
    common:    ["none","none","none","backpack"],
    rare:      ["none","none","backpack","sword"],
    epic:      ["none","badge","backpack","sword","magic_wand"],
    legendary: ["none","badge","backpack","sword","magic_wand"],
    mythic:    ["badge","magic_wand","sword","backpack"],
  };

  return {
    hat:     pick(HATS[rarity]),
    glasses: pick(GLASSES[rarity]),
    outfit:  pick(OUTFITS[rarity]),
    shoes:   pick(SHOES[rarity]),
    extra:   pick(EXTRAS[rarity]),
  };
}

export const SHOWCASE_BEARS: { seed: string; rarity: BearRarity }[] = [
  { seed: "aurora",  rarity: "mythic" },
  { seed: "velvet",  rarity: "legendary" },
  { seed: "coral",   rarity: "epic" },
  { seed: "mint",    rarity: "rare" },
  { seed: "spark",   rarity: "common" },
];
