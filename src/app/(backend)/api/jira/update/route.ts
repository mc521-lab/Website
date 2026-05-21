import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase/supabase-server";
import { withApiLog } from "@/lib/pretty-log";

async function handler(req: NextRequest) {
    const supabase = getSupabaseClient();
    
    try {
        const { searchParams } = new URL(req.url);
        const body = await req.json();

        if (!body || Object.keys(body).length === 0) {
            return NextResponse.json({ success: false, error: "No update data provided" }, { status: 400 });
        }

        if ([...searchParams.keys()].length === 0) {
            return NextResponse.json({ success: false, error: "Missing update condition" }, { status: 400 });
        }

        let query = supabase.from("JiraTickets").update(body);

        // 动态 where 条件（跟你 search 那套一样）
        searchParams.forEach((value, key) => {
            if (value === "") return;

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let parsedValue: any = value;

            if (value === "true") parsedValue = true;
            else if (value === "false") parsedValue = false;
            else if (!isNaN(Number(value))) parsedValue = Number(value);

            query = query.eq(key, parsedValue);
        });

        const { data, error } = await query.select();

        if (error) {
            console.error("Error updating tickets:", error);
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            data,
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error updating tickets:", error);
        return NextResponse.json({ success: false, error: error.message || "Unknown error" }, { status: 500 });
    }
}

export const PATCH = withApiLog(handler, { logBody: true }, "PATCH /api/jira/update");
