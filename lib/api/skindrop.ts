import { request, requestBlob, getUrl } from "./client";

const SKIN_ID_PATTERN = /^[0-9a-fA-F]{6,64}$/;
const NAMEMC_URL_PATTERN = /^(?:https?:\/\/)?(?:[a-z]{2}\.)?namemc\.com\/skin\/([0-9a-fA-F]{6,64})(?:\?.*)?$/;
const NAMEMC_IMAGE_PATTERN = /^(?:https?:\/\/)?s\.namemc\.com\/i\/([0-9a-fA-F]{6,64})\.png$/;

export class SkindropError extends Error {
    constructor(
        message: string,
        public readonly status?: number
    ) {
        super(message);
        this.name = "SkindropError";
    }
}

export interface SkinUploadResult {
    success: true;
    url: string;
}

export interface ResolvedSkinSource {
    id: string;
    url: string;
}

function assertValidSkinId(id: string): void {
    if (!SKIN_ID_PATTERN.test(id)) {
        throw new SkindropError("invalid skin id");
    }
}

/**
 * 从用户输入（NameMC URL、皮肤图片 URL 或纯 ID）中解析皮肤 ID。
 */
export function resolveSkinId(input: string): string | null {
    const trimmed = input.trim();
    if (!trimmed) return null;

    if (SKIN_ID_PATTERN.test(trimmed)) {
        return trimmed.toLowerCase();
    }

    const urlMatch = trimmed.match(NAMEMC_URL_PATTERN);
    if (urlMatch) {
        return urlMatch[1].toLowerCase();
    }

    const imageMatch = trimmed.match(NAMEMC_IMAGE_PATTERN);
    if (imageMatch) {
        return imageMatch[1].toLowerCase();
    }

    return null;
}

/**
 * 获取皮肤下载 URL（不发起请求）。
 */
export function getSkinDownloadUrl(id: string): string {
    assertValidSkinId(id);
    return getUrl(`/api/skindrop/download/${id}`);
}

/**
 * 从 NameMC 下载指定 ID 的皮肤图片。
 */
export async function downloadSkin(id: string): Promise<Blob> {
    assertValidSkinId(id);
    return requestBlob(`/api/skindrop/download/${id}`);
}

/**
 * 上传皮肤文件到服务器。
 */
export async function uploadSkin(filename: string, file: File): Promise<SkinUploadResult> {
    const encodedFilename = encodeURIComponent(filename);
    const formData = new FormData();
    formData.append("file", file);

    try {
        return await request<SkinUploadResult>(`/api/skindrop/upload/${encodedFilename}`, {
            method: "POST",
            body: formData,
            skipUnwrap: true,
        });
    } catch (err) {
        if (err instanceof SkindropError) throw err;
        const message = err instanceof Error ? err.message : "上传失败";
        throw new SkindropError(message);
    }
}
