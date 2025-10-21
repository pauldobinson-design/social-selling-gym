import Link from "next/link";

export function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="card p-4">
      <div className="text-sm text-ink-700">{label}</div>
      <div className="text-2xl font-semibold">{value}</div>
      {sub ? <div className="text-sm text-ink-500 mt-1">{sub}</div> : null}
    </div>
  );
}

export function ChallengeCard({ c }: { c: any }) {
  return (
    <div className="card p-4 flex flex-col gap-2">
      <div className="text-sm text-ink-500">{c.level} • {c.channel} • {c.time}</div>
      <div className="text-lg font-semibold">{c.title}</div>
      <div className="text-sm text-ink-700">{c.objective}</div>
      <div className="mt-2 flex items-center justify-between">
        <span className="rounded-full bg-ink-100 px-3 py-1 text-xs">XP {c.xp}</span>
        <Link className="btn btn-primary" href={`/challenges/${c.id}`}>Start</Link>
      </div>
    </div>
  );
}
