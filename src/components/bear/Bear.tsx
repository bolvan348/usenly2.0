"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useMemo } from "react";
import { generateBearTraits } from "@/lib/bear-generator";
import type { BearRarity } from "@/lib/bear-types";
import { RARITY_LABELS } from "@/lib/bear-types";
import { cn } from "@/lib/utils";
import { BearPatternDefs, getPatternUrl } from "./BearPattern";
import { PlushBearDefs, PlushBearSvg } from "./PlushBearSvg";

interface BearProps {
  seed?: string;
  rarity?: BearRarity;
  size?: number;
  className?: string;
  showLabel?: boolean;
  interactive?: boolean;
  floating?: boolean;
  glow?: boolean;
  showCard?: boolean;
}

export function Bear({
  seed = "usenly",
  rarity,
  size = 280,
  className,
  showLabel = false,
  interactive = false,
  floating = false,
  glow = true,
  showCard = true,
}: BearProps) {
  const traits = useMemo(
    () => generateBearTraits(seed, rarity),
    [seed, rarity]
  );
  const { palette, backgroundPattern, backgroundColor, backgroundAccent } =
    traits;

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [5, -5]), {
    stiffness: 100,
    damping: 22,
  });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-7, 7]), {
    stiffness: 100,
    damping: 22,
  });

  const uid = useMemo(
    () => `b-${seed.replace(/[^a-z0-9]/gi, "").slice(0, 10)}-${size}`,
    [seed, size]
  );

  const patternFill = getPatternUrl(uid, backgroundPattern);
  const cardScale = showCard ? 0.88 : 1;

  return (
    <motion.div
      className={cn("relative select-none", className)}
      style={{ width: size, height: size * 1.12 }}
      animate={
        floating ? { y: [0, -10, 0], rotate: [-0.8, 0.8, -0.8] } : undefined
      }
      transition={
        floating
          ? { duration: 6, repeat: Infinity, ease: "easeInOut" }
          : undefined
      }
      onMouseMove={
        interactive
          ? (e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              mx.set((e.clientX - rect.left) / rect.width - 0.5);
              my.set((e.clientY - rect.top) / rect.height - 0.5);
            }
          : undefined
      }
      onMouseLeave={
        interactive
          ? () => {
              mx.set(0);
              my.set(0);
            }
          : undefined
      }
    >
      {glow && (
        <div
          className="pointer-events-none absolute inset-[6%] rounded-full opacity-50 blur-3xl"
          style={{
            background: `radial-gradient(circle, ${backgroundAccent}66 0%, transparent 70%)`,
          }}
        />
      )}

      <motion.div
        className="relative h-full w-full"
        style={{
          perspective: 900,
          rotateX: interactive ? rotateX : 0,
          rotateY: interactive ? rotateY : 0,
        }}
      >
        <svg
          viewBox="0 0 280 320"
          width={size}
          height={size * 1.12}
          className="overflow-visible"
          aria-hidden
        >
          <defs>
            <BearPatternDefs
              id={uid}
              pattern={backgroundPattern}
              color={backgroundAccent}
            />
            <PlushBearDefs uid={uid} seed={traits.seed} palette={palette} />
          </defs>

          {showCard && (
            <g transform="translate(30 20) scale(0.82)">
              {/* Card with tonal gradient background */}
              <defs>
                <radialGradient id={`${uid}-card-bg`} cx="38%" cy="30%" r="72%">
                  <stop offset="0%"   stopColor={backgroundAccent} stopOpacity="0.35" />
                  <stop offset="100%" stopColor={backgroundColor}  stopOpacity="1" />
                </radialGradient>
              </defs>
              <rect
                x="0" y="0" width="220" height="220" rx="32"
                fill={backgroundColor}
                filter={`url(#${uid}-shadow)`}
              />
              <rect x="0" y="0" width="220" height="220" rx="32" fill={`url(#${uid}-card-bg)`} />
              <rect x="0" y="0" width="220" height="220" rx="32" fill={patternFill} opacity={0.6} />
              {/* Card gloss top */}
              <rect x="0" y="0" width="220" height="220" rx="32" fill="#fff" opacity={0.08} />
              <ellipse cx="110" cy="40" rx="80" ry="28" fill="#fff" opacity={0.06} />
            </g>
          )}

          <g
            transform={`translate(0 ${showCard ? 8 : 0}) scale(${cardScale})`}
            filter={`url(#${uid}-shadow)`}
          >
            <PlushBearSvg traits={traits} uid={uid} />
          </g>
        </svg>
      </motion.div>

      {showLabel && (
        <p className="mt-2 text-center text-[10px] font-semibold tracking-[0.22em] text-neutral-400 uppercase">
          {RARITY_LABELS[traits.rarity]}
        </p>
      )}
    </motion.div>
  );
}
