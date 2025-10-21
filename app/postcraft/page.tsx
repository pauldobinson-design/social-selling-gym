"use client";

import { useState } from "react";

const TONES = ["Challenger","Trusted Guide","Earned Humour","Executive Tight"] as const;

export default function PostCraft() {
  const [tone, setTone] = useState<typeof TONES[number]>("Trusted Guide");
  const [text, setText] = useState("");
  const [feedback, setFeedback] = useState<any>(null);

  function insert(lines: string[]) {
    setText(prev => lines.join("\n") + "\n\n" + prev);
  }

  async function getFeedback() {
    const res = await fetch("/api/analyse-post", { method: "POST", body: JSON.stringify({ text, tone }) });
    const json = await res.json();
    setFeedback(json);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">PostCraft</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="flex gap-3 items-center">
            <select className="input max-w-xs" value={tone} onChange={(e) => setTone(e.target.value as any)}>
              {TONES.map(t => <option key={t}>{t}</option>)}
            </select>
            <button className="btn" onClick={() => insert([
              "Hook: Name the risk and the outcome.",
              "Angle: Add one useful insight.",
              "Close: Invite a simple next step."
            ])}>Hook suggestions</button>
            <button className="btn" onClick={() => insert([
              "CTA: Comment 'guide' and I will share the checklist.",
              "CTA: DM if you want the 1 pager.",
              "CTA: Want the template? Say 'template'."
            ])}>CTA suggestions</button>
          </div>
          <textarea className="input h-96" value={text} onChange={(e) => setText(e.target.value)} />
          <div className="text-sm text-ink-500">Aim for 220 to 280 words.</div>
          <button className="btn btn-primary" onClick={getFeedback}>Get feedback</button>
          {feedback && (
            <div className="card p-4 text-sm space-y-2">
              <div>Length: {feedback.length} words {feedback.inIdealRange ? "(ideal range)" : "(tweak length)"} </div>
              <ul className="list-disc pl-5">
                {feedback.tips.map((t: string, i: number) => <li key={i}>{t}</li>)}
              </ul>
            </div>
          )}
        </div>
        <div className="card p-4 whitespace-pre-wrap">{text || "Preview will appear here with LinkedIn friendly line breaks."}</div>
      </div>
    </div>
  );
}
