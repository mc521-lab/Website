"use client";

import { useCallback, useRef, useState } from "react";
import {
    downloadSkin,
    getSkinDownloadUrl,
    resolveSkinId,
    uploadSkin,
    SkindropError,
    type SkinUploadResult,
} from "@/lib/skindrop";

export interface ResolvedSkin {
    id: string;
    url: string;
    blob: Blob;
}

export interface UseSkindropReturn {
    loading: boolean;
    error: string | null;
    lastError: React.MutableRefObject<unknown>;
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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const lastErrorRef = useRef<unknown>(null);

    const download = useCallback(async (id: string): Promise<Blob | null> => {
        setLoading(true);
        setError(null);
        lastErrorRef.current = null;
        try {
            return await downloadSkin(id);
        } catch (err) {
            lastErrorRef.current = err;
            setError(formatError(err));
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const resolve = useCallback(async (input: string): Promise<ResolvedSkin | null> => {
        setLoading(true);
        setError(null);
        lastErrorRef.current = null;
        try {
            const id = resolveSkinId(input);
            if (!id) {
                throw new SkindropError("invalid NameMC URL or skin id");
            }
            const blob = await downloadSkin(id);
            const url = URL.createObjectURL(blob);
            return { id, url, blob };
        } catch (err) {
            lastErrorRef.current = err;
            setError(formatError(err));
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const upload = useCallback(async (filename: string, file: File): Promise<string | null> => {
        setLoading(true);
        setError(null);
        lastErrorRef.current = null;
        try {
            const result: SkinUploadResult = await uploadSkin(filename, file);
            return result.url;
        } catch (err) {
            lastErrorRef.current = err;
            setError(formatError(err));
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        error,
        lastError: lastErrorRef,
        getDownloadUrl: getSkinDownloadUrl,
        download,
        resolve,
        upload,
    };
}
