"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const STEPS = [
  {
    num:  "01",
    title: "CREATE AN ACCOUNT",
    text:  "Sign up in seconds. No crypto wallet or technical setup — just your email address.",
    icon:  "◎",
  },
  {
    num:  "02",
    title: "CONNECT YOUR HANDLE",
    text:  "Link any supported platform and verify ownership of your username or digital identity.",
    icon:  "⟡",
  },
  {
    num:  "03",
    title: "RECEIVE YOUR COLLECTIBLE",
    text:  "A one-of-a-kind bear is generated from your identity hash. Rarity is randomized and verifiable.",
    icon:  "✦",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how"
      className="relative border-t-2 border-dashed border-[#0A0A0A]/15 bg-[#F7F7F5] px-4 py-16 sm:px-6 sm:py-24 lg:py-32"
    >
      <div className="mx-auto max-w-5xl">

        {/* Section label */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="flex items-center gap-3"
        >
          <span className="font-pixel text-[14px] text-[#CC0000]">&gt;</span>
          <span className="font-pixel text-[12px] tracking-widest text-[#0A0A0A]/38">HOW IT WORKS</span>
          <div className="flex-1 border-t border-dashed border-[#0A0A0A]/15" />
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="mt-5 font-pixel text-[1.8rem] leading-[1.15] tracking-wide text-[#0A0A0A] sm:text-[2.4rem] lg:text-[3rem]"
        >
          THREE STEPS TO<br />OWN YOUR IDENTITY
        </motion.h2>

        {/* Cards */}
        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ x: -3, y: -3 }}
              className="group relative border-2 border-[#0A0A0A] bg-white p-7 shadow-[4px_4px_0_#0A0A0A] transition-[box-shadow,transform] hover:shadow-[6px_6px_0_#CC0000]"
            >
              {/* Step badge */}
              <div className="mb-6 inline-flex h-10 w-10 items-center justify-center border-2 border-[#0A0A0A] bg-[#0A0A0A]">
                <span className="font-pixel text-[14px] tracking-widest text-[#CC0000]">
                  {step.num}
                </span>
              </div>

              <h3 className="font-pixel text-[17px] leading-snug tracking-wide text-[#0A0A0A]">
                {step.title}
              </h3>

              <p className="mt-3 font-sans text-[13.5px] leading-relaxed text-[#0A0A0A]/50">
                {step.text}
              </p>

              {/* Decorative corner icon */}
              <span className="pointer-events-none absolute right-6 bottom-5 font-pixel text-[22px] text-[#0A0A0A]/10 transition-all group-hover:text-[#CC0000]/20">
                {step.icon}
              </span>

              {/* Left accent */}
              <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#CC0000] opacity-0 transition-opacity group-hover:opacity-100" />
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35, duration: 0.45 }}
          className="mt-10"
        >
          <Link
            href="/start"
            className="inline-flex border-2 border-[#0A0A0A] bg-white px-5 py-3 font-pixel text-[14px] tracking-widest text-[#0A0A0A] shadow-[4px_4px_0_#0A0A0A] transition-all hover:shadow-none hover:translate-x-1 hover:translate-y-1 sm:px-7 sm:text-[17px]"
          >
            &gt; [ GET STARTED ]
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
