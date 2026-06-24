"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTonConnectUI, useTonAddress } from "@tonconnect/ui-react";
import { PixelPenguin, ALL_PALETTE_KEYS } from "@/components/bear/PixelPenguin";
import type { BearRarity } from "@/lib/bear-types";
import { RARITY_LABELS } from "@/lib/bear-types";
import { useUser } from "@/lib/user-context";

const TON_RECEIVER = process.env.NEXT_PUBLIC_TON_RECEIVER ?? "";

/* ─── Deterministic verify code from email ─── */
function generateVerifyCode(email: string): string {
  let h = 5381;
  for (let i = 0; i < email.length; i++) h = ((h * 33) ^ email.charCodeAt(i)) >>> 0;
  const C = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "", n = h;
  for (let i = 0; i < 6; i++) { code += C[n % C.length]; n = Math.floor(n / C.length); }
  return `USENLY-${code}`;
}

/* ─── Rarity from email hash + payment amount ─── */
function rarityFromEmailAndPayment(email: string, payment: number): BearRarity {
  let h = 0;
  for (let i = 0; i < email.length; i++) h = (h * 31 + email.charCodeAt(i)) >>> 0;
  const r = (h % 10000) / 10000;
  const t = (payment - 2) / 3;
  const wC = 0.45 - t * 0.35, wR = 0.27 - t * 0.07, wE = 0.16 + t * 0.09, wL = 0.09 + t * 0.16;
  let cum = wC; if (r < cum) return "common";
  cum += wR;    if (r < cum) return "rare";
  cum += wE;    if (r < cum) return "epic";
  cum += wL;    if (r < cum) return "legendary";
  return "mythic";
}

/* ─── Shared styles ─── */
const INPUT =
  "w-full border-2 border-[#0A0A0A] bg-white px-4 py-3 font-pixel text-[14px] tracking-wide " +
  "text-[#0A0A0A] placeholder:text-[#0A0A0A]/25 focus:border-[#CC0000] focus:outline-none transition-colors";
const BTN_PRIMARY =
  "w-full border-2 border-[#0A0A0A] bg-[#0A0A0A] py-3 font-pixel text-[14px] tracking-widest text-white " +
  "shadow-[4px_4px_0_#CC0000] transition-all hover:shadow-none hover:translate-x-1 hover:translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed";

function SLabel({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 border-b-2 border-[#0A0A0A]/15 pb-3">
      <span className="font-pixel text-[16px] text-[#CC0000]">&gt;</span>
      <span className="font-pixel text-[12px] tracking-widest text-[#0A0A0A]/50">{label}</span>
    </div>
  );
}

/* ─── Eye icon ─── */
function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

function PasswordField({ label, value, onChange, placeholder, disabled }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; disabled?: boolean;
}) {
  const [show, setShow] = useState(false);
  return (
    <div>
      {label && <p className="mb-1.5 font-pixel text-[11px] tracking-widest text-[#0A0A0A]/45">&gt; {label}:</p>}
      <div className="relative">
        <input type={show ? "text" : "password"} value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder ?? "min 8 characters"} required disabled={disabled}
          className={`${INPUT} pr-12 disabled:opacity-50`} />
        <button type="button" tabIndex={-1} onClick={() => setShow(v => !v)}
          className="absolute right-0 top-0 bottom-0 flex items-center justify-center px-3.5 text-[#0A0A0A]/35 hover:text-[#0A0A0A] transition-colors">
          <EyeIcon open={show} />
        </button>
      </div>
    </div>
  );
}

/* ─── Step bar ─── */
function StepBar({ step }: { step: number }) {
  const steps = [
    { full: "REGISTER", short: "REG"   },
    { full: "EMAIL",    short: "EMAIL" },
    { full: "TELEGRAM", short: "TG"    },
    { full: "PAYMENT",  short: "PAY"   },
    { full: "CLAIM",    short: "CLAIM" },
    { full: "DONE",     short: "DONE"  },
  ];
  return (
    <div className="mb-8 flex items-center overflow-x-auto pb-1">
      {steps.map((s, i) => {
        const active = i === step, done = i < step;
        return (
          <div key={s.full} className="flex items-center shrink-0">
            <div className={`flex h-7 items-center px-2 border-2 font-pixel text-[9px] tracking-wider transition-colors ${
              active ? "border-[#CC0000] bg-[#CC0000] text-white"
              : done  ? "border-[#0A0A0A] bg-[#0A0A0A] text-white/50"
              :         "border-[#0A0A0A]/20 bg-white text-[#0A0A0A]/25"
            }`}>
              {done ? "✓ " : `${i + 1} `}
              <span className="hidden sm:inline">{s.full}</span>
              <span className="sm:hidden">{s.short}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`h-[2px] w-3 shrink-0 sm:w-4 ${done ? "bg-[#0A0A0A]" : "bg-[#0A0A0A]/15"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ══════════════════════════════════════
   STEP 0 — Register / Sign In
══════════════════════════════════════ */
type RegisterOpts =
  | { mode: "register"; pendingToken: string }
  | { mode: "login"; handle?: string | null };

function StepRegister({ onNext }: { onNext: (email: string, opts: RegisterOpts) => void }) {
  const [mode,     setMode]     = useState<"register" | "login">("register");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email.includes("@"))                               { setError("ERR: INVALID EMAIL FORMAT"); return; }
    if (password.length < 8)                                { setError("ERR: PASSWORD MIN 8 CHARS"); return; }
    if (mode === "register" && password !== confirm)        { setError("ERR: PASSWORDS DO NOT MATCH"); return; }
    setLoading(true);
    try {
      if (mode === "register") {
        const res = await fetch("/api/auth/send-code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
        });
        const data = await res.json();
        if (!res.ok) { setError(`ERR: ${(data.error as string).toUpperCase()}`); return; }
        onNext(email.trim().toLowerCase(), { mode: "register", pendingToken: data.pendingToken as string });
      } else {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
        });
        const data = await res.json();
        if (!res.ok) { setError(`ERR: ${(data.error as string).toUpperCase()}`); return; }
        onNext(data.email ?? email.trim().toLowerCase(), { mode: "login", handle: data.handle });
      }
    } catch {
      setError("ERR: NETWORK ERROR — TRY AGAIN");
    } finally {
      setLoading(false);
    }
  }

  const isLogin = mode === "login";
  const passwordsMatch = !confirm || password === confirm;

  return (
    <form onSubmit={submit} className="space-y-5">
      <SLabel label={isLogin ? "SIGN IN" : "CREATE ACCOUNT"} />
      <div className="space-y-4 pt-2">
        <div>
          <p className="mb-1.5 font-pixel text-[11px] tracking-widest text-[#0A0A0A]/45">&gt; EMAIL:</p>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="you@email.com" required className={INPUT} />
        </div>
        <PasswordField label="PASSWORD" value={password} onChange={setPassword} disabled={loading} />
        {!isLogin && (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <p className="font-pixel text-[11px] tracking-widest text-[#0A0A0A]/45">&gt; CONFIRM PASSWORD:</p>
              {confirm.length > 0 && (
                <span className={`font-pixel text-[10px] ${passwordsMatch ? "text-[#28C840]" : "text-[#CC0000]"}`}>
                  {passwordsMatch ? "✓ MATCH" : "✗ MISMATCH"}
                </span>
              )}
            </div>
            <PasswordField label="" value={confirm} onChange={setConfirm}
              placeholder="repeat password" disabled={loading} />
          </div>
        )}
      </div>
      {error && <p className="font-pixel text-[12px] text-[#CC0000] break-words">{error}</p>}
      <button type="submit"
        disabled={loading || (!isLogin && confirm.length > 0 && !passwordsMatch)}
        className={BTN_PRIMARY}>
        {loading ? "[ LOADING... ]" : isLogin ? "[ SIGN IN ]" : "[ CONTINUE ]"}
      </button>
      <p className="text-center font-pixel text-[11px] tracking-widest text-[#0A0A0A]/30">
        {isLogin ? "No account? " : "Already registered? "}
        <button type="button"
          onClick={() => { setMode(isLogin ? "register" : "login"); setError(""); setConfirm(""); }}
          className="text-[#CC0000] hover:underline">
          {isLogin ? "[ REGISTER ]" : "[ SIGN IN ]"}
        </button>
      </p>
    </form>
  );
}

/* ══════════════════════════════════════
   STEP 1 — Email verification
   Uses JWT pendingToken — no KV needed.
══════════════════════════════════════ */
type CodeState = "idle" | "correct" | "wrong";

function StepEmailVerify({
  email,
  pendingToken,
  onVerified,
  onTokenRefresh,
}: {
  email: string;
  pendingToken: string;
  onVerified: () => void;
  onTokenRefresh: (newToken: string) => void;
}) {
  const [code,     setCode]     = useState("");
  const [state,    setState]    = useState<CodeState>("idle");
  const [loading,  setLoading]  = useState(false);
  const [cooldown, setCooldown] = useState(60);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startCooldown = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCooldown(v => {
        if (v <= 1) { clearInterval(timerRef.current!); return 0; }
        return v - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => {
    startCooldown();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [startCooldown]);

  async function resend() {
    if (cooldown > 0) return;
    try {
      const res = await fetch("/api/auth/resend-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, pendingToken }),
      });
      const data = await res.json();
      if (res.ok && data.pendingToken) {
        onTokenRefresh(data.pendingToken as string);
      }
    } catch { /* silent */ }
    setCooldown(60);
    startCooldown();
    setCode("");
    setState("idle");
  }

  async function verify(e: React.FormEvent) {
    e.preventDefault();
    if (code.length !== 6 || loading) return;
    setLoading(true);
    setState("idle");
    try {
      const res = await fetch("/api/auth/verify-and-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: code.trim(), pendingToken }),
      });
      if (res.ok) {
        setState("correct");
        setTimeout(onVerified, 900);
      } else {
        setState("wrong");
      }
    } catch {
      setState("wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={verify} className="space-y-5">
      <SLabel label="VERIFY EMAIL" />
      <div className="space-y-5 pt-2">
        <div className="border-2 border-dashed border-[#0A0A0A]/20 bg-[#F7F7F5] px-4 py-3">
          <p className="font-pixel text-[10px] tracking-widest text-[#0A0A0A]/40">CODE SENT TO:</p>
          <p className="mt-1 font-pixel text-[12px] tracking-wide text-[#0A0A0A] truncate">{email}</p>
        </div>
        <div>
          <p className="mb-1.5 font-pixel text-[11px] tracking-widest text-[#0A0A0A]/45">&gt; 6-DIGIT CODE:</p>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            value={code}
            onChange={e => { setCode(e.target.value.replace(/\D/g, "")); setState("idle"); }}
            placeholder="000000"
            required
            disabled={loading || state === "correct"}
            autoFocus
            className={`${INPUT} text-center text-[28px] tracking-[0.45em] disabled:opacity-50 ${
              state === "correct" ? "border-[#28C840]" : state === "wrong" ? "border-[#CC0000]" : ""
            }`}
          />
        </div>
        <AnimatePresence mode="wait">
          {state === "correct" && (
            <motion.div key="ok"
              initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex items-center gap-2.5 border-2 border-[#28C840] bg-[#28C840]/8 px-4 py-3">
              <span className="font-pixel text-[16px] text-[#28C840]">✓</span>
              <span className="font-pixel text-[13px] tracking-widest text-[#28C840]">Code correct</span>
            </motion.div>
          )}
          {state === "wrong" && (
            <motion.div key="err"
              initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex items-center gap-2.5 border-2 border-[#CC0000] bg-[#CC0000]/8 px-4 py-3">
              <span className="font-pixel text-[16px] text-[#CC0000]">✗</span>
              <span className="font-pixel text-[13px] tracking-widest text-[#CC0000]">Invalid code</span>
            </motion.div>
          )}
        </AnimatePresence>
        <button type="submit"
          disabled={loading || code.length !== 6 || state === "correct"}
          className={BTN_PRIMARY}>
          {loading ? "[ VERIFYING... ]" : "[ CONFIRM CODE ]"}
        </button>
        <div className="flex items-center justify-between pt-1">
          <span className="font-pixel text-[10px] tracking-widest text-[#0A0A0A]/30">
            {cooldown > 0 ? `RESEND IN ${cooldown}s` : "DIDN'T RECEIVE IT?"}
          </span>
          <button type="button" disabled={cooldown > 0} onClick={resend}
            className="font-pixel text-[10px] tracking-widest text-[#CC0000] disabled:text-[#0A0A0A]/20 hover:underline transition-colors">
            [ RESEND CODE ]
          </button>
        </div>
      </div>
    </form>
  );
}

/* ══════════════════════════════════════
   STEP 2 — Telegram verify (real polling)
══════════════════════════════════════ */
type TgStatus = "waiting" | "polling" | "done" | "timeout";

function StepTelegram({ email, onNext }: { email: string; onNext: () => void }) {
  const code   = generateVerifyCode(email);
  const botUrl = `https://t.me/usenlybot?start=${code}`;

  const [status,    setStatus]    = useState<TgStatus>("waiting");
  const [copied,    setCopied]    = useState(false);
  const [copyError, setCopyError] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const pollRef      = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timerRef     = useRef<ReturnType<typeof setInterval> | null>(null);
  const attemptsRef  = useRef(0);
  const MAX_ATTEMPTS = 30; // 30 × 2s = 60s

  function stopAll() {
    if (pollRef.current)  clearTimeout(pollRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
  }
  useEffect(() => () => stopAll(), []);

  /* ── Copy with fallback for HTTP / older browsers ── */
  function copyCode() {
    const text = `/${code}`;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); })
        .catch(() => fallbackCopy(text));
    } else {
      fallbackCopy(text);
    }
  }

  function fallbackCopy(text: string) {
    try {
      const el = document.createElement("textarea");
      el.value = text;
      el.style.position = "fixed";
      el.style.opacity  = "0";
      document.body.appendChild(el);
      el.focus(); el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true); setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopyError(true); setTimeout(() => setCopyError(false), 3000);
    }
  }

  /* ── Polling ── */
  const doPoll = useCallback(async () => {
    attemptsRef.current++;
    if (attemptsRef.current > MAX_ATTEMPTS) {
      stopAll();
      setStatus("timeout");
      setCountdown(0);
      return;
    }

    try {
      const res  = await fetch(`/api/auth/telegram-status?email=${encodeURIComponent(email)}`);
      const data = await res.json() as { verified?: boolean };
      if (data.verified) {
        stopAll();
        setStatus("done");
        setCountdown(0);
        setTimeout(onNext, 700);
        return;
      }
    } catch { /* keep polling */ }

    pollRef.current = setTimeout(doPoll, 2000);
  }, [email, onNext]);

  function startPolling() {
    stopAll();
    attemptsRef.current = 0;
    setStatus("polling");
    setCountdown(MAX_ATTEMPTS * 2); // seconds

    // Countdown timer
    timerRef.current = setInterval(() => {
      setCountdown(v => (v <= 1 ? 0 : v - 1));
    }, 1000);

    doPoll();
  }

  function cancelPolling() {
    stopAll();
    setStatus("waiting");
    setCountdown(0);
  }

  const isPolling = status === "polling";

  return (
    <div className="space-y-5">
      <SLabel label="CONNECT TELEGRAM" />
      <div className="space-y-4 pt-2">

        {/* Instructions */}
        <div className="border-2 border-dashed border-[#0A0A0A]/20 bg-[#F7F7F5] p-4">
          <p className="font-pixel text-[11px] tracking-wide text-[#0A0A0A]/60">STEPS:</p>
          <ol className="mt-2 space-y-1.5 font-pixel text-[11px] text-[#0A0A0A]">
            <li><span className="text-[#CC0000]">1.</span> COPY THE CODE BELOW</li>
            <li><span className="text-[#CC0000]">2.</span> OPEN BOT → PASTE &amp; SEND</li>
            <li><span className="text-[#CC0000]">3.</span> CLICK <span className="text-[#CC0000] font-bold">[ I SENT IT ]</span></li>
          </ol>
        </div>

        {/* Code box */}
        <div>
          <p className="mb-1.5 font-pixel text-[11px] tracking-widest text-[#0A0A0A]/45">
            &gt; SEND THIS TO @usenlybot:
          </p>
          <div className="flex items-stretch border-2 border-[#0A0A0A] bg-white overflow-hidden">
            <code className="flex-1 min-w-0 px-4 py-3 font-pixel text-[13px] tracking-widest text-[#CC0000] select-all">
              /{code}
            </code>
            <button
              type="button"
              onClick={copyCode}
              className={`shrink-0 border-l-2 border-[#0A0A0A] px-4 py-3 font-pixel text-[11px] tracking-widest transition-colors ${
                copied
                  ? "bg-[#28C840] text-white border-[#28C840]"
                  : copyError
                  ? "bg-[#CC0000] text-white"
                  : "text-[#0A0A0A]/45 hover:bg-[#0A0A0A] hover:text-white"
              }`}
            >
              {copied ? "✓ COPIED" : copyError ? "SELECT ↑" : "COPY"}
            </button>
          </div>
          {copyError && (
            <p className="mt-1 font-pixel text-[10px] text-[#CC0000]">
              Auto-copy failed — select the code manually and copy
            </p>
          )}
        </div>

        {/* Open bot button */}
        <a
          href={botUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 border-2 border-[#0A0A0A] bg-white py-3 font-pixel text-[13px] tracking-widest text-[#0A0A0A] shadow-[4px_4px_0_#0A0A0A] transition-all hover:shadow-none hover:translate-x-1 hover:translate-y-1"
        >
          <span className="text-[#CC0000]">✈</span> OPEN @usenlybot
        </a>

        <div className="flex items-center gap-3">
          <div className="flex-1 border-t border-dashed border-[#0A0A0A]/15" />
          <span className="font-pixel text-[10px] tracking-widest text-[#0A0A0A]/30">THEN</span>
          <div className="flex-1 border-t border-dashed border-[#0A0A0A]/15" />
        </div>

        {/* Status / action area */}
        {status === "done" ? (
          <motion.div
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 border-2 border-[#28C840] bg-[#28C840]/8 px-4 py-3"
          >
            <span className="font-pixel text-[18px] text-[#28C840]">✓</span>
            <span className="font-pixel text-[12px] tracking-widest text-[#28C840]">TELEGRAM VERIFIED</span>
          </motion.div>
        ) : (
          <div className="space-y-2">
            {/* Polling status bar */}
            {isPolling && (
              <div className="flex items-center justify-between border-2 border-[#0A0A0A]/20 bg-[#F7F7F5] px-4 py-2.5">
                <div className="flex items-center gap-2.5">
                  <span className="h-2 w-2 shrink-0 animate-pulse bg-[#CC0000]" />
                  <span className="font-pixel text-[10px] tracking-widest text-[#0A0A0A]/60">
                    CHECKING...
                  </span>
                </div>
                <span className="font-pixel text-[10px] tracking-widest text-[#0A0A0A]/35">
                  {countdown}s
                </span>
              </div>
            )}

            {status === "timeout" && (
              <div className="flex items-center gap-2.5 border-2 border-[#CC0000]/50 bg-[#CC0000]/5 px-4 py-2.5">
                <span className="font-pixel text-[10px] tracking-widest text-[#CC0000]">
                  ✗ NOT DETECTED — SEND THE CODE AND TRY AGAIN
                </span>
              </div>
            )}

            {/* Main action button */}
            <button
              type="button"
              onClick={isPolling ? cancelPolling : startPolling}
              className={`${BTN_PRIMARY} ${isPolling ? "opacity-60" : ""}`}
            >
              {isPolling
                ? "[ CANCEL ]"
                : status === "timeout"
                ? "[ TRY AGAIN ]"
                : "[ I SENT IT — VERIFY ]"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   STEP 3 — Payment (real TON transaction)
══════════════════════════════════════ */
const RARITY_COLORS: Record<BearRarity, string> = {
  common: "#888888", rare: "#2979FF", epic: "#D500F9", legendary: "#FFD600", mythic: "#CC0000",
};
const TIERS = [
  { amount: 2, label: "STANDARD", chances: { common:45, rare:27, epic:16, legendary:9,  mythic:3  } as Record<BearRarity,number> },
  { amount: 3, label: "PLUS",     chances: { common:33, rare:25, epic:19, legendary:14, mythic:9  } as Record<BearRarity,number> },
  { amount: 4, label: "PRO",      chances: { common:21, rare:22, epic:22, legendary:20, mythic:15 } as Record<BearRarity,number> },
  { amount: 5, label: "ELITE",    chances: { common:10, rare:20, epic:25, legendary:25, mythic:20 } as Record<BearRarity,number> },
];

type PayState = "idle" | "connecting" | "pending" | "confirmed" | "error";

function StepPayment({ onNext }: { onNext: (amount: number) => void }) {
  const [selected,  setSelected]  = useState<number | null>(null);
  const [tonPrice,  setTonPrice]  = useState<number>(5);
  const [payState,  setPayState]  = useState<PayState>("idle");
  const [payError,  setPayError]  = useState("");
  const [tonConnectUI] = useTonConnectUI();
  const walletAddr    = useTonAddress();

  // Fetch live TON/USD price
  useEffect(() => {
    fetch("https://tonapi.io/v2/rates?tokens=ton&currencies=usd")
      .then(r => r.json())
      .then(d => {
        const price = d?.rates?.TON?.prices?.USD;
        if (typeof price === "number" && price > 0) setTonPrice(price);
      })
      .catch(() => {});
  }, []);

  function tonAmount(usd: number): string {
    return (usd / tonPrice).toFixed(2);
  }

  async function handlePay() {
    if (!selected) return;
    setPayError("");

    // Step 1: connect wallet if not connected
    if (!walletAddr) {
      setPayState("connecting");
      try {
        await tonConnectUI.openModal();
        // Modal opened — user needs to connect. We'll detect connection via walletAddr change
      } catch {
        setPayState("idle");
      }
      return;
    }

    // Step 2: send transaction
    setPayState("pending");
    try {
      const nanotons = Math.round((selected / tonPrice) * 1e9);
      await tonConnectUI.sendTransaction({
        validUntil: Math.floor(Date.now() / 1000) + 300, // 5 min
        messages: [{
          address: TON_RECEIVER,
          amount: String(nanotons),
          payload: "", // optional comment
        }],
      });

      // Transaction sent successfully
      setPayState("confirmed");
      setTimeout(() => onNext(selected), 800);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "";
      if (msg.includes("User rejects") || msg.includes("CANCELLED")) {
        // User cancelled — reset to idle
        setPayState("idle");
      } else {
        setPayState("error");
        setPayError("ERR: TRANSACTION FAILED — TRY AGAIN");
      }
    }
  }

  // When wallet connects while in "connecting" state, auto-proceed to payment
  useEffect(() => {
    if (walletAddr && payState === "connecting") {
      handlePay();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddr]);

  const btnLabel = () => {
    if (!selected)                    return "[ SELECT A PACKAGE ]";
    if (payState === "connecting")    return "[ CONNECTING WALLET... ]";
    if (payState === "pending")       return "[ CONFIRM IN WALLET... ]";
    if (payState === "confirmed")     return "[ CONFIRMED ✓ ]";
    if (!walletAddr)                  return `[ CONNECT WALLET & PAY $${selected} ]`;
    return `[ PAY ${tonAmount(selected)} TON ($${selected}) ]`;
  };

  const btnDisabled = !selected || payState === "connecting" || payState === "pending" || payState === "confirmed";

  return (
    <div className="space-y-5">
      <SLabel label="CHOOSE PACKAGE" />

      <div className="grid grid-cols-2 gap-3 pt-2">
        {TIERS.map((tier) => (
          <button key={tier.amount} type="button"
            disabled={payState !== "idle" && payState !== "error"}
            onClick={() => { setSelected(tier.amount); setPayState("idle"); setPayError(""); }}
            className={`border-2 p-3 text-left transition-all disabled:opacity-60 ${
              selected === tier.amount
                ? "border-[#CC0000] shadow-[3px_3px_0_#CC0000] -translate-x-[3px] -translate-y-[3px]"
                : "border-[#0A0A0A] shadow-[3px_3px_0_#0A0A0A] hover:border-[#CC0000]"
            }`}>
            <div className="flex items-baseline justify-between gap-1">
              <p className="font-pixel text-[18px] sm:text-[20px] leading-none text-[#CC0000]">${tier.amount}</p>
              <p className="font-pixel text-[9px] text-[#0A0A0A]/30 leading-none">{tonAmount(tier.amount)} TON</p>
            </div>
            <p className="mt-0.5 font-pixel text-[9px] tracking-widest text-[#0A0A0A]/45">{tier.label}</p>
            <div className="mt-3 space-y-1">
              {(Object.entries(tier.chances) as [BearRarity, number][]).map(([r, pct]) => (
                <div key={r} className="flex items-center gap-1">
                  <span className="w-8 font-pixel text-[7px] text-[#0A0A0A]/35 uppercase">{r.slice(0,3)}</span>
                  <div className="flex-1 h-1.5 bg-[#0A0A0A]/10">
                    <div style={{ width:`${pct}%`, backgroundColor: RARITY_COLORS[r] }} className="h-full" />
                  </div>
                  <span className="w-6 text-right font-pixel text-[7px] text-[#0A0A0A]/35">{pct}%</span>
                </div>
              ))}
            </div>
          </button>
        ))}
      </div>

      {walletAddr && (
        <div className="flex items-center gap-2 border border-dashed border-[#0A0A0A]/20 bg-[#F7F7F5] px-3 py-2">
          <span className="h-1.5 w-1.5 bg-[#28C840] shrink-0" />
          <span className="font-pixel text-[9px] tracking-widest text-[#0A0A0A]/50 truncate">
            {walletAddr.slice(0, 8)}…{walletAddr.slice(-6)} CONNECTED
          </span>
        </div>
      )}

      <div className="border border-dashed border-[#0A0A0A]/20 bg-[#F7F7F5] px-3 py-2 flex items-center justify-between">
        <p className="font-pixel text-[10px] tracking-wide text-[#0A0A0A]/40">⚠ MYTHIC IS ALWAYS POSSIBLE</p>
        <p className="font-pixel text-[9px] tracking-widest text-[#0A0A0A]/30">PAYS IN TON</p>
      </div>

      {payError && (
        <p className="font-pixel text-[12px] text-[#CC0000] break-words">{payError}</p>
      )}

      <button type="button" disabled={btnDisabled} onClick={handlePay}
        className={`${BTN_PRIMARY} ${payState === "confirmed" ? "!border-[#28C840] !bg-[#28C840] !shadow-none" : ""}`}>
        {payState === "pending" || payState === "connecting"
          ? <span className="flex items-center justify-center gap-2">
              <span className="h-2 w-2 animate-pulse bg-white/60" />
              {btnLabel()}
            </span>
          : btnLabel()
        }
      </button>
    </div>
  );
}

/* ══════════════════════════════════════
   STEP 4 — Claim
══════════════════════════════════════ */
type FallingPenguin = { id: number; seed: string; rarity: BearRarity; left: number; size: number; paletteKey: string };

function StepClaim({ payment, email, onNext }: { payment: number; email: string; onNext: (handle: string) => void }) {
  const [handle,  setHandle]  = useState("");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [logs,    setLogs]    = useState<string[]>([]);
  const [fallers, setFallers] = useState<FallingPenguin[]>([]);
  const idRef = useRef(0);
  const ALL_RARITIES: BearRarity[] = ["common","rare","epic","legendary","mythic"];

  function spawnBatch(val: string, count: number) {
    const now = Date.now();
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const id = idRef.current++;
        const rarity = ALL_RARITIES[id % ALL_RARITIES.length];
        const paletteKey = ALL_PALETTE_KEYS[id % ALL_PALETTE_KEYS.length];
        const seed = `${val}__${id}__${now}`;
        const left = 4 + Math.random() * 82;
        const size = 3 + Math.floor(Math.random() * 3);
        setFallers(prev => [...prev.slice(-24), { id, seed, rarity, left, size, paletteKey }]);
        setTimeout(() => setFallers(prev => prev.filter(f => f.id !== id)), 1800);
      }, i * 120);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!handle || loading) return;
    setError(""); setLoading(true);
    const rarity = rarityFromEmailAndPayment(email, payment);
    const steps = ["CHECKING AVAILABILITY...","VERIFYING OWNERSHIP...","GENERATING SEED...","MINTING...","DONE"];
    let i = 0;
    const push = () => { if (i < steps.length) { setLogs(p => [...p, steps[i++]]); if (i < steps.length) setTimeout(push, 500); } };
    push();
    try {
      const res = await fetch("/api/auth/claim", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ handle: handle.startsWith("@") ? handle : `@${handle}`, rarity, payment }),
      });
      const data = await res.json();
      if (!res.ok) { setError(`ERR: ${(data.error as string).toUpperCase()}`); setLoading(false); return; }
      setTimeout(() => onNext(data.handle), 2800);
    } catch {
      setError("ERR: NETWORK ERROR — TRY AGAIN"); setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <SLabel label="CLAIM YOUR PENGUIN" />
      <div className="space-y-4 pt-2">
        <div className="relative h-24 overflow-hidden border-2 border-dashed border-[#0A0A0A]/15 bg-[#F7F7F5]">
          {handle.length === 0 && (
            <p className="absolute inset-0 flex items-center justify-center font-pixel text-[11px] tracking-widest text-[#0A0A0A]/25">
              TYPE YOUR HANDLE
            </p>
          )}
          <AnimatePresence>
            {fallers.map((f) => (
              <motion.div key={f.id}
                initial={{ y: -56, opacity: 1 }} animate={{ y: 110, opacity: 0 }} exit={{}}
                transition={{ duration: 1.5, ease: "easeIn" }}
                style={{ position: "absolute", left: `${f.left}%`, top: 0 }}>
                <PixelPenguin seed={f.seed} rarity={f.rarity} pixelSize={f.size} paletteKey={f.paletteKey} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <div>
          <p className="mb-1.5 font-pixel text-[11px] tracking-widest text-[#0A0A0A]/45">&gt; TELEGRAM HANDLE:</p>
          <input type="text" value={handle}
            onChange={e => { setHandle(e.target.value); if (e.target.value.length > 0) spawnBatch(e.target.value, 4); }}
            placeholder="@username" required disabled={loading} className={`${INPUT} disabled:opacity-50`} />
        </div>
        {error && <p className="font-pixel text-[12px] text-[#CC0000] break-words">{error}</p>}
        {!loading && <button type="submit" disabled={!handle} className={BTN_PRIMARY}>[ GENERATE MY PENGUIN ]</button>}
        {logs.length > 0 && (
          <div className="border-2 border-[#0A0A0A] bg-[#0A0A0A] p-4 space-y-1">
            {logs.map((line, i) => (
              <motion.p key={i} initial={{opacity:0,x:-4}} animate={{opacity:1,x:0}}
                className="font-pixel text-[11px] tracking-wide text-white/70 truncate">
                <span className="text-[#CC0000]">&gt; </span>{line}
              </motion.p>
            ))}
          </div>
        )}
      </div>
    </form>
  );
}

/* ══════════════════════════════════════
   STEP 5 — Done
══════════════════════════════════════ */
function StepDone({ email, handle, payment }: { email: string; handle: string; payment: number }) {
  const rarity = rarityFromEmailAndPayment(email, payment);
  const seed   = handle.replace("@", "").toLowerCase();
  return (
    <div className="space-y-5">
      <SLabel label="MINTING COMPLETE" />
      <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{duration:0.5}}
        className="flex flex-col items-center gap-4 pt-2">
        <div className="border-2 border-[#0A0A0A] bg-white p-3 shadow-[6px_6px_0_#CC0000] sm:p-4">
          <PixelPenguin seed={seed} rarity={rarity} pixelSize={12} />
        </div>
        <div className="w-full border-2 border-[#0A0A0A] bg-[#0A0A0A] px-4 py-3 space-y-1">
          {([
            ["HANDLE",  handle],
            ["RARITY",  RARITY_LABELS[rarity].toUpperCase()],
            ["PACKAGE", `$${payment} ${TIERS.find(t => t.amount === payment)?.label ?? ""}`],
            ["STATUS",  "MINTED ✓"],
            ["EDITION", "1 OF 1"],
          ] as const).map(([k, v]) => (
            <p key={k} className="font-pixel text-[12px] sm:text-[13px] tracking-wide text-white">
              <span className="text-[#CC0000]">&gt; {k}:</span> {v}
            </p>
          ))}
        </div>
        <div className="flex w-full gap-3">
          <button type="button"
            onClick={() => { if (navigator.share) navigator.share({ title:"My Usenly Penguin", url:window.location.origin }); }}
            className="flex-1 border-2 border-[#0A0A0A] bg-white py-2.5 font-pixel text-[11px] tracking-widest text-[#0A0A0A] shadow-[3px_3px_0_#0A0A0A] transition-all hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5">
            [ SHARE ]
          </button>
          <Link href="/"
            className="flex-1 border-2 border-[#0A0A0A] bg-[#0A0A0A] py-2.5 text-center font-pixel text-[11px] tracking-widest text-white shadow-[3px_3px_0_#CC0000] transition-all hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5">
            [ HOME ]
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

/* ══════════════════════════════════════
   MAIN FLOW
══════════════════════════════════════ */
export function StartFlow() {
  const searchParams = useSearchParams();
  const [step,         setStep]         = useState(0);
  const [email,        setEmail]        = useState("");
  const [pendingToken, setPendingToken] = useState("");
  const [payment,      setPayment]      = useState(2);
  const [handle,       setHandle]       = useState("");
  const { user, setUser, hydrated } = useUser();

  useEffect(() => {
    if (!hydrated) return;
    if (!user?.email) return;

    setEmail(user.email);
    if (user.payment) setPayment(user.payment);
    if (user.handle)  setHandle(user.handle);

    if (user.handle && user.payment) {
      setStep(5);
    } else if (user.payment) {
      setStep(4);
    } else {
      setStep(2);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  void searchParams;

  function onRegister(em: string, opts: RegisterOpts) {
    setEmail(em);
    if (opts.mode === "login") {
      setUser({ email: em });
      setStep(opts.handle ? 5 : 2);
    } else {
      setPendingToken(opts.pendingToken);
      setStep(1);
    }
  }

  function onVerified() {
    setUser({ email });
    setStep(2);
  }

  function onPayment(amount: number) {
    setPayment(amount);
    setUser({ email, payment: amount });
    setStep(4);
  }

  function onClaim(h: string) {
    const rarity = rarityFromEmailAndPayment(email, payment);
    setHandle(h);
    setUser({ email, payment, handle: h, rarity });
    setStep(5);
  }

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-[#F7F7F5] px-4 py-12 sm:py-16">
      <div className="w-full max-w-lg">
        <div className="border-2 border-[#0A0A0A] bg-white shadow-[8px_8px_0_#CC0000]">
          <div className="flex items-center gap-2 border-b-2 border-[#0A0A0A]/15 bg-[#0A0A0A] px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
            <span className="ml-3 font-pixel text-[10px] tracking-widest text-white/38 truncate">
              usenly.exe — ONBOARDING
            </span>
          </div>
          <div className="p-4 sm:p-7 overflow-hidden">
            <StepBar step={step} />
            <AnimatePresence mode="wait">
              <motion.div key={step}
                initial={{opacity:0,x:12}} animate={{opacity:1,x:0}}
                exit={{opacity:0,x:-12}} transition={{duration:0.2}}>
                {step === 0 && <StepRegister onNext={onRegister} />}
                {step === 1 && (
                  <StepEmailVerify
                    email={email}
                    pendingToken={pendingToken}
                    onVerified={onVerified}
                    onTokenRefresh={setPendingToken}
                  />
                )}
                {step === 2 && <StepTelegram email={email} onNext={() => setStep(3)} />}
                {step === 3 && <StepPayment onNext={onPayment} />}
                {step === 4 && <StepClaim payment={payment} email={email} onNext={onClaim} />}
                {step === 5 && <StepDone email={email} handle={handle} payment={payment} />}
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="flex items-center gap-2 border-t border-[#0A0A0A]/10 bg-[#F7F7F5] px-4 sm:px-5 py-2">
            <span className="h-1.5 w-1.5 shrink-0 bg-[#CC0000]" />
            <span className="font-pixel text-[10px] tracking-widest text-[#0A0A0A]/28 truncate">
              SECURE · STEP {step + 1} OF 6
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
