"use client";

export const dynamic = "force-dynamic";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { CHALLENGES } from "@/data/challenges";
import AIFeedback from "@/components/ai-feedback";
import ResourceLinks from "@/components/resource-links";

export default function ChallengeDetail() {
  const { id } = useParams<{ id: string }>();
  const c = (Array.isArray(CHALLENGES) ? CHALLENGES : []).find((x) => x?.id === id);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  if (!c) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Challenge not found</h1>
        <p className="text-gray-700">That ID is not available.</p>
        <Link className="btn" href="/challenges">Back to Challenges</Link>
      </div>
    );
  }

  async function markComplete() {
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deltaXp: c.xp, reason: `Completed: ${c.title}` })
      });
      const ok = (await res.json())?.ok;
      if (ok) setDone(true);
    } catch { /* ignore */ }
    setSaving(false);
  }

  const kind = c.channel === "LinkedIn"
    ? (c.outcome === "Meeting" ? "post" : "dm")
    : c.channel === "Email"
    ? "dm"
    : "general";

  const seed =
    c.example ||
    (c.steps && c.steps.length
      ? `${c.title}\n\n${c.steps.map((s, i) => `${i + 1}. ${s}`).join("\n")}\n\nDraft here…`
      : "");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{c.title}</h1>
        <div className="flex gap-2">
          <button className="btn btn-primary" onClick={markComplete} disabled={saving || done}>
            {done ? "Marked done ✓" : saving ? "Saving..." : `Mark complete (+${c.xp} XP)`}
          </button>
          <Link className="btn" href="/challenges">Back</Link>
        </div>
      </div>

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
          {c.steps.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ol>
      </div>

      <AIFeedback kind={kind as any} seed={seed} />
      <ResourceLinks tags={c.tags} />
    </div>
  );
}
