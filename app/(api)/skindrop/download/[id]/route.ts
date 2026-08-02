import { NextRequest, NextResponse } from "next/server";
import { createHandler } from "@/lib/server/with-logger";

const SKIN_ID_PATTERN = /^[0-9a-fA-F]{6,64}$/;

export const GET = createHandler(async (_request: NextRequest, context, log) => {
    const { id } = await context.params;

    if (!SKIN_ID_PATTERN.test(id)) {
        log.warn("Invalid skin id", { id });
        return NextResponse.json({ error: "invalid skin id" }, { status: 400 });
    }

    log.debug("Downloading skin", { id });

    const response = await fetch(`https://s.namemc.com/i/${id}.png`);
    if (!response.ok) {
        log.warn("Failed to fetch skin", { id, status: response.status });
        return NextResponse.json({ error: "failed to fetch skin" }, { status: response.status });
    }

    const buffer = await response.arrayBuffer();
    return new NextResponse(buffer, {
        headers: {
            "content-type": "image/png",
            "cache-control": "public, max-age=86400, stale-while-revalidate=3600",
        },
    });
});
