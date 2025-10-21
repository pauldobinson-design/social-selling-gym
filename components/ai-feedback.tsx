// components/ai-feedback.tsx
"use client";

import { useState } from "react";

type Props = {
  kind: "dm" | "post" | "pitch" | "general";
  seed?: string;
};

export default function AIFeedback({ kind, seed = "" }: Props) {
  const [text, setText] = useState(seed);
  const [loading, setLoading] = useState(false);
  const [out, setOut] = useState<{ summary?: string; nextActions?: string[]; error?: string } | null>(null);

  async function run() {
    setLoading(true);
    setOut(null);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, kind }),
      });
      const json = await res.json();
      if (!json?.ok) {
        setOut({ error: json?.message || "Feedback unavailable" });
      } else {
        setOut({ summary: json.summary, nextActions: json.nextActions });
      }
    } catch {
      setOut({ error: "Network error" });
    }
    setLoading(false);
  }

  return (
    <div className="card p-4 space-y-3">
      <h3 className="text-lg font-semibold">Get AI feedback</h3>
      <textarea
        className="textarea"
        placeholder="Paste your draft here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="flex gap-2">
        <button className="btn btn-primary" onClick={run} disabled={loading || !text.trim()}>
          {loading ? "Thinking..." : "Get feedback"}
        </button>
        <button className="btn" onClick={() => setText("")} disabled={loading}>
          Clear
        </button>
      </div>
      {out?.error && <p className="text-sm text-red-600">Error: {out.error}</p>}
      {out?.summary && (
        <div className="space-y-2">
          <div className="font-medium">Summary</div>
          <p className="text-sm text-gray-800">{out.summary}</p>
          {Array.isArray(out.nextActions) && out.nextActions.length > 0 && (
            <>
              <div className="font-medium">Next actions</div>
              <ul className="list-disc pl-5 text-sm">
                {out.nextActions.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
      <p className="text-xs text-gray-500">
        Tip: If feedback is disabled, add <code>OPENAI_API_KEY</code> in Vercel and redeploy.
      </p>
    </div>
  );
}
