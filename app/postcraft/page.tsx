"use client";

import { useState } from "react";
import FormatToolbar from "@/components/format-toolbar";
import PostPreview from "@/components/post-preview";
import { formatText } from "@/lib/formatter";

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

  const stats = formatText.stats(text);

  async function getFeedback() {
    setLoading(true);
    setRes(null);
    try {
      const r = await fetch("/api/post-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, tone }),
        cache: "no-store"
      });
      const j = (await r.json()) as Result;
      setRes(j);
    } catch {
      setRes({ ok: false, message: "Network error" });
    }
    setLoading(false);
  }

  function copyRaw() { navigator.clipboard.writeText(text).catch(() => {}); }
  function copyClean() {
    const clean = text.replace(/\*\*(.+?)\*\*/g, "$1").replace(/_(.+?)_/g, "$1");
    navigator.clipboard.writeText(clean).catch(() => {});
  }

  const ctas = [
    "Want the checklist? Comment 'checklist' and I'll share",
    "DM me 'framework' and I’ll send the 1-pager",
    "If this resonates, follow for weekly playbooks",
    "We built a free template. Comment 'template'"
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">PostCraft</h1>

      <div className="card p-4 space-y-4">
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="label">Tone</label>
            <select className="input max-w-xs" value={tone} onChange={(e) => setTone(e.target.value)}>
              <option>Trusted Guide</option>
              <option>Sharp & Direct</option>
              <option>Conversational</option>
              <option>Data-led</option>
            </select>
          </div>
          <div className="ml-auto flex gap-2">
            <button className="btn" onClick={() => setText("")}>Clear</button>
            <button className="btn" onClick={copyRaw}>Copy</button>
            <button className="btn" onClick={copyClean}>Copy clean</button>
            <button className="btn btn-primary" onClick={getFeedback} disabled={loading || !text.trim()}>
              {loading ? "Thinking…" : "Get feedback"}
            </button>
          </div>
        </div>

        <FormatToolbar value={text} onChange={setText} textareaId="post-draft" />

        <div className="flex flex-wrap gap-2">
          {ctas.map((c) => (
            <button
              key={c}
              className="btn"
              onClick={() => setText((t) => (t.trim().endsWith("\n") ? t + c : t + "\n\n" + c))}
            >
              + {c.replace(/'.+?'/, "…")}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="label">Your draft</label>
            <textarea
              id="post-draft"
              className="textarea"
              placeholder="Paste or write your LinkedIn post…"
              rows={16}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="mt-2 text-xs text-gray-600">
              Words: <strong>{stats.words}</strong>, Characters: <strong>{stats.chars}</strong>, Lines: <strong>{stats.lines}</strong>{" "}
              {stats.words > 0 && (
                <span className="ml-2 chip">
                  {stats.idealWords ? "In 220–280 sweet spot" : "Outside ideal range"}
                </span>
              )}
            </div>
          </div>
          <div>
            <label className="label">Preview</label>
            <PostPreview text={text} author={{ name: "You", title: "Social Seller" }} />
          </div>
        </div>

        {res && (
          <div className="space-y-2">
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
                    <span className="ml-2 chip">
                      {res.inIdealRange ? "In ideal range" : "Outside ideal range"}
                    </span>
                  )}
                </div>
                {Array.isArray(res.suggestions) && res.suggestions.length > 0 && (
                  <>
                    <div className="font-medium">Suggestions</div>
                    <ul className="list-disc pl-5 text-sm">
                      {res.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        <p className="text-xs text-gray-500">
          Formatter changes your text; preview approximates LinkedIn’s look for readability.
        </p>
      </div>
    </div>
  );
}
