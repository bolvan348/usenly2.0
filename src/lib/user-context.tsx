"use client";

import { createContext, useContext, useState, useEffect } from "react";
import type { BearRarity } from "./bear-types";

export interface User {
  email:    string;
  handle?:  string;
  rarity?:  BearRarity;
  payment?: number;
}

interface UserContextType {
  user:       User | null;
  setUser:    (u: User | null) => void;
  updateUser: (partial: Partial<User>) => void;
  hydrated:   boolean;
}

const UserContext = createContext<UserContextType>({
  user:       null,
  setUser:    () => {},
  updateUser: () => {},
  hydrated:   false,
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user,     setUser]     = useState<User | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Restore session from HttpOnly cookie on every page load
  useEffect(() => {
    fetch("/api/auth/me")
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.email) {
          setUser({
            email:   data.email,
            handle:  data.handle  ?? undefined,
            rarity:  data.rarity  ?? undefined,
            payment: data.payment ?? undefined,
          });
        }
      })
      .catch(() => {})
      .finally(() => setHydrated(true));
  }, []);

  function updateUser(partial: Partial<User>) {
    setUser((prev) => (prev ? { ...prev, ...partial } : null));
  }

  return (
    <UserContext.Provider value={{ user, setUser, updateUser, hydrated }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
