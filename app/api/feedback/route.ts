export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

export async function POST(req: Request) {
  const { text = "", kind = "general" } = await req.json().catch(() => ({}));
  const body = String(text).slice(0, 8000);
  if (!body) return NextResponse.json({ ok: false, message: "Missing text" }, { status: 400 });
  if (!client) return NextResponse.json({ ok: false, message: "No AI key set" });

  const prompt = [
    `Give concise, practical feedback for kind="${kind}".`,
    "Focus on clarity, personalisation, and outcomes.",
    "Return JSON { summary:string, nextActions:string[] }.",
    `Text: """${body}"""`
  ].join("\n");

  const res = await client.responses.create({
    model: "gpt-4o-mini",
    input: prompt,
    temperature: 0.3,
    response_format: { type: "json_object" }
  });

  const out = (res as any).output_text || (res as any).output?.[0]?.content?.[0]?.text || "{}";
  let data: any = {};
  try { data = JSON.parse(out); } catch { data = {}; }

  return NextResponse.json({
    ok: true,
    summary: String(data.summary || "").slice(0, 1000),
    nextActions: Array.isArray(data.nextActions) ? data.nextActions.slice(0, 5) : []
  });
}
