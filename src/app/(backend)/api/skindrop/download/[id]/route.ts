import { NextRequest, NextResponse } from "next/server";
import { fetchSkin } from "@/lib/puppeteer";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id?: string }> }) {
    const { id } = await params;

    if (!id || !/^[0-9a-fA-F]{6,64}$/.test(id)) {
        return new NextResponse("invalid skin id", { status: 400 });
    }

    try {
        // 直接用 puppeteer 拿图片 buffer
        const buffer = await fetchSkin(id);

        return new NextResponse(Uint8Array.from(buffer), {
            status: 200,
            headers: {
                "content-type": "image/png",
                "cache-control": "public, max-age=86400, stale-while-revalidate=3600",
            },
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        console.error("puppeteer failed:", err);

        // 👉 fallback（非常关键）
        const fallbackUrl = `https://s.namemc.com/i/${id}.png`;

        const resp = await fetch(fallbackUrl);

        if (!resp.ok) {
            return new NextResponse("failed to fetch skin", {
                status: resp.status,
            });
        }

        return new NextResponse(resp.body, {
            headers: {
                "content-type": "image/png",
            },
        });
    }
}
