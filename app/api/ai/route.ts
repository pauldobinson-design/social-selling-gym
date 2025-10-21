// app/api/ai/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  return NextResponse.json({
    ok: false,
    message: "AI endpoint not configured. Use /api/analyse-pitch or /api/analyse-post instead.",
    echo: body
  }, { status: 200 });
}
