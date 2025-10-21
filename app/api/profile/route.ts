// app/api/profile/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/db/supabase";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions as any);
  const email = session?.user?.email;
  if (!email) return NextResponse.json({ ok: false, message: "Not signed in" }, { status: 401 });

  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("user_email", email)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ ok: false, message: `DB error: ${error.message}` }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    profile: data ?? { user_email: email, ssi: { brand: 0, people: 0, insights: 0, relationships: 0 }, xp: 0, updated_at: null }
  });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions as any);
  const email = session?.user?.email;
  if (!email) return NextResponse.json({ ok: false, message: "Not signed in" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const ssi = body?.ssi;
  const deltaXp = Number(body?.deltaXp || 0);

  const validSSI =
    ssi &&
    [ssi.brand, ssi.people, ssi.insights, ssi.relationships].every(
      (n: any) => Number.isFinite(Number(n)) && Number(n) >= 0 && Number(n) <= 25
    );

  const { data: existing, error: readErr } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("user_email", email)
    .maybeSingle();

  if (readErr) return NextResponse.json({ ok: false, message: `DB read error: ${readErr.message}` }, { status: 500 });

  const updates: any = {
    user_email: email,
    updated_at: new Date().toISOString(),
    xp: Math.max(0, (existing?.xp || 0) + (Number.isFinite(deltaXp) ? deltaXp : 0))
  };
  if (validSSI) {
    updates.ssi = {
      brand: Number(ssi.brand),
      people: Number(ssi.people),
      insights: Number(ssi.insights),
      relationships: Number(ssi.relationships)
    };
  }

  const { data, error } = await supabaseAdmin
    .from("profiles")
    .upsert(updates, { onConflict: "user_email" })
    .select()
    .maybeSingle();

  if (error) return NextResponse.json({ ok: false, message: `DB write error: ${error.message}` }, { status: 500 });

  if (deltaXp) {
    await supabaseAdmin.from("xp_events").insert({
      user_email: email,
      amount: deltaXp,
      reason: body?.reason || "manual"
    });
  }

  return NextResponse.json({ ok: true, profile: data });
}
