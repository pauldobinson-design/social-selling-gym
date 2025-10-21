// app/api/feedback/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  let body: any = {};
  try { body = await req.json(); } catch {}

  const text = typeof body?.text === "string" ? body.text : "";
  const kind = typeof body?.kind === "string" ? body.kind : "general";

  if (!text || text.length < 10) {
    return NextResponse.json(
      { ok: false, message: "Please include feedback text of at least 10 characters." },
      { status: 400 }
    );
  }

  // In a real app, persist to a DB or send to a queue here.
  return NextResponse.json({
    ok: true,
    received: { kind, length: text.length }
  });
}
