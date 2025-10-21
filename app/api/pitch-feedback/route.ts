import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

export async function POST(req: Request) {
  const { pitch = "" } = await req.json().catch(() => ({}));
  const text = String(pitch).slice(0, 8000);
  if (!text) return NextResponse.json({ ok: false, message: "Missing pitch" }, { status: 400 });
  if (!client) return NextResponse.json({ ok: false, message: "No AI key set" });

  const prompt = [
    "Score this B2B elevator pitch out of 100 and give three improvement tips.",
    "Focus on clarity, audience fit, outcome, proof, brevity, and voice.",
    "Return JSON: { score:number, tips:string[] }",
    `Pitch: """${text}"""`
  ].join("\n");

  const res = await client.responses.create({
    model: "gpt-4o-mini",
    input: prompt,
    temperature: 0.3,
    response_format: { type: "json_object" }
  });

  // The SDK returns a structured object; pull the text safely
  const out = res.output_text || (res as any).output?.[0]?.content?.[0]?.text || "{}";
  let data: any = {};
  try { data = JSON.parse(out); } catch { data = {}; }

  const score = Math.max(0, Math.min(100, Number(data.score) || 0));
  const tips = Array.isArray(data.tips) ? data.tips.slice(0, 3) : [];
  return NextResponse.json({ ok: true, score, tips });
}
