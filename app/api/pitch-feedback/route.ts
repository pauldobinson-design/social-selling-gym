// app/api/pitch-feedback/route.ts
import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const { pitch } = await req.json();
  if (!pitch) return NextResponse.json({ error: "Missing pitch" }, { status: 400 });

  const prompt = `Rate this sales elevator pitch from 1-100 for clarity, relevance, and engagement. 
Return JSON: {score, tips}. Pitch: """${pitch}"""`;

  const res = await client.responses.create({
    model: "gpt-4o-mini",
    input: prompt,
    response_format: { type: "json_object" },
  });

  const data = JSON.parse(res.output[0].content[0].text);
  return NextResponse.json(data);
}
