import type { APIRoute } from "astro";

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
    const id = params.id;

    if (!id || !/^[0-9a-fA-F]{6,64}$/.test(id)) {
        return new Response("invalid skin id", { status: 400 });
    }

    try {
        const fallbackUrl = `https://s.namemc.com/i/${id}.png`;
        const resp = await fetch(fallbackUrl);

        if (!resp.ok) {
            return new Response("failed to fetch skin", {
                status: resp.status,
            });
        }

        const buffer = await resp.arrayBuffer();

        return new Response(buffer, {
            status: 200,
            headers: {
                "content-type": "image/png",
                "cache-control": "public, max-age=86400, stale-while-revalidate=3600",
            },
        });
    } catch (err: any) {
        console.error("fetch skin failed:", err);
        return new Response("failed to fetch skin", { status: 500 });
    }
};
