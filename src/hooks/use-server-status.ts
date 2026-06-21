import { useCallback, useState } from "react";

type McStatus = {
    online: number;
    error: boolean;
};

// 简易桩：OnlineIndicator 当前未启用，这里仅返回离线占位状态
export function useMcStatus(_host: string) {
    const [status, setStatus] = useState<McStatus>({ online: 0, error: true });
    const [loading, setLoading] = useState(false);

    const fetchStatus = useCallback(() => {
        setLoading(false);
        setStatus({ online: 0, error: true });
    }, []);

    return { status, loading, fetchStatus };
}
