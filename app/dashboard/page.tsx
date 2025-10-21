"use client";

export const dynamic = "force-dynamic";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { StatCard } from "@/components/cards";
import ChallengeCard from "@/components/challenge-card";
import { useMockAuth } from "@/lib/mock-auth";
import { recommendBySSI } from "@/lib/recommend";

export default function Dashboard() {
  const { data: session } = useSession();
  const { user: mockUser, signInMock, ssi } = useMockAuth();

  // Optional mock toggle via querystring, without useSearchParams
  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (url.searchParams.get("mock") === "1") signInMock();
    }
  }, [signInMock]);

  const displayName =
    (session?.user?.name as string | undefined) ??
    (mockUser?.name ?? "guest");

  const xp = mockUser?.xp ?? 0;
  const totalSSI = (ssi.brand || 0) + (ssi.people || 0) + (ssi.insights || 0) + (ssi.relationships || 0);
  const toNext = Math.max(0, 1200 - xp);

  let recs: any[] = [];
  try { recs = (recommendBySSI(ssi) || []).filter(Boolean); } catch {}

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Welcome, {displayName}</h1>
        <a href="/account" className="btn">Preferences</a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Progress" value={`${xp} / 1200 XP`} sub={`${toNext} to Level 6`} />
        <StatCard label="SSI Total" value={`${totalSSI} / 100`} sub="Sum of 4 pillars" />
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
