// app/api/post-feedback/route.ts (Gemini 1.5 Flash)
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
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      }
    );

    if (!r.ok) {
      const txt = await r.text().catch(() => "");
      return NextResponse.json({ ok: false, message: `Gemini HTTP ${r.status}: ${txt.slice(0, 200)}` }, { status: 500 });
    }

    const j = await r.json();
    const raw = j?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    let data: any = {};
    try { data = JSON.parse(raw); } catch { data = {}; }

    const words = Number(data.words) || body.split(/\s+/).filter(Boolean).length;
    const inIdealRange = Boolean(data.inIdealRange ?? (words >= 220 && words <= 280));
    const suggestions = Array.isArray(data.suggestions) && data.suggestions.length
      ? data.suggestions.slice(0, 6)
      : [
          "Lead with the outcome or tension in the first 2 lines.",
          "Break long paragraphs into 2–3 lines for scannability.",
          "Add one quantified proof (%, time saved) for credibility.",
          "Use a single, specific CTA (comment keyword or DM)."
        ];

    return NextResponse.json({ ok: true, words, inIdealRange, suggestions });
  } catch (e: any) {
    return NextResponse.json({ ok: false, message: "Gemini request failed" }, { status: 500 });
  }
}
