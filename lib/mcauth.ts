// MC Auth (Minecraft 正版验证) API client

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

// ============ Types ============

export interface McauthRecord {
    id: string;
    accountXuid: string;
    accountName: string;
    hasValidMcje: boolean;
    invalidReason: string | null;
    checkedByAdmin: boolean;
    createdAt: string;
}

export interface McauthListQuery {
    page?: number;
    pageSize?: number;
    xuid?: string;
    hasValidMcje?: boolean;
    checkedByAdmin?: boolean;
    search?: string;
}

export interface McauthListResponse {
    data: McauthRecord[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export interface VerifyPayload {
    msAccessToken: string;
}

export interface DeviceCodeResponse {
    device_code: string;
    user_code: string;
    verification_uri: string;
    expires_in: number;
    interval: number;
    message?: string;
}

export interface TokenPollResult {
    status: "pending" | "slow_down" | "success";
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
}

export interface VerifyResponse {
    success: boolean;
    accountXuid?: string;
    accountName?: string;
    hasValidMcje?: boolean;
    illegal?: boolean;
    error?: string;
}

export interface SubmitPayload {
    accountXuid: string;
    accountName: string;
    hasValidMcje: boolean;
    invalidReason?: string | null;
}

export interface SubmitResponse {
    success: boolean;
    id?: string;
    error?: string;
}

export interface CheckExistingPayload {
    accountXuid: string;
}

export interface CheckExistingResponse {
    success: boolean;
    exists?: boolean;
    record?: McauthRecord;
    error?: string;
}

// ============ Auth helpers ============

export function getAdminToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("mc521_admin_token");
}

function buildUrl(path: string, params?: Record<string, string | number | boolean | undefined>): string {
    const base = API_BASE_URL.replace(/\/$/, "");
    const url = new URL(`${base}${path}`);
    if (params) {
        for (const [key, value] of Object.entries(params)) {
            if (value !== undefined && value !== "") {
                url.searchParams.set(key, String(value));
            }
        }
    }
    return url.toString();
}

function getAuthHeaders(): Record<string, string> {
    const token = getAdminToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse<T>(response: Response): Promise<T> {
    const text = await response.text();

    if (!response.ok) {
        let message = response.statusText;
        if (text) {
            try {
                const errorData = JSON.parse(text);
                message = errorData?.message ?? errorData?.error ?? message;
            } catch {
                // not JSON
            }
        }
        throw new Error(message || `请求失败 (${response.status})`);
    }

    if (!text) return {} as T;

    try {
        const parsed = JSON.parse(text) as Record<string, unknown>;

        if (parsed && typeof parsed === "object" && "success" in parsed && parsed.success === false) {
            const msg = typeof parsed.message === "string" ? parsed.message : "操作失败";
            throw new Error(msg);
        }

        return parsed as unknown as T;
    } catch (e) {
        if (e instanceof Error && e.message) throw e;
        throw new Error("响应解析失败");
    }
}

// ============ Normalization ============

function mapMcauthItem(item: Record<string, unknown>): McauthRecord {
    return {
        id: (item.id as string) ?? "",
        accountXuid: (item.accountXuid as string) ?? (item.account_xuid as string) ?? "",
        accountName: (item.accountName as string) ?? (item.account_name as string) ?? "",
        hasValidMcje: (item.hasValidMcje as boolean) ?? (item.has_valid_mcje as boolean) ?? false,
        invalidReason: (item.invalidReason as string | null) ?? (item.invalid_reason as string | null) ?? null,
        checkedByAdmin: (item.checkedByAdmin as boolean) ?? (item.checked_by_admin as boolean) ?? false,
        createdAt: (item.createdAt as string) ?? (item.created_at as string) ?? "",
    };
}

function normalizeListResponse(raw: unknown, page: number, pageSize: number): McauthListResponse {
    if (Array.isArray(raw)) {
        const items = (raw as Record<string, unknown>[]).map(mapMcauthItem);
        const total = items.length;
        return {
            data: items,
            total,
            page,
            pageSize,
            totalPages: Math.max(1, Math.ceil(total / pageSize)),
        };
    }

    if (raw && typeof raw === "object") {
        let obj = raw as Record<string, unknown>;

        // Unwrap nested {data: {...}} envelopes (up to 2 levels)
        for (let i = 0; i < 2; i++) {
            if (obj.data && typeof obj.data === "object" && !Array.isArray(obj.data)) {
                obj = obj.data as Record<string, unknown>;
            } else {
                break;
            }
        }

        const rawItems =
            (Array.isArray(obj.data) ? (obj.data as Record<string, unknown>[]) : undefined) ??
            (Array.isArray(obj.items) ? (obj.items as Record<string, unknown>[]) : undefined) ??
            (Array.isArray(obj.list) ? (obj.list as Record<string, unknown>[]) : undefined) ??
            [];

        const items = rawItems.map(mapMcauthItem);
        const total = typeof obj.total === "number" ? obj.total : items.length;
        const p = typeof obj.page === "number" ? obj.page : page;
        const ps = typeof obj.pageSize === "number" ? obj.pageSize : pageSize;
        const totalPages = typeof obj.totalPages === "number" ? obj.totalPages : Math.max(1, Math.ceil(total / ps));

        return { data: items, total, page: p, pageSize: ps, totalPages };
    }

    return { data: [], total: 0, page, pageSize, totalPages: 1 };
}

// ============ User-facing APIs ============

export async function verifyCode(payload: VerifyPayload): Promise<VerifyResponse> {
    const response = await fetch(buildUrl("/api/mcauth/verify"), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    const raw = await handleResponse<unknown>(response);

    if (raw && typeof raw === "object") {
        const obj = raw as Record<string, unknown>;
        const data = obj.data && typeof obj.data === "object" ? (obj.data as Record<string, unknown>) : {};
        return {
            success: (obj.success as boolean) ?? false,
            accountXuid: data.accountXuid as string | undefined,
            accountName: data.accountName as string | undefined,
            hasValidMcje: data.hasValidMcje as boolean | undefined,
            illegal: data.illegal as boolean | undefined,
            error: data.error as string | undefined,
        };
    }

    return raw as VerifyResponse;
}

export async function submitResult(payload: SubmitPayload): Promise<SubmitResponse> {
    const response = await fetch(buildUrl("/api/mcauth/submit"), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    return handleResponse<SubmitResponse>(response);
}

export async function checkExisting(payload: CheckExistingPayload): Promise<CheckExistingResponse> {
    const response = await fetch(buildUrl("/api/mcauth/check-existing"), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    const raw = await handleResponse<unknown>(response);

    if (raw && typeof raw === "object") {
        const obj = raw as Record<string, unknown>;
        const data = obj.data && typeof obj.data === "object" ? (obj.data as Record<string, unknown>) : {};
        const exists = data.exists as boolean | undefined;

        let record: McauthRecord | undefined;
        if (exists) {
            record = {
                id: "",
                accountXuid: (data.accountXuid as string) ?? "",
                accountName: (data.accountName as string) ?? "",
                hasValidMcje: (data.hasValidMcje as boolean) ?? false,
                invalidReason: (data.invalidReason as string | null) ?? null,
                checkedByAdmin: (data.checkedByAdmin as boolean) ?? false,
                createdAt: "",
            };
        }

        return {
            success: (obj.success as boolean) ?? false,
            exists,
            record,
            error: obj.error as string | undefined,
        };
    }

    return raw as CheckExistingResponse;
}

// ============ Admin APIs ============

export async function getAdminMcauthList(query?: McauthListQuery): Promise<McauthListResponse> {
    const page = query?.page ?? 1;
    const pageSize = query?.pageSize ?? 20;
    const params: Record<string, string | number | boolean | undefined> = { page, pageSize };
    if (query?.xuid) params.xuid = query.xuid;
    if (query?.hasValidMcje !== undefined) params.hasValidMcje = String(query.hasValidMcje);
    if (query?.checkedByAdmin !== undefined) params.checkedByAdmin = String(query.checkedByAdmin);
    if (query?.search) params.search = query.search;

    const url = buildUrl("/api/admin/mcauth", params);
    const response = await fetch(url, {
        method: "GET",
        credentials: "include",
        headers: getAuthHeaders(),
    });
    const raw = await handleResponse<unknown>(response);
    return normalizeListResponse(raw, page, pageSize);
}

export async function markMcauthChecked(id: string): Promise<void> {
    const response = await fetch(buildUrl(`/api/admin/mcauth/${id}/check`), {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    });
    await handleResponse<unknown>(response);
}

export async function deleteMcauthRecord(id: string): Promise<void> {
    const response = await fetch(buildUrl(`/api/admin/mcauth/${id}`), {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    });
    await handleResponse<unknown>(response);
}

// ============ Device Code Flow ============

export async function requestDeviceCode(): Promise<DeviceCodeResponse> {
    const response = await fetch(buildUrl("/api/mcauth/devicecode"), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
    });
    const raw = await handleResponse<unknown>(response);

    if (raw && typeof raw === "object" && "data" in raw && typeof raw.data === "object") {
        return raw.data as DeviceCodeResponse;
    }

    return raw as DeviceCodeResponse;
}

export async function pollDeviceToken(deviceCode: string): Promise<TokenPollResult> {
    const response = await fetch(buildUrl("/api/mcauth/token"), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ device_code: deviceCode }),
    });
    const raw = await handleResponse<unknown>(response);

    if (raw && typeof raw === "object" && "data" in raw && typeof raw.data === "object") {
        return raw.data as TokenPollResult;
    }

    return raw as TokenPollResult;
}

// ============ Utility ============

export async function copyToClipboard(text: string): Promise<void> {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        return;
    }
    if (typeof document !== "undefined") {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
    }
}

