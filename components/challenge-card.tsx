// components/challenge-card.tsx
import Link from "next/link";

export type Challenge = {
  id: string;
  title: string;
  objective: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  channel: "LinkedIn" | "Email" | "Calls";
  time: "≤10m" | "10–20m" | "20m+";
  xp: number;
};

export function ChallengeCard({ c }: { c?: Partial<Challenge> | null }) {
  if (!c || !c.id) return null; // guard for undefined during prerender
  return (
    <div className="card p-4 flex flex-col gap-2">
      <div className="text-sm text-ink-500">
        {(c.level ?? "—")} • {(c.channel ?? "—")} • {(c.time ?? "—")}
      </div>
      <div className="text-lg font-semibold">{c.title ?? "Untitled challenge"}</div>
      <div className="text-sm text-ink-700">{c.objective ?? ""}</div>
      <div className="mt-2 flex items-center justify-between">
        <span className="rounded-full bg-ink-100 px-3 py-1 text-xs">XP {c.xp ?? 0}</span>
        <Link className="btn btn-primary" href={`/challenges/${c.id}`}>Start</Link>
      </div>
    </div>
  );
}

export default ChallengeCard;
