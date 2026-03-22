import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/supabase-server";
import { convertNullsToString } from "@/lib/utils";

export async function GET(req: NextRequest) {
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
