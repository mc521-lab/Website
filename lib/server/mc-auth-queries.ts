import { supabase } from "./supabase";
import type { McAuthRow, McAuthListItem, McAuthCheckResult, McAuthListFilters, Pagination, ListResult } from "./types";

function toListItem(row: McAuthRow): McAuthListItem {
    return {
        id: row.id,
        accountXuid: row.account_xuid,
        accountName: row.account_name,
        hasValidMcje: row.has_valid_mcje,
        invalidReason: row.invalid_reason,
        checkedByAdmin: row.checked_by_admin,
        createdAt: row.created_at,
    };
}

function buildListQuery(filters: McAuthListFilters) {
    let query = supabase.from("mc_auth").select("*", { count: "exact" });

    if (filters.xuid) query = query.eq("account_xuid", filters.xuid);
    if (typeof filters.hasValidMcje === "boolean") query = query.eq("has_valid_mcje", filters.hasValidMcje);
    if (typeof filters.checkedByAdmin === "boolean") query = query.eq("checked_by_admin", filters.checkedByAdmin);
    if (filters.search) query = query.ilike("account_name", `%${filters.search}%`);

    return query.order("created_at", { ascending: false });
}

export async function submitMcAuth(input: {
    accountXuid: string;
    accountName: string;
    hasValidMcje: boolean;
    invalidReason?: string | null;
}): Promise<McAuthListItem> {
    const { data, error } = await supabase
        .from("mc_auth")
        .insert({
            account_xuid: input.accountXuid,
            account_name: input.accountName,
            has_valid_mcje: input.hasValidMcje,
            invalid_reason: input.invalidReason ?? null,
            checked_by_admin: false,
        })
        .select("*")
        .single();

    if (error) throw error;
    if (!data) throw new Error("Failed to create mc_auth record");

    return toListItem(data as McAuthRow);
}

export async function checkMcAuth(xuid: string): Promise<McAuthCheckResult> {
    const { data, error } = await supabase
        .from("mc_auth")
        .select("account_xuid, account_name, has_valid_mcje, checked_by_admin, invalid_reason")
        .eq("account_name", xuid)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

    if (error) throw error;

    if (!data) {
        return { exists: false, hasValidMcje: false, checkedByAdmin: false };
    }

    const row = data as McAuthRow;
    return {
        exists: true,
        accountXuid: row.account_xuid,
        accountName: row.account_name,
        hasValidMcje: row.has_valid_mcje,
        checkedByAdmin: row.checked_by_admin,
        invalidReason: row.invalid_reason,
    };
}

export async function listMcAuth(filters: McAuthListFilters, pagination: Pagination): Promise<ListResult<McAuthListItem>> {
    const from = (pagination.page - 1) * pagination.pageSize;
    const to = from + pagination.pageSize - 1;

    const { data, error, count } = await buildListQuery(filters).range(from, to);
    if (error) throw error;

    const rows = (data ?? []) as McAuthRow[];

    return {
        items: rows.map(toListItem),
        total: count ?? 0,
    };
}

export async function markMcAuthChecked(id: string): Promise<void> {
    const { error } = await supabase.from("mc_auth").update({ checked_by_admin: true }).eq("id", id);

    if (error) throw error;
}

export async function deleteMcAuth(id: string): Promise<void> {
    const { error } = await supabase.from("mc_auth").delete().eq("id", id);
    if (error) throw error;
}

