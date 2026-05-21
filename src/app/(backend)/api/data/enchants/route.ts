import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import { withApiLog } from "@/lib/pretty-log";

const COMPILED_PATH = `${process.cwd()}/public/wiki/item/data/_compiled/enchants.json`;

async function handler(req: NextRequest) {
    const content = await fs.readFile(COMPILED_PATH, "utf-8");
    const data = JSON.parse(content);

    return NextResponse.json(data, {
        headers: {
            "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
        },
    });
}

export const GET = withApiLog(handler, { logBody: false }, "GET /api/data/enchants");
