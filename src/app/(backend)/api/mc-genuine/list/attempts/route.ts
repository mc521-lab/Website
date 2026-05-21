import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase/supabase-server";
import { convertNullsToString } from "@/lib/utils";
import { withApiLog } from "@/lib/pretty-log";

async function handler(req: NextRequest) {
    const supabase = getSupabaseClient();
    
    try {
        // 获取验证尝试数据
        const { data: attemptsData, error: attemptsError } = await supabase
            .from("MinecraftEligibilityVerificationAttempt")
            .select("*")
            .order("created_at", { ascending: false });

        if (attemptsError) {
            console.error("Error fetching attempts:", attemptsError);
            return NextResponse.json({ success: false, error: attemptsError.message }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            data: convertNullsToString(attemptsData) || [],
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error fetching data:", error);
        return NextResponse.json({ success: false, error: error.message || "Unknown error" }, { status: 500 });
    }
}

export const GET = withApiLog(handler, { logBody: false }, "GET /api/mc-genuine/list/attempts");
