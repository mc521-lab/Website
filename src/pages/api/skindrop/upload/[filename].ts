import type { APIRoute } from "astro";
import { put } from "@vercel/blob";

export const prerender = false;

export const POST: APIRoute = async ({ params, request }) => {
    const filename = params.filename;
    if (!filename) {
        return new Response("请求错误：URL 中缺少文件名。", { status: 400 });
    }
    const decodedFilename = decodeURIComponent(filename);

    let formData: FormData;
    try {
        formData = await request.formData();
    } catch {
        return new Response("请求错误：无法解析表单数据。", { status: 400 });
    }

    const file = formData.get("file");
    if (!file || !(file instanceof File)) {
        return new Response("请求错误：缺少文件数据。", { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();

    try {
        const { url } = await put(`SkinDrop/${decodedFilename}`, arrayBuffer, {
            access: "public",
            allowOverwrite: true,
            token: process.env.BLOB_READ_WRITE_TOKEN,
        });

        return new Response(JSON.stringify({ success: true, url }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (err: any) {
        return new Response(`上传失败：${err.message || err}`, { status: 502 });
    }
};
