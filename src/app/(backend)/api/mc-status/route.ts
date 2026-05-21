/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from "next/server";
import mcping from "mcping-js";
import { withApiLog } from "@/lib/pretty-log";

// 简单的内存缓存
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 30 * 1000; // 30秒缓存

async function handler(req: NextRequest) {
    const host = req.nextUrl.searchParams.get("host");
    const port = parseInt(req.nextUrl.searchParams.get("port") ?? "25565");

    if (!host) return NextResponse.json({ error: "host is required" }, { status: 400 });

    const cacheKey = `${host}:${port}`;
    const cached = cache.get(cacheKey);

    // 检查缓存是否有效
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return NextResponse.json(cached.data, {
            headers: {
                "X-Cache": "HIT",
                "Cache-Control": "public, max-age=30",
            },
        });
    }

    try {
        const server = new mcping.MinecraftServer(host, port);

        const data: Promise<any> = new Promise((resolve) => {
            server.ping(5000, undefined, (err: any, res: any) => {
                if (err || !res || !res.players) resolve({ online: null, max: null, error: true });
                else
                    resolve({
                        online: res.players.online ?? 0,
                        max: res.players.max ?? 0,
                        error: false,
                    });
            });
        });

        const result = await data;

        // 更新缓存
        cache.set(cacheKey, { data: result, timestamp: Date.now() });

        return NextResponse.json(result, {
            headers: {
                "X-Cache": "MISS",
                "Cache-Control": "public, max-age=30",
            },
        });
    } catch {
        return NextResponse.json({ online: null, max: null, error: true }, { status: 500 });
    }
}

export const GET = withApiLog(handler, { logBody: false }, "GET /api/mc-status");
