import { request } from "./client";

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
    const raw = await request<unknown>("/api/mcauth/verify", {
        method: "POST",
        body: payload,
    });

    if (raw && typeof raw === "object") {
        const obj = raw as Record<string, unknown>;
        const get = (key: string) => (key in obj ? obj[key] : undefined);

        const res = {
            success: (get("hasValidMcje") as boolean | undefined) ?? false,
            accountXuid: get("accountXuid") as string | undefined,
            accountName: get("accountName") as string | undefined,
            hasValidMcje: (get("hasValidMcje") as boolean | undefined) ?? false,
            illegal: (get("illegal") as boolean | undefined) ?? false,
            error: get("error") as string | undefined,
        };
        return res;
    }

    return raw as VerifyResponse;
}

export async function submitResult(payload: SubmitPayload): Promise<SubmitResponse> {
    const raw = await request<unknown>("/api/mcauth/submit", {
        method: "POST",
        body: payload,
    });

    if (raw && typeof raw === "object") {
        const obj = raw as Record<string, unknown>;
        const get = (key: string) => (key in obj ? obj[key] : undefined);

        return {
            success: get("id") !== undefined,
            id: get("id") as string | undefined,
            error: get("error") as string | undefined,
        };
    }

    return raw as SubmitResponse;
}

export async function checkExisting(payload: CheckExistingPayload): Promise<CheckExistingResponse> {
    const raw = await request<unknown>("/api/mcauth/check-existing", {
        method: "POST",
        body: payload,
    });

    if (raw && typeof raw === "object") {
        const obj = raw as Record<string, unknown>;
        const get = (key: string) => (key in obj ? obj[key] : undefined);

        const exists = get("exists") as boolean | undefined;

        let record: McauthRecord | undefined;
        if (exists) {
            record = {
                id: "",
                accountXuid: (get("accountXuid") as string) ?? "",
                accountName: (get("accountName") as string) ?? "",
                hasValidMcje: (get("hasValidMcje") as boolean) ?? false,
                invalidReason: (get("invalidReason") as string | null) ?? null,
                checkedByAdmin: (get("checkedByAdmin") as boolean) ?? false,
                createdAt: "",
            };
        }

        return {
            success: !!exists,
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

    const raw = await request<unknown>("/api/admin/mcauth", {
        method: "GET",
        params,
        adminAuth: true,
    });
    return normalizeListResponse(raw, page, pageSize);
}

export async function markMcauthChecked(id: string): Promise<void> {
    await request<unknown>(`/api/admin/mcauth/${id}/check`, {
        method: "PATCH",
        adminAuth: true,
    });
}

export async function deleteMcauthRecord(id: string): Promise<void> {
    await request<unknown>(`/api/admin/mcauth/${id}`, {
        method: "DELETE",
        adminAuth: true,
    });
}

// ============ Device Code Flow ============

export async function requestDeviceCode(): Promise<DeviceCodeResponse> {
    const raw = await request<unknown>("/api/mcauth/devicecode", {
        method: "POST",
    });

    if (raw && typeof raw === "object") {
        const obj = raw as Record<string, unknown>;
        const inner =
            obj.data && typeof obj.data === "object" && !Array.isArray(obj.data) ? (obj.data as Record<string, unknown>) : null;
        if (inner && !("device_code" in obj)) {
            return inner as unknown as DeviceCodeResponse;
        }
        return obj as unknown as DeviceCodeResponse;
    }

    return raw as DeviceCodeResponse;
}

export async function pollDeviceToken(deviceCode: string): Promise<TokenPollResult> {
    const raw = await request<unknown>("/api/mcauth/token", {
        method: "POST",
        body: { device_code: deviceCode },
    });

    if (raw && typeof raw === "object") {
        const obj = raw as Record<string, unknown>;
        const inner =
            obj.data && typeof obj.data === "object" && !Array.isArray(obj.data) ? (obj.data as Record<string, unknown>) : null;
        if (inner && !("status" in obj)) {
            return inner as unknown as TokenPollResult;
        }
        return obj as unknown as TokenPollResult;
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
