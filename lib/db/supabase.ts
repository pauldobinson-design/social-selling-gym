// lib/db/supabase.ts
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRole = process.env.SUPABASE_SERVICE_ROLE!;

// Server-only service client. Do NOT import this in client components.
export const supabaseAdmin = createClient(url, serviceRole, {
  auth: { persistSession: false },
});
