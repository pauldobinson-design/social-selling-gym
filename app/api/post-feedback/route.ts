export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY as string }) : null;

export async function POST(req: Request) {
  const { text = "", tone = "Trusted Guide" } = await req.json().catch(() => ({}));
  const body = String(text).slice(0, 8000);
  if (!body) return NextResponse.json({ ok: false, message: "Missing text" }, { status: 400 });
  if (!client) {
    const words = body.trim().split(/\s+/).filter(Boolean).length;
    return NextResponse.json({ ok: false, message: "No AI key set", words, inIdealRange: words >= 220 && words <= 280 });
  }

  const prompt = [
    "Assess the LinkedIn post for hook, clarity, credibility, and CTA.",
    "Return JSON { words:number, inIdealRange:boolean, suggestions:string[] }.",
    "Ideal range is 220 to 280 words.",
    `Tone: ${tone}`,
    `Post: """${body}"""`
  ].join("\n");

  const res = await client.responses.create({
    model: "gpt-3.5-turbo",
    input: prompt,
    temperature: 0.3,
    response_format: { type: "json_object" }
  });

  const out = (res as any).output_text || (res as any).output?.[0]?.content?.[0]?.text || "{}";
  let data: any = {};
  try { data = JSON.parse(out); } catch { data = {}; }

  const words = Number(data.words) || body.trim().split(/\s+/).filter(Boolean).length;
  const inIdealRange = Boolean(data.inIdealRange ?? (words >= 220 && words <= 280));
  const suggestions = Array.isArray(data.suggestions) ? data.suggestions.slice(0, 5) : [];
  return NextResponse.json({ ok: true, words, inIdealRange, suggestions });
}
