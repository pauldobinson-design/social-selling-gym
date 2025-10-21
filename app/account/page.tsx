"use client";

import { useSession, signOut } from "next-auth/react";
import { useMockAuth } from "@/lib/mock-auth";

export default function Account() {
  const { data: session } = useSession();
  const { ssi, setSSI } = useMockAuth();

  const name = session?.user?.name ?? "Guest";
  const email = session?.user?.email ?? "";
  const image = (session?.user as any)?.image as string | undefined;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Preferences</h1>

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
        </div>
        <div className="ml-auto flex gap-2">
          <button className="btn" onClick={() => (window.location.href = "/api/auth/signin")}>Change account</button>
          <button className="btn" onClick={() => signOut()}>Sign out</button>
        </div>
      </div>

      <div className="card p-4 space-y-3">
        <div className="font-medium">LinkedIn SSI (local for now)</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            ["brand","Brand"],
            ["people","People"],
            ["insights","Insights"],
            ["relationships","Relationships"]
          ].map(([key, label]) => (
            <div key={key}>
              <label className="label">{label}</label>
              <input
                className="input"
                type="number"
                min={0}
                max={25}
                value={(ssi as any)[key] ?? 0}
                onChange={(e) => setSSI({
                  ...ssi,
                  [key]: Math.max(0, Math.min(25, Number(e.target.value) || 0))
                })}
              />
            </div>
          ))}
        </div>
        <div className="text-sm text-ink-500">These values are stored locally for now. We can move them to a database next.</div>
      </div>
    </div>
  );
}
