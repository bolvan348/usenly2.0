"use client";

import { useEffect, useState } from "react";

export function SiteIntro() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    document.body.classList.add("intro-active");
    document.documentElement.classList.add("intro-active");

    const fadeTimer = window.setTimeout(() => setFading(true), 1400);
    const removeTimer = window.setTimeout(() => {
      setVisible(false);
      document.body.classList.remove("intro-active");
      document.documentElement.classList.remove("intro-active");
    }, 2000);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(removeTimer);
      document.body.classList.remove("intro-active");
      document.documentElement.classList.remove("intro-active");
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`intro-screen fixed inset-0 z-[99999] flex items-center justify-center bg-black transition-opacity duration-[550ms] ease-out ${
        fading ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      aria-hidden={fading}
    >
      <p className="logo-gothic-intro text-[2.4rem] sm:text-[3rem] md:text-[3.5rem]">
        Usenly
      </p>
    </div>
  );
}
