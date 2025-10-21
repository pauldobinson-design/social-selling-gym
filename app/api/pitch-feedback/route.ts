// app/api/pitch-feedback/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  let body: any = {};
  try { body = await req.json(); } catch {}

  const pitch = typeof body?.pitch === "string" ? body.pitch : "";
  if (!pitch) {
    return NextResponse.json({ ok: false, message: "Missing 'pitch'." }, { status: 400 });
  }

  // Simple placeholder scoring so build works without external SDKs.
  const words = pitch.trim().split(/\s+/).filter(Boolean).length;
  const score = Math.max(40, Math.min(100, 75 + Math.floor((200 - Math.abs(200 - words)) / 20)));

  return NextResponse.json({
    ok: true,
    score,
    tips: [
      "Tighten your hook to one sentence.",
      "Swap vague claims for a number.",
      "Close with a single clear CTA."
    ]
  });
}
