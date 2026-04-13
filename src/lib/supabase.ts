import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Public client — for browser / public server reads
export const supabase = createClient(url, anon);

// Admin client — for API routes and server actions that need full access
export const supabaseAdmin = createClient(url, service);
