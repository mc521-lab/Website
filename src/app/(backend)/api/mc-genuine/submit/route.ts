// app/api/minecraft/submit/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase/supabase-server";
import { withApiLog } from "@/lib/pretty-log";

async function handler(req: NextRequest) {
    const supabase = getSupabaseClient();
    
    try {
        const body = await req.json();
        const { playerName, playerUuid, successful, failureReason } = body;

        if (!playerName || typeof successful !== "boolean") {
            return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
        }

        let successRecordId: string | null = null;

        // 如果成功，先插入 MinecraftEligibilityVerificationResult
        if (successful) {
            const { data: resultData, error: resultError } = await supabase
                .from("MinecraftEligibilityVerificationResult")
                .insert({ PlayerName: playerName, PlayerUuid: playerUuid })
                .select("id")
                .single();

            if (resultError) {
                return NextResponse.json({ success: false, error: resultError.message }, { status: 500 });
            }

            successRecordId = resultData.id;
        }

        // 插入 MinecraftEligibilityVerificationAttempt
        const { data: attemptData, error: attemptError } = await supabase
            .from("MinecraftEligibilityVerificationAttempt")
            .insert({
                PlayerName: playerName,
                Successful: successful,
                SuccessRecord: successRecordId,
                FailureReason: successful ? null : failureReason || "UNKNOWN_ERR",
            })
            .select("id")
            .single();

        if (attemptError) {
            return NextResponse.json({ success: false, error: attemptError.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, attemptRecordId: attemptData.id, successRecordId });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message || "Unknown error" }, { status: 500 });
    }
}

export const POST = withApiLog(handler, { logBody: true }, "POST /api/mc-genuine/submit");
