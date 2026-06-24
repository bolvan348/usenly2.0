"use client";

import { useEffect, useRef } from "react";

const INTRO_FADE_MS = 500;
const INTRO_HOLD_MS = 1800;

// Pixel art penguin — 10 × 15 grid
// 0 = transparent, 1 = black, 2 = white, 3 = orange
const GRID = [
  [0, 0, 1, 1, 1, 1, 1, 1, 0, 0], //  0 — head top
  [0, 1, 2, 2, 2, 2, 2, 2, 1, 0], //  1 — face
  [0, 1, 2, 2, 2, 2, 2, 2, 1, 0], //  2
  [0, 1, 2, 1, 2, 2, 1, 2, 1, 0], //  3 — eyes
  [0, 1, 2, 2, 3, 3, 2, 2, 1, 0], //  4 — beak
  [0, 1, 2, 2, 2, 2, 2, 2, 1, 0], //  5 — chest
  [1, 1, 2, 2, 2, 2, 2, 2, 1, 1], //  6 — wings
  [1, 1, 2, 2, 2, 2, 2, 2, 1, 1], //  7
  [1, 1, 2, 2, 2, 2, 2, 2, 1, 1], //  8
  [1, 1, 1, 2, 2, 2, 2, 1, 1, 1], //  9 — belly round
  [0, 1, 1, 2, 2, 2, 2, 1, 1, 0], // 10
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 0], // 11 — bottom
  [0, 0, 1, 1, 0, 0, 1, 1, 0, 0], // 12 — legs
  [0, 3, 3, 0, 0, 0, 0, 3, 3, 0], // 13 — feet
  [0, 3, 3, 3, 0, 0, 3, 3, 3, 0], // 14
];

const FILL: Record<number, string | null> = {
  0: null,
  1: "#111111",
  2: "#ffffff",
  3: "#ffaa00",
};

const PX = 10;
const VW = GRID[0].length * PX; // 100
const VH = GRID.length * PX;    // 150

export function SiteIntro() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef(false);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    html.classList.add("intro-active");
    body.classList.add("intro-active");

    const finish = () => {
      if (doneRef.current) return;
      doneRef.current = true;
      html.classList.remove("intro-active");
      body.classList.remove("intro-active");
      const el = overlayRef.current;
      if (el) el.remove();
    };

    const fadeTimer = window.setTimeout(() => {
      const el = overlayRef.current;
      if (!el) { finish(); return; }
      el.classList.add("intro-fading");
    }, INTRO_HOLD_MS);

    const fallbackTimer = window.setTimeout(finish, INTRO_HOLD_MS + INTRO_FADE_MS + 200);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(fallbackTimer);
      html.classList.remove("intro-active");
      body.classList.remove("intro-active");
    };
  }, []);

  return (
    <div
      ref={overlayRef}
      id="site-intro"
      className="intro-screen fixed inset-0 z-[99999] flex items-center justify-center bg-black"
      onTransitionEnd={(e) => {
        if (
          e.propertyName === "opacity" &&
          overlayRef.current?.classList.contains("intro-fading")
        ) {
          overlayRef.current?.remove();
          document.documentElement.classList.remove("intro-active");
          document.body.classList.remove("intro-active");
        }
      }}
    >
      <style>{`
        @keyframes penguin-bob {
          0%, 100% { transform: translateY(0px) rotate(-3deg); }
          50%       { transform: translateY(-14px) rotate(3deg); }
        }
        .penguin-bob {
          animation: penguin-bob 0.75s ease-in-out infinite;
        }
      `}</style>

      <div className="penguin-bob" style={{ lineHeight: 0 }}>
        <svg
          width={210}
          height={315}
          viewBox={`0 0 ${VW} ${VH}`}
          xmlns="http://www.w3.org/2000/svg"
          style={{ imageRendering: "pixelated", display: "block" }}
        >
          {GRID.flatMap((row, ri) =>
            row.map((cell, ci) => {
              const fill = FILL[cell];
              if (!fill) return null;
              return (
                <rect
                  key={`${ri}-${ci}`}
                  x={ci * PX}
                  y={ri * PX}
                  width={PX}
                  height={PX}
                  fill={fill}
                />
              );
            })
          )}
        </svg>
      </div>
    </div>
  );
}
