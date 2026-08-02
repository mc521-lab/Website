const HEIMDALL_BASE_URL = "https://heimdall.honoka.cafe";

export type HeimdallStatus = "VERIFIED" | "UNVERIFIED" | "BLACKLISTED" | "RATE_LIMITED" | "ERROR";

export interface HeimdallResponse {
    Resp: {
        status: HeimdallStatus;
        [key: string]: unknown;
    };
}

export interface HeimdallCheckResult {
    passed: boolean;
    illegal: boolean;
    reason?: string;
}

const SKIP_STATUSES = new Set([204, 401, 429, 500]);

export async function checkHeimdall(uuid: string): Promise<HeimdallCheckResult> {
    const url = `${HEIMDALL_BASE_URL}/api/v1/query/uuid/${encodeURIComponent(uuid)}?before=30`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10_000);

    try {
        const resp = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
            cache: "no-store",
            signal: controller.signal,
        });

        if (resp.status === 200) {
            const body = (await resp.json()) as HeimdallResponse;
            const status = body?.Resp?.status;

            if (status === "VERIFIED") {
                return { passed: true, illegal: false };
            }

            return {
                passed: false,
                illegal: true,
                reason: `Heimdall status: ${status ?? "UNKNOWN"}`,
            };
        }

        if (SKIP_STATUSES.has(resp.status)) {
            return { passed: true, illegal: false };
        }

        return {
            passed: false,
            illegal: true,
            reason: `Heimdall HTTP ${resp.status}`,
        };
    } catch {
        return {
            passed: true,
            illegal: false,
        };
    } finally {
        clearTimeout(timeoutId);
    }
}

