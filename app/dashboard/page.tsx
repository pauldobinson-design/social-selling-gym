"use client";

export const dynamic = "force-dynamic"; // avoid static prerender traps

import { useEffect } from "react";
import ChallengeCard from "@/components/challenge-card";
import { StatCard } from "@/components/cards";
import { useMockAuth } from "@/lib/mock-auth";
import { recommendBySSI } from "@/lib/recommend";

export default function Dashboard() {
  const { user, signInMock, ssi } = useMockAuth();

  // Optional: if you still want the “?mock=1” behaviour, read from window (no Suspense needed)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (url.searchParams.get("mock") === "1") signInMock();
    }
  }, [signInMock]);

  const total = (ssi.brand || 0) + (ssi.people || 0) + (ssi.insights || 0) + (ssi.relationships || 0);
  const progress = user ? `${user.xp} / 1200 XP` : "0 / 1200 XP";
  const toNext = user ? Math.max(0, 1200 - user.xp) : 1200;

  let recs: any[] = [];
  try {
    recs = (recommendBySSI(ssi) || []).filter(Boolean);
  } catch {
    recs = [];
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{user ? `Welcome back, ${user.name}` : "Welcome, guest"}</h1>
        <button className="btn" onClick={signInMock}>Toggle mock sign in</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Progress" value={progress} sub={`${toNext} to Level 6`} />
        <StatCard label="SSI Total" value={`${total} / 100`} sub="Sum of 4 pillars" />
        <StatCard label="Active Challenges" value={String(recs.length || 3)} sub="Keep your streak alive" />
      </div>

      <div className="card p-4">
        <h2 className="text-xl font-semibold mb-2">Recommended for you</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recs.map((c) => (<ChallengeCard key={c?.id ?? Math.random()} c={c} />))}
        </div>
      </div>
    </div>
  );
}
