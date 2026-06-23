"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Bear } from "./Bear";

export function BearScene() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const layerY = useTransform(scrollYProgress, [0, 1], [0, -80]);

  return (
    <div ref={ref} className="relative flex h-full min-h-[420px] w-full items-center justify-center lg:min-h-[520px]">
      {/* Depth layers */}
      <motion.div
        style={{ y: layerY }}
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute top-[12%] left-[8%] h-32 w-32 rounded-full bg-neutral-100/80 blur-3xl" />
        <div className="absolute right-[10%] bottom-[20%] h-40 w-40 rounded-full bg-neutral-200/60 blur-3xl" />
        <div className="absolute top-[40%] right-[25%] h-24 w-24 rounded-full bg-white blur-2xl" />
      </motion.div>

      {/* Floating particles */}
      {[...Array(12)].map((_, i) => (
        <motion.span
          key={i}
          className="pointer-events-none absolute h-1 w-1 rounded-full bg-neutral-300/60"
          style={{
            left: `${15 + (i * 7) % 70}%`,
            top: `${10 + (i * 11) % 75}%`,
          }}
          animate={{
            y: [0, -20 - (i % 3) * 8, 0],
            opacity: [0.2, 0.7, 0.2],
            scale: [1, 1.4, 1],
          }}
          transition={{
            duration: 4 + (i % 4),
            repeat: Infinity,
            delay: i * 0.35,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Platform shadow */}
      <div className="absolute bottom-[8%] left-1/2 h-8 w-[55%] -translate-x-1/2 rounded-[100%] bg-neutral-900/[0.06] blur-xl" />
      <motion.div
        animate={{ scaleX: [1, 1.08, 1], opacity: [0.5, 0.35, 0.5] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[6%] left-1/2 h-4 w-[48%] -translate-x-1/2 rounded-[100%] bg-neutral-900/10 blur-md"
      />

      {/* Main bear */}
      <motion.div style={{ y }} className="relative z-10">
        <motion.div
          animate={{ rotateY: [-4, 4, -4], rotateX: [2, -2, 2] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformStyle: "preserve-3d", perspective: 1200 }}
        >
          <Bear seed="hero-bear" rarity="mythic" size={400} floating glow showCard={false} />
        </motion.div>
      </motion.div>

      {/* Reflection glow */}
      <div className="pointer-events-none absolute bottom-[18%] left-1/2 h-24 w-48 -translate-x-1/2 rounded-full bg-amber-200/20 blur-2xl" />
    </div>
  );
}
