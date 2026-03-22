import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/supabase-server";
import { convertNullsToString } from "@/lib/utils";

export async function GET(req: NextRequest) {
    try {
        // 获取 JiraTickets 数据
        const { data: ticketsData, error: ticketsError } = await supabase
            .from("JiraTickets")
            .select("*")
            .order("created_at", { ascending: false });

        if (ticketsError) {
            console.error("Error fetching tickets:", ticketsError);
            return NextResponse.json({ success: false, error: ticketsError.message }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            data: convertNullsToString(ticketsData) || [],
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error fetching tickets:", error);
        return NextResponse.json({ success: false, error: error.message || "Unknown error" }, { status: 500 });
    }
}
