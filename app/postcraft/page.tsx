"use client";

import { useState } from "react";

type Result = {
  ok: boolean;
  words?: number;
  inIdealRange?: boolean;
  suggestions?: string[];
  message?: string;
};

export default function PostCraft() {
  const [text, setText] = useState("");
  const [tone, setTone] = useState("Trusted Guide");
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState<Result | null>(null);

  async function getFeedback() {
    setLoading(true);
    setRes(null);
    try {
      const r = await fetch("/api/post-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, tone }),
        cache: "no-store",
      });
      const j = (await r.json()) as Result;
      setRes(j);
    } catch {
      setRes({ ok: false, message: "Network error" });
    }
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">PostCraft</h1>

      <div className="card p-4 space-y-3">
        <div className="grid gap-2">
          <label className="label">Tone</label>
          <select className="input max-w-xs" value={tone} onChange={(e) => setTone(e.target.value)}>
            <option>Trusted Guide</option>
            <option>Sharp & Direct</option>
            <option>Conversational</option>
            <option>Data-led</option>
          </select>
        </div>

        <div className="grid gap-2">
          <label className="label">Your draft</label>
          <textarea
            className="textarea"
            placeholder="Paste your LinkedIn post draft here…"
            rows={10}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <button className="btn btn-primary" onClick={getFeedback} disabled={loading || !text.trim()}>
            {loading ? "Thinking…" : "Get feedback"}
          </button>
          <button className="btn" onClick={() => { setText(""); setRes(null); }} disabled={loading}>
            Clear
          </button>
        </div>

        {res && (
          <div className="mt-3 space-y-2">
            {!res.ok && (
              <div className="card p-3 text-sm text-red-600">
                {res.message || "Feedback unavailable. Set OPENAI_API_KEY in Vercel → redeploy."}
              </div>
            )}
            {res.ok && (
              <div className="card p-4 space-y-2">
                <div className="text-sm text-gray-700">
                  Words: <strong>{res.words}</strong>{" "}
                  {typeof res.inIdealRange === "boolean" && (
                    <span className="ml-2 chip">{res.inIdealRange ? "In ideal range" : "Outside ideal range"}</span>
                  )}
                </div>
                {Array.isArray(res.suggestions) && res.suggestions.length > 0 && (
                  <>
                    <div className="font-medium">Suggestions</div>
                    <ul className="list-disc pl-5 text-sm">
                      {res.suggestions.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        <p className="text-xs text-gray-500">
          Tip: We don’t post for you. Refine here, then copy to LinkedIn.
        </p>
      </div>
    </div>
  );
}
