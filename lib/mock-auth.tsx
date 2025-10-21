"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = { id: string; name: string; avatarUrl?: string; xp: number };

type SSI = {
  brand: number;
  people: number;
  insights: number;
  relationships: number;
};

type Ctx = {
  user: User | null;
  signInMock: () => void;
  signOut: () => void;
  ssi: SSI;
  setSSI: (s: SSI) => void;
};

const C = createContext<Ctx | null>(null);

export function MockAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ssi, setSSI] = useState<SSI>({ brand: 0, people: 0, insights: 0, relationships: 0 });
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = typeof window !== "undefined" ? localStorage.getItem("ssg_user") : null;
      const storedSSI = typeof window !== "undefined" ? localStorage.getItem("ssg_ssi") : null;
      if (storedUser) setUser(JSON.parse(storedUser));
      if (storedSSI) setSSI(JSON.parse(storedSSI));
    } catch {}
  }, []);

  function signInMock() {
    const u = { id: "u1", name: "Dobbo", avatarUrl: "", xp: 850 };
    setUser(u);
    try { localStorage.setItem("ssg_user", JSON.stringify(u)); } catch {}
    router.refresh();
  }

  function signOut() {
    setUser(null);
    try { localStorage.removeItem("ssg_user"); } catch {}
    router.refresh();
  }

  function setSSISafe(s: SSI) {
    setSSI(s);
    try { localStorage.setItem("ssg_ssi", JSON.stringify(s)); } catch {}
  }

  return <C.Provider value={{ user, signInMock, signOut, ssi, setSSI: setSSISafe }}>{children}</C.Provider>;
}

/** Safe fallback to avoid crashes during prerender, including /_not-found */
export function useMockAuth() {
  const ctx = useContext(C);
  if (!ctx) {
    return {
      user: null,
      signInMock: () => {},
      signOut: () => {},
      ssi: { brand: 0, people: 0, insights: 0, relationships: 0 },
      setSSI: () => {}
    };
  }
  return ctx;
}
