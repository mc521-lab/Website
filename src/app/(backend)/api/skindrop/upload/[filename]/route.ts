import { NextRequest } from "next/server";
import { put } from "@vercel/blob";

// 辅助函数：把 multipart/form-data 转成 ArrayBuffer
async function parseFileFromRequest(req: NextRequest): Promise<{ data: ArrayBuffer; name: string } | null> {
    const formData = await req.formData();
    const file = formData.get("file");
    if (!file || !(file instanceof File)) return null;

    const arrayBuffer = await file.arrayBuffer();
    return { data: arrayBuffer, name: file.name };
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ filename?: string }> }) {
    // URL 文件名
    const { filename } = await params;
    if (!filename) {
        return new Response("请求错误：URL 中缺少文件名。", { status: 400 });
    }
    const decodedFilename = decodeURIComponent(filename);

    // 读取上传文件
    const fileData = await parseFileFromRequest(req);
    if (!fileData) {
        return new Response("请求错误：缺少文件数据。", { status: 400 });
    }

    // 上传到 Vercel Blob
    try {
        const { url } = await put(`SkinDrop/${decodedFilename}`, fileData.data, { access: "public" });

        // 成功返回
        return new Response(JSON.stringify({ success: true, url }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        return new Response(`上传失败：${err.message || err}`, { status: 502 });
    }
}
