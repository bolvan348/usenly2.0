"use client";

import { useEffect, useRef } from "react";

const INTRO_FADE_MS = 500;
const INTRO_HOLD_MS = 1200;

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
      if (!el) {
        finish();
        return;
      }
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
        if (e.propertyName === "opacity" && overlayRef.current?.classList.contains("intro-fading")) {
          overlayRef.current?.remove();
          document.documentElement.classList.remove("intro-active");
          document.body.classList.remove("intro-active");
        }
      }}
    >
      <p className="font-pixel text-[2rem] tracking-[0.35em] text-white/75 sm:text-[2.75rem] md:text-[3.25rem]">
        USENLY
      </p>
    </div>
  );
}
