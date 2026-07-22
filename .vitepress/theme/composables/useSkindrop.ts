import { ref, type Ref } from "vue";
import {
    downloadSkin,
    getSkinDownloadUrl,
    uploadSkin,
    resolveSkinId,
    SkindropError,
} from "@theme/api/skindrop";

export interface ResolvedSkin {
    id: string;
    url: string;
    blob: Blob;
}

export interface UseSkindropReturn {
    loading: Ref<boolean>;
    error: Ref<string | null>;
    getDownloadUrl: (id: string) => string;
    download: (id: string) => Promise<Blob | null>;
    resolve: (input: string) => Promise<ResolvedSkin | null>;
    upload: (filename: string, file: File) => Promise<string | null>;
}

function formatError(err: unknown): string {
    if (err instanceof SkindropError) {
        return err.message;
    }
    if (err instanceof Error) {
        return err.message;
    }
    return "unknown error";
}

export function useSkindrop(): UseSkindropReturn {
    const loading = ref(false);
    const error = ref<string | null>(null);

    async function download(id: string): Promise<Blob | null> {
        loading.value = true;
        error.value = null;
        try {
            return await downloadSkin(id);
        } catch (err) {
            error.value = formatError(err);
            return null;
        } finally {
            loading.value = false;
        }
    }

    async function resolve(input: string): Promise<ResolvedSkin | null> {
        loading.value = true;
        error.value = null;
        try {
            const id = resolveSkinId(input);
            if (!id) {
                throw new SkindropError("invalid NameMC URL or skin id");
            }
            const blob = await downloadSkin(id);
            const url = URL.createObjectURL(blob);
            return { id, url, blob };
        } catch (err) {
            error.value = formatError(err);
            return null;
        } finally {
            loading.value = false;
        }
    }

    async function upload(filename: string, file: File): Promise<string | null> {
        loading.value = true;
        error.value = null;
        try {
            const result = await uploadSkin(filename, file);
            return result.url;
        } catch (err) {
            error.value = formatError(err);
            return null;
        } finally {
            loading.value = false;
        }
    }

    return {
        loading,
        error,
        getDownloadUrl: getSkinDownloadUrl,
        download,
        resolve,
        upload,
    };
}
