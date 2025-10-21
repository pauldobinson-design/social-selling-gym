"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ChallengeCard from "@/components/challenge-card";
import { StatCard } from "@/components/cards";
import { useMockAuth } from "@/lib/mock-auth";
import { recommendBySSI } from "@/lib/recommend";

export default function Dashboard() {
  const { user, signInMock, ssi } = useMockAuth();
  const params = useSearchParams();

  useEffect(() => {
    if (params.get("mock") === "1") signInMock();
  }, [params, signInMock]);

  const total = ssi.brand + ssi.people + ssi.insights + ssi.relationships;
  const progress = user ? `${user.xp} / 1200 XP` : "0 / 1200 XP";
  const toNext = user ? Math.max(0, 1200 - user.xp) : 1200;
  const recs = recommendBySSI(ssi);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{user ? `Welcome back, ${user.name}` : "Welcome, guest"}</h1>
        {/* SSI modal button component if you have it */}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Progress" value={progress} sub={`${toNext} to Level 6`} />
        <StatCard label="SSI Total" value={`${total} / 100`} sub="Sum of 4 pillars" />
        <StatCard label="Active Challenges" value="3" sub="Keep your streak alive" />
      </div>

      <div className="card p-4">
        <h2 className="text-xl font-semibold mb-2">Recommended for you</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recs.map((c) => (<ChallengeCard key={c.id} c={c as any} />))}
        </div>
      </div>
    </div>
  );
}
