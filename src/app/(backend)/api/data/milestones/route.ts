import data from "./data.json";
import { NextRequest, NextResponse } from "next/server";
import { withApiLog } from "@/lib/pretty-log";

async function handler(req: NextRequest) {
    return NextResponse.json(data, {
        headers: {
            "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
        },
    });
}

export const GET = withApiLog(handler, { logBody: false }, "GET /api/data/milestones");
