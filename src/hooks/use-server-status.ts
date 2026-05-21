import { useState, useEffect, useCallback } from "react";

interface ServerStatus {
    online: number | null;
    max: number | null;
    error: boolean;
}

export function useMcStatus(host: string, port = 25565) {
    const [status, setStatus] = useState<ServerStatus>({
        online: null,
        max: null,
        error: false,
    });
    const [loading, setLoading] = useState(false);

    const fetchStatus = useCallback(async () => {
        setLoading(true);
        setStatus({ online: null, max: null, error: false });

        try {
            const res = await fetch(`/api/mc-status?host=${host}&port=${port}`);
            const json = await res.json();
            setStatus(json);
        } catch {
            setStatus({ online: null, max: null, error: true });
        } finally {
            setLoading(false);
        }
    }, [host, port]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchStatus();
        }, 0);
        return () => clearTimeout(timer);
    }, [fetchStatus]);

    return { status, loading, fetchStatus };
}
