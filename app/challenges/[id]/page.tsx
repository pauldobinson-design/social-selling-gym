"use client";

export const dynamic = "force-dynamic";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { CHALLENGES } from "@/data/challenges";

export default function ChallengeDetail() {
  const { id } = useParams<{ id: string }>();
  const c = (Array.isArray(CHALLENGES) ? CHALLENGES : []).find((x) => x?.id === id);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  if (!c) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Challenge not found</h1>
        <p className="text-gray-700">That ID isn’t in the current challenge set.</p>
        <Link className="btn" href="/challenges">Back to Challenges</Link>
      </div>
    );
  }

  async function markComplete() {
    setSaving(true);
    setErr(null);
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deltaXp: c.xp, reason: `Completed: ${c.title}` }),
        cache: "no-store",
      });
      const json = await res.json();
      if (json?.ok) setDone(true);
      else setErr(json?.message || "Could not credit XP");
    } catch {
      setErr("Network error");
    }
    setSaving(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{c.title}</h1>
        <div className="flex gap-2">
          <button className="btn btn-primary" onClick={markComplete} disabled={saving || done}>
            {done ? "Marked done ✓" : saving ? "Saving…" : `Mark complete (+${c.xp} XP)`}
          </button>
          <Link className="btn" href="/challenges">Back</Link>
        </div>
      </div>

      {err && <div className="card p-3 text-sm text-red-600">Error: {err}</div>}

      <div className="text-sm text-gray-500">{c.level} • {c.channel} • {c.time} • XP {c.xp}</div>
      <p className="text-gray-700">{c.objective}</p>

      {c.example && (
        <div className="card p-4">
          <h2 className="text-lg font-semibold">Example</h2>
          <p className="text-gray-700">{c.example}</p>
        </div>
      )}

      <div className="card p-4">
        <h2 className="text-lg font-semibold">Steps</h2>
        <ol className="list-decimal pl-5 space-y-2">
          {c.steps.map((s, i) => <li key={i}>{s}</li>)}
        </ol>
      </div>

      <div className="card p-4 space-y-2">
        <h3 className="text-lg font-semibold">Learn more</h3>
        <ul className="list-disc pl-5 text-sm">
          {c.tags?.includes("relationships") && (
            <>
              <li><a href="https://copywritingcourse.com/linkedin-messages/" target="_blank" rel="noreferrer">Warm DM templates</a></li>
              <li><a href="https://www.apollo.io/blog/linkedin-inmail-vs-dm/" target="_blank" rel="noreferrer">From comment to DM</a></li>
            </>
          )}
          {c.tags?.includes("insights") && (
            <>
              <li><a href="https://www.gong.io/blog/social-selling/" target="_blank" rel="noreferrer">Signal-based engagement</a></li>
            </>
          )}
          {c.tags?.includes("brand") && (
            <>
              <li><a href="https://marketingexamples.com/social/linkedin" target="_blank" rel="noreferrer">Outcome-led posts</a></li>
            </>
          )}
          {c.tags?.includes("people") && (
            <>
              <li><a href="https://hbr.org/2017/03/the-new-sales-imperative" target="_blank" rel="noreferrer">Mapping buying committees</a></li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}
