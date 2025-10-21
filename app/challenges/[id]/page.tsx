"use client";

export const dynamic = "force-dynamic";

import Link from "next/link";
import { useParams } from "next/navigation";
import { CHALLENGES } from "@/data/challenges";

export default function ChallengeDetail() {
  const { id } = useParams<{ id: string }>();
  const list = Array.isArray(CHALLENGES) ? CHALLENGES : [];
  const c = list.find(x => x?.id === id);

  if (!c) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Challenge not found</h1>
        <p className="text-ink-700">That ID isn’t in the current challenge set.</p>
        <Link className="btn" href="/challenges">Back to Challenges</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{c.title}</h1>
        <Link className="btn" href="/challenges">Back</Link>
      </div>
      <div className="text-sm text-ink-500">{c.level} • {c.channel} • {c.time} • XP {c.xp}</div>
      <p className="text-ink-700">{c.objective}</p>

      {c.example && (
        <div className="card p-4">
          <h2 className="text-lg font-semibold">Example</h2>
          <p className="text-ink-700">{c.example}</p>
        </div>
      )}

      <div className="card p-4">
        <h2 className="text-lg font-semibold">Steps</h2>
        <ol className="list-decimal pl-5 space-y-2">
          {c.steps.map((s, i) => <li key={i}>{s}</li>)}
        </ol>
      </div>

      <div className="card p-4">
        <h2 className="text-lg font-semibold">Rubric</h2>
        <ul className="list-disc pl-5 space-y-1">
          {c.rubric.map((r, i) => <li key={i}>{r}</li>)}
        </ul>
      </div>

      <div className="flex gap-3">
        <button className="btn btn-primary">Start</button>
        <button className="btn">Submit proof</button>
        <button className="btn">Ask AI coach</button>
      </div>
    </div>
  );
}
