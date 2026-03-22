import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/supabase-server";
import { convertNullsToString } from "@/lib/utils";

export async function GET(req: NextRequest) {
    try {
        // 获取验证结果数据
        const { data: resultsData, error: resultsError } = await supabase
            .from("MinecraftEligibilityVerificationResult")
            .select("*")
            .order("created_at", { ascending: false });

        if (resultsError) {
            console.error("Error fetching results:", resultsError);
            return NextResponse.json({ success: false, error: resultsError.message }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            data: convertNullsToString(resultsData) || [],
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error fetching data:", error);
        return NextResponse.json({ success: false, error: error.message || "Unknown error" }, { status: 500 });
    }
}
