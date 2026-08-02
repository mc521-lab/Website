import { supabase } from "./supabase";

export async function verifyAdminToken(authHeader: string | undefined): Promise<boolean> {
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : "";
    if (!token) return false;
    const { data, error } = await supabase.auth.getUser(token);
    return !error && !!data.user;
}
