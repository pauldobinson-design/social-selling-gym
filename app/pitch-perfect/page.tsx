"use client";

import { useState } from "react";

export default function PitchPerfect() {
  const [form, setForm] = useState<any>({
    industry: "", audience: "", problem: "", outcome: "", proof: "", differentiator: "", cta: "", pitch: ""
  });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function analyse() {
    setLoading(true);
    const res = await fetch("/api/analyse-pitch", { method: "POST", body: JSON.stringify(form) });
    const json = await res.json();
    setResult(json);
    setLoading(false);
  }

  function onChange(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Pitch Perfect</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          ["industry","Industry"],["audience","Target audience"],["problem","Problem"],["outcome","Outcome"],
          ["proof","Proof"],["differentiator","Differentiator"],["cta","CTA"]
        ].map(([k,label]) => (
          <div key={k}>
            <label className="label">{label}</label>
            <input className="input" name={k} value={form[k]} onChange={onChange} />
          </div>
        ))}
        <div className="md:col-span-2">
          <label className="label">Your pitch</label>
          <textarea className="input h-40" name="pitch" value={form.pitch} onChange={onChange} />
        </div>
      </div>
      <button className="btn btn-primary" onClick={analyse} disabled={loading}>{loading ? "Analysing..." : "Analyse my pitch"}</button>

      {result && (
        <div className="card p-4 space-y-3">
          <div className="text-lg font-semibold">Score {result.score}/100</div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
            {Object.entries(result.subscores).map(([k,v]) => (
              <div key={k} className="flex items-center justify-between rounded-xl border border-ink-100 px-3 py-2">
                <span className="capitalize">{k}</span>
                <span>{v as number}</span>
              </div>
            ))}
          </div>
          <div>
            <div className="font-medium">Edits</div>
            <ul className="list-disc pl-5 text-sm space-y-1">
              {result.edits.map((e: string, i: number) => <li key={i}>{e}</li>)}
            </ul>
          </div>
          <div>
            <div className="font-medium">Tighter version</div>
            <p className="text-ink-700">{result.tighterVersion}</p>
          </div>
        </div>
      )}
    </div>
  );
}
