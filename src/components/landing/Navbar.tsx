"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useTonConnectUI, useTonAddress } from "@tonconnect/ui-react";
import { PixelPenguin } from "@/components/bear/PixelPenguin";
import { useUser } from "@/lib/user-context";

const NAV_LINKS = [
  { href: "/#how",        label: "HOW IT WORKS" },
  { href: "/#collection", label: "COLLECTION"   },
  { href: "/market",      label: "MARKET"       },
  { href: "/inventory",   label: "INVENTORY"    },
  { href: "/docs/nft",    label: "DOCS"         },
];

/* ── TON Wallet button ── */
function WalletButton() {
  const [tonConnectUI] = useTonConnectUI();
  const address = useTonAddress();

  if (address) {
    return (
      <button
        onClick={() => tonConnectUI.openModal()}
        className="hidden items-center gap-1.5 border-2 border-[#0A8B6B] bg-[#0A8B6B]/8 px-3 py-1.5 font-pixel text-[9px] tracking-widest text-[#0A8B6B] transition-all hover:bg-[#0A8B6B] hover:text-white sm:flex"
      >
        <span className="h-1.5 w-1.5 bg-[#28C840]" />
        {address.slice(0, 4)}…{address.slice(-4)}
      </button>
    );
  }

  return (
    <button
      onClick={() => tonConnectUI.openModal()}
      className="hidden border-2 border-[#0A0A0A]/30 px-3 py-1.5 font-pixel text-[9px] tracking-widest text-[#0A0A0A]/50 transition-all hover:border-[#0A0A0A] hover:text-[#0A0A0A] sm:block"
    >
      [ TON WALLET ]
    </button>
  );
}

function MobileWalletButton() {
  const [tonConnectUI] = useTonConnectUI();
  const address = useTonAddress();
  return (
    <button
      onClick={() => tonConnectUI.openModal()}
      className="w-full border-2 border-dashed border-[#0A0A0A]/20 py-2.5 font-pixel text-[11px] tracking-widest text-[#0A0A0A]/50 transition-colors hover:text-[#0A0A0A]"
    >
      {address ? `● ${address.slice(0, 6)}…${address.slice(-4)} CONNECTED` : "[ CONNECT TON WALLET ]"}
    </button>
  );
}

/* ── Logout confirmation modal ── */
function LogoutModal({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0A0A0A]/70 px-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }} transition={{ duration: 0.18 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-sm border-2 border-[#0A0A0A] bg-white shadow-[8px_8px_0_#CC0000]"
      >
        <div className="flex items-center gap-2 border-b-2 border-[#0A0A0A]/15 bg-[#0A0A0A] px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
          <span className="ml-3 font-pixel text-[10px] tracking-widest text-white/40">usenly.exe — LOGOUT</span>
        </div>
        <div className="p-6 space-y-5">
          <p className="font-pixel text-[13px] tracking-wide text-[#0A0A0A] leading-relaxed">
            Are you sure you want to log out?
          </p>
          <div className="flex gap-3">
            <button onClick={onConfirm}
              className="flex-1 border-2 border-[#CC0000] bg-[#CC0000] py-2.5 font-pixel text-[12px] tracking-widest text-white transition-all hover:bg-[#aa0000]">
              [ CONFIRM ]
            </button>
            <button onClick={onCancel}
              className="flex-1 border-2 border-[#0A0A0A] bg-white py-2.5 font-pixel text-[12px] tracking-widest text-[#0A0A0A] shadow-[3px_3px_0_#0A0A0A] transition-all hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]">
              [ CANCEL ]
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const router   = useRouter();
  const isStart  = pathname === "/start";
  const { user, setUser, hydrated } = useUser();
  const [menuOpen,         setMenuOpen]         = useState(false);
  const [showLogoutModal,  setShowLogoutModal]  = useState(false);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setShowLogoutModal(false);
    router.push("/");
  }

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="fixed top-0 right-0 left-0 z-50 border-b-2 border-[#0A0A0A] bg-white"
      >
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group" onClick={() => setMenuOpen(false)}>
            <div className="overflow-hidden border-2 border-[#0A0A0A] bg-white transition-colors group-hover:border-[#CC0000]"
              style={{ width: 34, height: 34 }}>
              <div style={{ marginTop: -10 }}>
                <PixelPenguin seed="usenly" rarity="common" pixelSize={2}
                  accessories={{ hat:"none", glasses:"none", outfit:"none", shoes:"none", extra:"none" }} />
              </div>
            </div>
            <span className="font-pixel text-[18px] tracking-widest text-[#0A0A0A] transition-colors group-hover:text-[#CC0000] sm:text-[20px]">
              &gt; USENLY<span className="cursor-blink" />
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden items-center md:flex">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href}
                className="group relative px-3 py-2 font-pixel text-[12px] tracking-widest text-[#0A0A0A]/40 transition-colors hover:text-[#0A0A0A] lg:px-4 lg:text-[13px]">
                {link.label}
                <span className="absolute bottom-0.5 left-3 right-3 h-[2px] origin-left scale-x-0 bg-[#CC0000] transition-transform duration-200 group-hover:scale-x-100 lg:left-4 lg:right-4" />
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 sm:gap-2">
            {/* TON Wallet */}
            <WalletButton />

            {/* Auth UI */}
            {hydrated && (
              user ? (
                <>
                  <div className="hidden items-center gap-2 border-2 border-[#0A0A0A]/15 px-3 py-1.5 sm:flex">
                    <span className="h-1.5 w-1.5 animate-pulse bg-[#CC0000]" />
                    <span className="font-pixel text-[10px] tracking-widest text-[#0A0A0A]/50 max-w-[100px] truncate">
                      {user.email.length > 14 ? user.email.slice(0, 12) + "…" : user.email}
                    </span>
                  </div>
                  <button onClick={() => setShowLogoutModal(true)}
                    className="border-2 border-[#CC0000] px-3 py-1.5 font-pixel text-[10px] tracking-widest text-[#CC0000] transition-all hover:bg-[#CC0000] hover:text-white sm:px-4 sm:text-[11px]">
                    [ LOGOUT ]
                  </button>
                </>
              ) : (
                <>
                  <span className="hidden font-pixel text-[10px] tracking-widest text-[#0A0A0A]/22 sm:block">v1.0.0-β</span>
                  <Link href="/start" onClick={() => setMenuOpen(false)}
                    className={`font-pixel text-[11px] tracking-widest border-2 px-3 py-1.5 transition-all sm:px-5 sm:py-2 sm:text-[13px] ${
                      isStart
                        ? "border-[#0A0A0A]/20 text-[#0A0A0A]/25 cursor-not-allowed"
                        : "border-[#0A0A0A] bg-[#0A0A0A] text-white shadow-[3px_3px_0_#CC0000] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]"
                    }`}>
                    [ START ]
                  </Link>
                </>
              )
            )}

            {/* Hamburger */}
            <button type="button" onClick={() => setMenuOpen(v => !v)}
              className="flex flex-col items-center justify-center gap-[5px] border-2 border-[#0A0A0A] p-2 md:hidden"
              aria-label="Toggle menu">
              <span className={`block h-[2px] w-5 bg-[#0A0A0A] transition-transform duration-200 origin-center ${menuOpen ? "translate-y-[7px] rotate-45" : ""}`} />
              <span className={`block h-[2px] w-5 bg-[#0A0A0A] transition-opacity duration-200 ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block h-[2px] w-5 bg-[#0A0A0A] transition-transform duration-200 origin-center ${menuOpen ? "-translate-y-[7px] -rotate-45" : ""}`} />
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
              className="overflow-hidden border-t-2 border-[#0A0A0A] bg-white md:hidden"
            >
              <div className="flex flex-col px-4 py-2">
                {NAV_LINKS.map((link) => (
                  <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}
                    className="border-b border-dashed border-[#0A0A0A]/15 py-3.5 font-pixel text-[13px] tracking-widest text-[#0A0A0A]/60 transition-colors hover:text-[#CC0000] last:border-0">
                    &gt; {link.label}
                  </Link>
                ))}
                <div className="border-t border-dashed border-[#0A0A0A]/15 pt-3 mt-1 space-y-2">
                  <MobileWalletButton />
                  {hydrated && user && (
                    <>
                      <p className="font-pixel text-[10px] tracking-widest text-[#0A0A0A]/30 truncate">● {user.email}</p>
                      <button onClick={() => { setMenuOpen(false); setShowLogoutModal(true); }}
                        className="w-full border-2 border-[#CC0000] py-2.5 font-pixel text-[11px] tracking-widest text-[#CC0000] hover:bg-[#CC0000] hover:text-white transition-colors">
                        [ LOGOUT ]
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <AnimatePresence>
        {showLogoutModal && (
          <LogoutModal onConfirm={handleLogout} onCancel={() => setShowLogoutModal(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
