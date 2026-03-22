import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/supabase-server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const { Title, Description, ReporterId, Priority } = body;

        // ✅ 基础校验
        if (!Title || typeof Title !== "string") {
            return NextResponse.json({ success: false, error: "Title is required" }, { status: 400 });
        }

        if (!ReporterId || typeof ReporterId !== "string") {
            return NextResponse.json({ success: false, error: "ReporterId is required" }, { status: 400 });
        }

        if (!Priority) {
            return NextResponse.json({ success: false, error: "Priority is required" }, { status: 400 });
        }

        // ✅ 构造插入数据
        const insertData = {
            Title,
            Description: Description || null,
            ReporterId,
            Priority,

            // 🔒 后端强控
            Status: "Pending", // 👈 你 enum 里应该有
            AssigneeId: null,
        };

        const { data, error } = await supabase.from("JiraTickets").insert(insertData).select().single();

        if (error) {
            console.error("Error creating ticket:", error);
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            data,
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error creating ticket:", error);
        return NextResponse.json({ success: false, error: error.message || "Unknown error" }, { status: 500 });
    }
}
