import { defineEventHandler, sendStream, createError } from "h3";

export default defineEventHandler(async (event) => {
    const id = event.context.params?.id;

    // 检查 id 格式（基本防御：hex 字符串 6-64 长度）
    if (!id || !/^[0-9a-fA-F]{6,64}$/.test(id)) {
        throw createError({ statusCode: 400, statusMessage: "invalid skin id" });
    }

    const imageUrl = `https://s.namemc.com/i/${id}.png`;

    // 拉取远端图片
    const resp = await fetch(imageUrl, {
        method: "GET",
        credentials: "omit",
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36",
            Accept: "image/*,*/*;q=0.8",
            Referer: "https://namemc.com/",
        },
    });

    if (!resp.ok) {
        throw createError({ statusCode: resp.status, statusMessage: `failed to fetch image (${resp.status})` });
    }

    const contentType = resp.headers.get("content-type") ?? "application/octet-stream";
    if (!contentType.startsWith("image/")) {
        throw createError({ statusCode: 502, statusMessage: "remote resource is not an image" });
    }

    const headers = {
        "content-type": contentType,
        "cache-control": "public, max-age=86400, stale-while-revalidate=3600",
        ...(resp.headers.get("content-length") ? { "content-length": resp.headers.get("content-length")! } : {}),
    };

    // 设置响应头
    for (const [k, v] of Object.entries(headers)) {
        event.node.res.setHeader(k, v);
    }
    // 返回
    return sendStream(event, resp.body!);
});
