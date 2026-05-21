import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase/supabase-server";
import { convertNullsToString } from "@/lib/utils";
import { withApiLog } from "@/lib/pretty-log";

async function handler(req: NextRequest) {
    const supabase = getSupabaseClient();
    
    try {
        const { searchParams } = new URL(req.url);

        let query = supabase.from("JiraTickets").select("*");

        // 遍历 query KV
        searchParams.forEach((value, key) => {
            if (value === "") return;

            // 简单类型转换（可按你数据库字段再优化）
            let parsedValue: unknown = value;

            if (value === "true") parsedValue = true;
            else if (value === "false") parsedValue = false;
            else if (!isNaN(Number(value))) parsedValue = Number(value);

            query = query.eq(key, parsedValue);
        });

        // 默认排序
        query = query.order("created_at", { ascending: false });

        const { data, error } = await query;

        if (error) {
            console.error("Error fetching tickets:", error);
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            data: convertNullsToString(data) || [],
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error fetching tickets:", error);
        return NextResponse.json({ success: false, error: error.message || "Unknown error" }, { status: 500 });
    }
}

export const GET = withApiLog(handler, { logBody: false }, "GET /api/jira/search");
