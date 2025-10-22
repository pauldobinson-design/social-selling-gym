// app/api/post-feedback/route.ts — Gemini 1.5 Flash (free) with v1 endpoint
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

export async function POST(req: Request) {
  const { text = "", tone = "Trusted Guide" } = await req.json().catch(() => ({}));
  const body = String(text).slice(0, 8000).trim();
  if (!body) return NextResponse.json({ ok: false, message: "Missing text" }, { status: 400 });
  if (!GEMINI_API_KEY) return NextResponse.json({ ok: false, message: "No GEMINI_API_KEY set" }, { status: 500 });

  const prompt = [
    "Analyse this LinkedIn post for hook, clarity, credibility, scannability, and CTA.",
    "Return strict JSON: { words:number, inIdealRange:boolean, suggestions:string[] }.",
    "Ideal range is 220–280 words.",
    `Tone: ${tone}`,
    `Post:\n${body}`
  ].join("\n");

  try {
    const r = await fetch(
      // v1 + latest model avoids the 404 you saw on v1beta
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      }
    );

    const txt = await r.text();
    if (!r.ok) {
      // Surface Google’s message to the UI
      return NextResponse.json({ ok: false, message: `Gemini HTTP ${r.status}: ${txt.slice(0, 240)}` }, { status: 500 });
    }

    // Response shape: { candidates: [ { content: { parts: [ { text: "...json..." } ] } } ] }
    let raw = "";
    try { raw = JSON.parse(txt)?.candidates?.[0]?.content?.parts?.[0]?.text || "{}"; } catch { raw = "{}"; }

    let data: any = {};
    try { data = JSON.parse(raw); } catch { data = {}; }

    const words = Number(data.words) || body.split(/\s+/).filter(Boolean).length;
    const inIdealRange = Boolean(data.inIdealRange ?? (words >= 220 && words <= 280));
    const suggestions = Array.isArray(data.suggestions) && data.suggestions.length
      ? data.suggestions.slice(0, 6)
      : [
          "Lead with the outcome or tension in the first 2–3 lines.",
          "Break long blocks into 2–3 line paragraphs for scannability.",
          "Add one quantified proof (%, time saved) for credibility.",
          "Close with a single, specific CTA (comment keyword or DM).",
        ];

    return NextResponse.json({ ok: true, words, inIdealRange, suggestions });
  } catch {
    return NextResponse.json({ ok: false, message: "Gemini request failed" }, { status: 500 });
  }
}
