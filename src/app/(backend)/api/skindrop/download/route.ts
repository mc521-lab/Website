import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id?: string } }) {
    const id = params.id;

    // 校验 id
    if (!id || !/^[0-9a-fA-F]{6,64}$/.test(id)) {
        return new NextResponse("invalid skin id", { status: 400 });
    }

    const imageUrl = `https://s.namemc.com/i/${id}.png`;

    const resp = await fetch(imageUrl, {
        method: "GET",
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36",
            Accept: "image/*,*/*;q=0.8",
            Referer: "https://namemc.com/",
        },
        // 避免 Next.js cache 干扰（你自己已经做缓存控制）
        cache: "no-store",
    });

    if (!resp.ok) {
        return new NextResponse(`failed to fetch image (${resp.status})`, {
            status: resp.status,
        });
    }

    const contentType = resp.headers.get("content-type") ?? "application/octet-stream";

    if (!contentType.startsWith("image/")) {
        return new NextResponse("remote resource is not an image", {
            status: 502,
        });
    }

    // 直接透传 stream
    return new NextResponse(resp.body, {
        status: 200,
        headers: {
            "content-type": contentType,
            "cache-control": "public, max-age=86400, stale-while-revalidate=3600",
            ...(resp.headers.get("content-length") ? { "content-length": resp.headers.get("content-length")! } : {}),
        },
    });
}
