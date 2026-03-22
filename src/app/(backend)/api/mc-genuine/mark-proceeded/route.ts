import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function markPlayerProceeded(playerName: string) {
    const { data, error } = await supabase
        .from("MinecraftEligibilityVerificationResult")
        .update({ Proceeded: true })
        .eq("PlayerName", playerName)
        .is("Proceeded", false)
        .select()
        .limit(1)
        .single();

    if (error) {
        console.error("Supabase update error:", error);
        throw new Error(error.message);
    }

    return data;
}

export async function POST(req: NextRequest) {
    try {
        const { playerName } = await req.json();

        if (!playerName) {
            return NextResponse.json({ success: false, error: "Missing playerName" }, { status: 400 });
        }

        await markPlayerProceeded(playerName);

        return NextResponse.json({ success: true });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
