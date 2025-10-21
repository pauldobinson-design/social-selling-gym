"use client";

export const dynamic = "force-dynamic"; // avoid static prerender traps

import { useMemo, useState } from "react";
import { CHALLENGES } from "@/data/challenges";
import ChallengeCard from "@/components/challenge-card";

const channels = ["LinkedIn", "Email", "Calls"] as const;
const outcomes = ["Connect", "Meeting", "Nurture"] as const;
const times = ["≤10m", "10–20m", "20m+"] as const;

export default function Challenges() {
  const [filters, setFilters] = useState<{channel?: string; outcome?: string; time?: string}>({});

  const list = useMemo(() => {
    const src = Array.isArray(CHALLENGES) ? CHALLENGES : [];
    return src.filter((c) => {
      if (!c) return false;
      return (!filters.channel || c.channel === filters.channel) &&
             (!filters.outcome || c.outcome === filters.outcome) &&
             (!filters.time || c.time === filters.time);
    });
  }, [filters]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Challenges</h1>
      <div className="card p-4 flex flex-wrap gap-3 items-center">
        <select
          className="input max-w-xs"
          value={filters.channel || ""}
          onChange={e => setFilters(f => ({...f, channel: e.target.value || undefined}))}
        >
          <option value="">Channel</option>
          {channels.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <select
          className="input max-w-xs"
          value={filters.outcome || ""}
          onChange={e => setFilters(f => ({...f, outcome: e.target.value || undefined}))}
        >
          <option value="">Outcome</option>
          {outcomes.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <select
          className="input max-w-xs"
          value={filters.time || ""}
          onChange={e => setFilters(f => ({...f, time: e.target.value || undefined}))}
        >
          <option value="">Time</option>
          {times.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <button className="btn ml-auto" onClick={() => setFilters({})}>Reset</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {list.map((c) => <ChallengeCard key={c.id} c={c} />)}
      </div>
    </div>
  );
}
