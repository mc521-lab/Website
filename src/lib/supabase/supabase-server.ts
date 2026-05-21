import { createClient } from "@supabase/supabase-js";

export function getSupabaseClient() {
    const supabaseUrl = process.env.SUPABASE_URL!;
    const supabseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    return createClient(supabaseUrl, supabseServiceRoleKey);
}
