export type BearRarity = "common" | "rare" | "epic" | "legendary" | "mythic";
export type BearBackgroundPattern = "bears" | "cars" | "dots";

export interface BearPalette {
  fur: string;
  furShadow: string;
  furHighlight: string;
  muzzle: string;
  innerEar: string;
  eye: string;
  nose: string;
  sweater: string;
  sweaterKnit: string;
  collar: string;
  collarStripe: string;
  accent: string;
  badgePrimary: string;
  badgeSecondary: string;
  chain: string;
  material: "plush" | "metallic";
  metallicTone?: "gold" | "silver";
}

export interface BearTraits {
  seed: string;
  rarity: BearRarity;
  palette: BearPalette;
  backgroundPattern: BearBackgroundPattern;
  backgroundColor: string;
  backgroundAccent: string;
  earTilt: number;
  eyeSize: number;
  hasBadge: boolean;
  hasChain: boolean;
  knitVariant: number;
}

/* ─── Penguin accessories ─── */
export type HatType =
  | "none" | "tophat" | "crown" | "cap_red" | "cap_blue"
  | "beanie_red" | "beanie_blue" | "frog_hat"
  | "party_hat" | "wizard_hat" | "santa_hat" | "cowboy_hat"
  | "viking_helmet" | "flower_crown" | "halo";

export type GlassesType =
  | "none" | "sunglasses" | "round_glasses"
  | "star_glasses" | "heart_glasses" | "glasses_3d";

export type OutfitType =
  | "none" | "tie_red" | "tie_blue" | "scarf" | "bow_tie"
  | "hoodie" | "tuxedo" | "hawaiian";

export type ShoesType   = "none" | "sneakers" | "golden_shoes" | "boots";
export type ExtraType   = "none" | "badge" | "backpack" | "sword" | "magic_wand";

export interface PenguinAccessories {
  hat:     HatType;
  glasses: GlassesType;
  outfit:  OutfitType;
  shoes:   ShoesType;
  extra:   ExtraType;
}

export const RARITY_LABELS: Record<BearRarity, string> = {
  common: "Common",
  rare: "Rare",
  epic: "Epic",
  legendary: "Legendary",
  mythic: "Mythic",
};
