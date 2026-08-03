export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

export const ADMIN_AUTH_TOKEN_KEY = "mc521_admin_token";
export const ADMIN_AUTH_USER_KEY = "mc521_admin_user";
export const ADMIN_AUTH_LOGGED_IN_KEY = "mc521_admin_logged_in";

// ============ URL Builder ============

export type QueryValue = string | number | boolean | undefined | null;

export function buildUrl(path: string, params?: Record<string, QueryValue>): string {
    const base = API_BASE_URL.replace(/\/$/, "");
    const url = new URL(`${base}${path}`);
    if (params) {
        for (const [key, value] of Object.entries(params)) {
            if (value !== undefined && value !== null && value !== "") {
                url.searchParams.set(key, String(value));
            }
        }
    }
    return url.toString();
}

// ============ Auth Helpers ============

export function getAdminToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(ADMIN_AUTH_TOKEN_KEY);
}

export function setAdminToken(token: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(ADMIN_AUTH_TOKEN_KEY, token);
}

export function getAdminUser(): { email: string; name?: string } | null {
    if (typeof window === "undefined") return null;
    try {
        const raw = localStorage.getItem(ADMIN_AUTH_USER_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export function setAdminUser(user: { email: string; name?: string }): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(ADMIN_AUTH_USER_KEY, JSON.stringify(user));
}

export function isAdminLoggedIn(): boolean {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(ADMIN_AUTH_LOGGED_IN_KEY) === "1";
}

export function markAdminLoggedIn(): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(ADMIN_AUTH_LOGGED_IN_KEY, "1");
}

export function clearAdminAuth(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(ADMIN_AUTH_TOKEN_KEY);
    localStorage.removeItem(ADMIN_AUTH_USER_KEY);
    localStorage.removeItem(ADMIN_AUTH_LOGGED_IN_KEY);
}

export function getAuthHeaders(): Record<string, string> {
    const token = getAdminToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
}

// ============ Response Handling ============

export function unwrapResponseBody(raw: unknown): unknown {
    if (raw && typeof raw === "object" && !Array.isArray(raw)) {
        const obj = raw as Record<string, unknown>;
        if (obj.body !== undefined && obj.status !== undefined) {
            return obj.body;
        }
    }
    return raw;
}

export function unwrapSuccessEnvelope(raw: unknown): unknown {
    if (raw && typeof raw === "object" && !Array.isArray(raw)) {
        const obj = raw as Record<string, unknown>;
        if ("success" in obj && obj.success === false) {
            const msg = typeof obj.message === "string" ? obj.message : "操作失败";
            throw new Error(msg);
        }
        if (obj.data && typeof obj.data === "object" && !Array.isArray(obj.data)) {
            return obj.data;
        }
    }
    return raw;
}

export async function handleResponse<T>(response: Response, opts?: { skipUnwrap?: boolean }): Promise<T> {
    const text = await response.text();

    if (!response.ok) {
        if (response.status === 401 && response.url.includes("/admin/")) {
            clearAdminAuth();
            throw new Error("登录已过期，请重新登录");
        }

        let message: string = response.statusText;
        if (text) {
            try {
                const errorData = JSON.parse(text) as Record<string, unknown>;
                const unwrapped = unwrapResponseBody(errorData) as Record<string, unknown>;
                const msg = unwrapped?.message ?? errorData?.message ?? errorData?.error;
                if (typeof msg === "string") message = msg;
                else if (unwrapped && typeof unwrapped === "object" && "message" in unwrapped) {
                    message = (unwrapped as Record<string, unknown>).message as string;
                }
            } catch {
                // response is not JSON
            }
        }
        throw new Error(message || `请求失败 (${response.status})`);
    }

    if (!text) return {} as T;

    try {
        const parsed = JSON.parse(text);

        if (opts?.skipUnwrap) {
            return parsed as T;
        }

        const unwrapped = unwrapResponseBody(parsed);
        const result = unwrapSuccessEnvelope(unwrapped);

        return result as unknown as T;
    } catch {
        return {} as T;
    }
}

// ============ Session Management ============

let sessionPromise: Promise<void> | null = null;

export async function ensureSession(): Promise<void> {
    if (sessionPromise) return sessionPromise;
    sessionPromise = (async () => {
        try {
            const res = await fetch(buildUrl("/api/feedbacks/me"), {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            });
            if (!res.ok) {
                throw new Error(`Session init failed: ${res.status}`);
            }
            await res.text();
        } catch {
            sessionPromise = null;
            throw new Error("无法建立会话，请检查网络连接后重试");
        }
    })();
    return sessionPromise;
}

// ============ Generic Request ============

export interface RequestOptions {
    method?: "GET" | "POST" | "PATCH" | "DELETE";
    params?: Record<string, QueryValue>;
    body?: unknown;
    adminAuth?: boolean;
    credentials?: "include" | "omit" | "same-origin";
    headers?: Record<string, string>;
    skipUnwrap?: boolean;
}

function resolveBody(body: unknown): { body: BodyInit | undefined; headers: Record<string, string> } {
    if (body === undefined) return { body: undefined, headers: {} };
    if (body instanceof FormData) {
        return { body, headers: {} };
    }
    return {
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
    };
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const {
        method = "GET",
        params,
        body,
        adminAuth = false,
        credentials = "include",
        headers: extraHeaders,
        skipUnwrap,
    } = options;

    const url = buildUrl(path, params);
    const { body: resolvedBody, headers: bodyHeaders } = resolveBody(body);
    const headers: Record<string, string> = { ...bodyHeaders };

    if (adminAuth) {
        Object.assign(headers, getAuthHeaders());
    }

    if (extraHeaders) {
        Object.assign(headers, extraHeaders);
    }

    const response = await fetch(url, {
        method,
        credentials,
        headers,
        body: resolvedBody,
    });

    return handleResponse<T>(response, { skipUnwrap });
}

export async function requestBlob(path: string, options: RequestOptions = {}): Promise<Blob> {
    const { method = "GET", params, body, adminAuth = false, credentials = "include", headers: extraHeaders } = options;

    const url = buildUrl(path, params);
    const { body: resolvedBody, headers: bodyHeaders } = resolveBody(body);
    const headers: Record<string, string> = { ...bodyHeaders };

    if (adminAuth) {
        Object.assign(headers, getAuthHeaders());
    }
    if (extraHeaders) {
        Object.assign(headers, extraHeaders);
    }

    const response = await fetch(url, {
        method,
        credentials,
        headers,
        body: resolvedBody,
    });

    if (!response.ok) {
        const text = await response.text().catch(() => "request failed");
        throw new Error(text || `请求失败 (${response.status})`);
    }

    return response.blob();
}

export function getUrl(path: string, params?: Record<string, QueryValue>): string {
    return buildUrl(path, params);
}
