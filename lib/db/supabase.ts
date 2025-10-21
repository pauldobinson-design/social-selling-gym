import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRole = process.env.SUPABASE_SERVICE_ROLE!;

// Node-only admin client (never import in client components)
export const supabaseAdmin = createClient(url, serviceRole, { auth: { persistSession: false } });
