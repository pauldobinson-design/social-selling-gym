// app/api/profile/route.ts
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

  if (error) return NextResponse.json({ ok: false, message: error.message }, { status: 500 });

  // If not found, return sensible default (do not auto-create on read)
  return NextResponse.json({
    ok: true,
    profile: data ?? {
      user_email: email,
      ssi: { brand: 0, people: 0, insights: 0, relationships: 0 },
      xp: 0,
      updated_at: null
    }
  });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions as any);
  const email = session?.user?.email;
  if (!email) return NextResponse.json({ ok: false, message: "Not signed in" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const ssi = body?.ssi;
  const deltaXp = Number(body?.deltaXp || 0);

  // Validate SSI shape if provided
  const validSSI =
    ssi &&
    [ssi.brand, ssi.people, ssi.insights, ssi.relationships].every(
      (n: any) => Number.isFinite(Number(n)) && Number(n) >= 0 && Number(n) <= 25
    );

  // Upsert profile
  const updates: any = { user_email: email, updated_at: new Date().toISOString() };
  if (validSSI) updates.ssi = {
    brand: Number(ssi.brand),
    people: Number(ssi.people),
    insights: Number(ssi.insights),
    relationships: Number(ssi.relationships)
  };

  // First, fetch existing profile to compute xp
  const { data: existing } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("user_email", email)
    .maybeSingle();

  const newXp = Math.max(0, (existing?.xp || 0) + (Number.isFinite(deltaXp) ? deltaXp : 0));
  updates.xp = newXp;

  const { data, error } = await supabaseAdmin
    .from("profiles")
    .upsert(updates, { onConflict: "user_email" })
    .select()
    .maybeSingle();

  if (error) return NextResponse.json({ ok: false, message: error.message }, { status: 500 });

  // If XP changed, write an event
  if (deltaXp) {
    await supabaseAdmin.from("xp_events").insert({
      user_email: email,
      amount: deltaXp,
      reason: body?.reason || "manual"
    });
  }

  return NextResponse.json({ ok: true, profile: data });
}
