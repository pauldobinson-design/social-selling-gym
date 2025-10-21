// app/api/post-feedback/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  let body: any = {};
  try { body = await req.json(); } catch {}

  const text = typeof body?.text === "string" ? body.text : "";
  if (!text) {
    return NextResponse.json({ ok: false, message: "Missing 'text'." }, { status: 400 });
  }

  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const inIdealRange = words >= 220 && words <= 280;

  return NextResponse.json({
    ok: true,
    words,
    inIdealRange,
    suggestions: [
      inIdealRange ? "Length is in a good range." : "Aim for 220–280 words.",
      "Lead with a hook that names the risk and outcome.",
      "Add one proof point and a single CTA."
    ]
  });
}
