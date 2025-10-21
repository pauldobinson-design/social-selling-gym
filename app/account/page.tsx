"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";

type SSI = { brand: number; people: number; insights: number; relationships: number };

export default function Account() {
  const { data: session } = useSession();
  const name = session?.user?.name ?? "Guest";
  const email = session?.user?.email ?? "";
  const image = (session?.user as any)?.image as string | undefined;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [ssi, setSsi] = useState<SSI>({ brand: 0, people: 0, insights: 0, relationships: 0 });
  const [xp, setXp] = useState(0);
  const total = ssi.brand + ssi.people + ssi.insights + ssi.relationships;

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/profile", { method: "GET" });
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

  async function save() {
    setSaving(true);
    await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ssi })
    }).catch(() => {});
    setSaving(false);
  }

  if (!session?.user) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Account & preferences</h1>
        <p className="text-ink-700">Please sign in with Google to manage your preferences.</p>
        <a className="btn btn-primary" href="/api/auth/signin">Sign in with Google</a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Account & preferences</h1>

      <div className="card p-4 flex items-center gap-4">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="avatar" className="h-12 w-12 rounded-full" />
        ) : (
          <div className="h-12 w-12 rounded-full bg-ink-100" />
        )}
        <div>
          <div className="font-medium">{name}</div>
          <div className="text-sm text-ink-700">{email}</div>
          <div className="text-sm text-ink-700">XP: {xp}</div>
        </div>
        <div className="ml-auto flex gap-2">
          <a className="btn" href="/api/auth/signin">Change account</a>
          <button className="btn" onClick={() => signOut()}>Sign out</button>
        </div>
      </div>

      <div className="card p-4 space-y-3">
        <div className="font-medium">LinkedIn SSI</div>
        <p className="text-sm text-ink-700">
          Don’t know your SSI? Open{" "}
          <a className="underline" href="https://www.linkedin.com/sales/ssi" target="_blank" rel="noreferrer">linkedin.com/sales/ssi</a>.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {([
            ["brand","Brand"],
            ["people","People"],
            ["insights","Insights"],
            ["relationships","Relationships"]
          ] as const).map(([key, label]) => (
            <div key={key}>
              <label className="label">{label}</label>
              <input
                className="input"
                type="number"
                min={0}
                max={25}
                disabled={loading}
                value={(ssi as any)[key]}
                onChange={(e) =>
                  setSsi(prev => ({ ...prev, [key]: Math.max(0, Math.min(25, Number(e.target.value) || 0)) }))
                }
              />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-ink-700">Total: {total} / 100</div>
          <button className="btn btn-primary" onClick={save} disabled={saving || loading}>
            {saving ? "Saving..." : "Save"}
          </button>
        </div>

        <div className="text-xs text-ink-500">Saved to your account so it follows you across devices.</div>
      </div>
    </div>
  );
}
