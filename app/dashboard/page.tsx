"use client";

export const dynamic = "force-dynamic";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { StatCard } from "@/components/cards";
import ChallengeCard from "@/components/challenge-card";
import { recommendBySSI } from "@/lib/recommend";

type SSI = { brand: number; people: number; insights: number; relationships: number };

export default function Dashboard() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [ssi, setSsi] = useState<SSI>({ brand: 0, people: 0, insights: 0, relationships: 0 });
  const [xp, setXp] = useState(0);

  const name = session?.user?.name ?? "guest";
  const total = ssi.brand + ssi.people + ssi.insights + ssi.relationships;
  const toNext = Math.max(0, 1200 - xp);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/profile");
        const json = await res.json();
        if (!active) return;
        if (json?.ok) {
          setSsi(json.profile?.ssi || { brand: 0, people: 0, insights: 0, relationships: 0 });
          setXp(json.profile?.xp || 0);
        }
      } catch { /* ignore */ }
      setLoading(false);
    })();
    return () => { active = false; };
  }, []);

  const recs = useMemo(() => {
    try { return (recommendBySSI(ssi) || []).filter(Boolean); }
    catch { return []; }
  }, [ssi]);

  async function complete(action: "comment" | "post" | "dm") {
    const xpMap = { comment: 50, post: 120, dm: 70 } as const;
    const reasonMap = {
      comment: "Comment with value",
      post: "Outcome-led post",
      dm: "Warm DM"
    } as const;
    setLoading(true);
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deltaXp: xpMap[action], reason: reasonMap[action] })
      });
      const json = await res.json();
      if (json?.ok) {
        setXp(json.profile?.xp || 0);
      }
    } catch { /* ignore */ }
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Welcome, {name}</h1>
        <a className="btn" href="/account">Account & preferences</a>
      </div>

      {total === 0 && (
        <div className="card p-4 border-accent">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="font-semibold">Set your SSI to personalise your plan</div>
              <p className="text-sm text-ink-700">Open LinkedIn’s SSI page, then enter your 4 pillar scores (0–25 each).</p>
            </div>
            <a className="btn" href="https://www.linkedin.com/sales/ssi" target="_blank" rel="noreferrer">Open SSI</a>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Progress" value={`${xp} / 1200 XP`} sub={`${toNext} to Level 6`} />
        <StatCard label="SSI Total" value={`${total} / 100`} sub="Sum of 4 pillars" />
        <StatCard label="Active Challenges" value={String(recs.length || 3)} sub="Keep your streak alive" />
      </div>

      <div className="card p-4">
        <h2 className="text-xl font-semibold mb-2">Today’s plan</h2>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li>Comment with value on 2 target posts</li>
          <li>Write 1 outcome-led post (or reshare with your angle)</li>
          <li>Send 2 warm DMs or nurture follow-ups</li>
        </ul>
        <div className="mt-3 flex gap-2">
          <a className="btn" href="/challenges/c1">Do a comment</a>
          <a className="btn" href="/postcraft">Draft a post</a>
          <a className="btn" href="/challenges/c2">Send a warm DM</a>
        </div>
        <div className="mt-3 flex gap-2">
          <button className="btn btn-primary" disabled={loading} onClick={() => complete("comment")}>Mark comment done (+50 XP)</button>
          <button className="btn btn-primary" disabled={loading} onClick={() => complete("post")}>Mark post done (+120 XP)</button>
          <button className="btn btn-primary" disabled={loading} onClick={() => complete("dm")}>Mark DM done (+70 XP)</button>
        </div>
      </div>

      <div className="card p-4">
        <h2 className="text-xl font-semibold mb-2">Recommended for you</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recs.map((c) => (<ChallengeCard key={c?.id ?? Math.random()} c={c as any} />))}
        </div>
      </div>
    </div>
  );
}
