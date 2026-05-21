import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase/supabase-server";
import { withApiLog } from "@/lib/pretty-log";

async function handler(req: NextRequest) {
    const supabase = getSupabaseClient();

    try {
        const { playerName } = await req.json();

        if (!playerName) {
            return NextResponse.json({ success: false, error: "Missing playerName" }, { status: 400 });
        }

        const { data: resultData, error: resultError } = await supabase
            .from("MinecraftEligibilityVerificationResult")
            .select("id")
            .eq("PlayerName", playerName)
            .limit(1)
            .single();

        if (resultError || !resultData) {
            return NextResponse.json({ success: true, exists: false });
        }

        const { data: attemptData, error: attemptError } = await supabase
            .from("MinecraftEligibilityVerificationAttempt")
            .select("id")
            .eq("PlayerName", playerName)
            .eq("Successful", true)
            .eq("SuccessRecord", resultData.id)
            .limit(1)
            .single();

        if (attemptError || !attemptData) {
            return NextResponse.json({ success: true, exists: false });
        }

        return NextResponse.json({
            success: true,
            exists: true,
            attemptRecordId: attemptData.id,
            successRecordId: resultData.id,
        });
    } catch (err: unknown) {
        const error = err instanceof Error ? err.message : "Unknown error";
        return NextResponse.json({ success: false, error }, { status: 500 });
    }
}

export const POST = withApiLog(handler, { logBody: true }, "POST /api/mc-genuine/check-existing");
