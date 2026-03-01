/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from "next/server";
import mcping from "mcping-js";

export async function GET(req: NextRequest) {
    const host = req.nextUrl.searchParams.get("host");
    const port = parseInt(req.nextUrl.searchParams.get("port") ?? "25565");

    if (!host) return NextResponse.json({ error: "host is required" }, { status: 400 });

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
        return NextResponse.json(result);
    } catch {
        return NextResponse.json({ online: null, max: null, error: true }, { status: 500 });
    }
}
