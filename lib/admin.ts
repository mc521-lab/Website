import type {
    AdminFeedback,
    AdminFeedbackComment,
    AdminFeedbackListQuery,
    AdminFeedbackListResponse,
    AdminFeedbackType,
    AdminFeedbackServer,
    AdminFeedbackStatus,
    UpdateFeedbackPayload,
    AdminCommentPayload,
    AdminLoginPayload,
    AdminLoginResponse,
} from "@/components/mc521/admin/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

export const ADMIN_AUTH_TOKEN_KEY = "mc521_admin_token";
export const ADMIN_AUTH_USER_KEY = "mc521_admin_user";
export const ADMIN_AUTH_LOGGED_IN_KEY = "mc521_admin_logged_in";

export function isAdminLoggedIn(): boolean {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(ADMIN_AUTH_LOGGED_IN_KEY) === "1";
}

export function markAdminLoggedIn(): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(ADMIN_AUTH_LOGGED_IN_KEY, "1");
}

export function getAdminToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(ADMIN_AUTH_TOKEN_KEY);
}

export function setAdminToken(token: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(ADMIN_AUTH_TOKEN_KEY, token);
}

export function clearAdminAuth(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(ADMIN_AUTH_TOKEN_KEY);
    localStorage.removeItem(ADMIN_AUTH_USER_KEY);
    localStorage.removeItem(ADMIN_AUTH_LOGGED_IN_KEY);
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

    console.debug("[admin:api] response", {
        status: response.status,
        ok: response.ok,
        url: response.url,
        bodyPreview: text.slice(0, 500),
    });

    if (!response.ok) {
        if (response.status === 401) {
            clearAdminAuth();
            throw new Error("登录已过期，请重新登录");
        }
        let message = response.statusText;
        if (text) {
            try {
                const errorData = JSON.parse(text);
                message = errorData?.message ?? errorData?.error ?? message;
            } catch {
                // not JSON, use statusText
            }
        }
        throw new Error(message || `请求失败 (${response.status})`);
    }

    if (!text) return {} as T;

    try {
        const parsed = JSON.parse(text) as Record<string, unknown>;

        // Check for API-level error: { success: false, message: "..." }
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

function mapFeedbackItem(item: Record<string, unknown>): AdminFeedback {
    // API might return snake_case (raw DB) or camelCase. Map snake → camel.
    const id = (item.id as string) ?? "";
    const number = typeof item.number === "number" ? item.number : 0;
    const type = (item.type as AdminFeedbackType) ?? "feature";
    const server = (item.server as AdminFeedbackServer) ?? "hub";
    const status = (item.status as AdminFeedbackStatus) ?? "waiting_admin";
    const title = (item.title as string) ?? "";
    const content = (item.content as string) ?? "";
    const playerName = (item.playerName as string) ?? (item.player_name as string) ?? "";
    const createdAt = (item.createdAt as string) ?? (item.created_at as string) ?? undefined;
    const updatedAt = (item.updatedAt as string) ?? (item.updated_at as string) ?? undefined;
    const closedAt = (item.closedAt as string | null) ?? (item.closed_at as string | null) ?? null;
    const isPinned = (item.isPinned as boolean) ?? (item.is_pinned as boolean) ?? false;
    const adminOnly = (item.adminOnly as boolean) ?? (item.admin_only as boolean) ?? false;
    const priority = (item.priority as number) ?? 0;
    const commentCount = (item.commentCount as number) ?? (item.comment_count as number) ?? undefined;

    return {
        id,
        number,
        type,
        server,
        playerName,
        title,
        content,
        status,
        priority,
        isPinned,
        adminOnly,
        createdAt,
        updatedAt,
        closedAt,
        commentCount,
    };
}

function normalizeAdminListResponse(raw: unknown, page: number, pageSize: number): AdminFeedbackListResponse {
    console.debug("[admin:api] normalizeAdminListResponse input", raw);

    if (Array.isArray(raw)) {
        const mappedItems = (raw as Record<string, unknown>[]).map(mapFeedbackItem);
        const total = mappedItems.length;
        const result = {
            data: mappedItems,
            total,
            page,
            pageSize,
            totalPages: Math.max(1, Math.ceil(total / pageSize)),
        };
        console.debug("[admin:api] normalizeAdminListResponse result (array)", result);
        return result;
    }

    if (raw && typeof raw === "object") {
        let obj = raw as Record<string, unknown>;

        // Unwrap up to 2 levels of nested {data: {...}} envelopes
        // API might return: {success, data: {items, total}}
        // Or: {success, data: {data: {items, total}}}
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

        const items = rawItems.map(mapFeedbackItem);
        const total = typeof obj.total === "number" ? obj.total : items.length;
        const p = typeof obj.page === "number" ? obj.page : page;
        const ps = typeof obj.pageSize === "number" ? obj.pageSize : pageSize;
        const totalPages = typeof obj.totalPages === "number" ? obj.totalPages : Math.max(1, Math.ceil(total / ps));

        const result = { data: items, total, page: p, pageSize: ps, totalPages };
        console.debug("[admin:api] normalizeAdminListResponse result", { keys: Object.keys(obj), result, rawObj: obj });
        return result;
    }

    console.debug("[admin:api] normalizeAdminListResponse fallback empty");
    return { data: [], total: 0, page, pageSize, totalPages: 1 };
}

function mapCommentItem(c: Record<string, unknown>): AdminFeedbackComment {
    const id = (c.id as string) ?? "";
    const content = (c.content as string) ?? "";
    const createdAt = (c.createdAt as string) ?? (c.created_at as string) ?? undefined;

    // isAdmin can come from: isAdmin (bool), is_admin (bool), or authorType (string "admin"/"player")
    const rawIsAdmin = c.isAdmin ?? c.is_admin;
    const authorType = (c.authorType as string) ?? (c.author_type as string) ?? undefined;
    const isAdmin =
        typeof rawIsAdmin === "boolean"
            ? rawIsAdmin
            : authorType === "admin";

    // Author can be: {authorName, authorId} or {author: {name, id}} or snake_case variants
    const authorName =
        (c.authorName as string) ??
        (c.author_name as string) ??
        (typeof (c.author as Record<string, unknown> | undefined)?.name === "string"
            ? ((c.author as Record<string, unknown>).name as string)
            : "") ??
        "匿名玩家";
    const authorId =
        (c.authorId as string) ??
        (c.author_id as string) ??
        (typeof (c.author as Record<string, unknown> | undefined)?.id === "string"
            ? ((c.author as Record<string, unknown>).id as string)
            : undefined);

    return {
        id,
        author: { id: authorId, name: authorName },
        content,
        createdAt,
        isAdmin,
    };
}

function normalizeAdminFeedback(raw: unknown): AdminFeedback {
    if (raw && typeof raw === "object" && !Array.isArray(raw)) {
        let obj = raw as Record<string, unknown>;
        if (obj.data && typeof obj.data === "object" && !Array.isArray(obj.data)) {
            obj = obj.data as Record<string, unknown>;
        }

        const mapped = mapFeedbackItem(obj);

        if (Array.isArray(obj.comments)) {
            mapped.comments = (obj.comments as Record<string, unknown>[]).map(mapCommentItem);
        }

        return mapped;
    }
    return raw as unknown as AdminFeedback;
}

// ============ Auth ============

export async function adminLogin(payload: AdminLoginPayload): Promise<AdminLoginResponse> {
    const response = await fetch(buildUrl("/api/admin/auth/login"), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    const envelope = await handleResponse<AdminLoginResponse>(response);

    // The API returns { success, data: { accessToken, refreshToken, user, ... }, message }
    // handleResponse returns the full envelope, so we need to unwrap the inner `data`
    const innerData = (envelope as Record<string, unknown>).data as Record<string, unknown> | undefined;
    const accessToken = typeof innerData?.accessToken === "string" ? innerData.accessToken : undefined;
    const refreshToken = typeof innerData?.refreshToken === "string" ? innerData.refreshToken : undefined;
    const expiresAt = typeof innerData?.expiresAt === "number" ? innerData.expiresAt : undefined;

    const rawUser = innerData?.user as Record<string, unknown> | undefined;
    const user = rawUser
        ? {
              id: typeof rawUser.id === "string" ? rawUser.id : undefined,
              email: typeof rawUser.email === "string" ? rawUser.email : "",
              name: typeof rawUser.name === "string" ? rawUser.name : undefined,
          }
        : undefined;

    if (accessToken) {
        setAdminToken(accessToken);
    }
    if (user) {
        setAdminUser({ email: user.email, name: user.name });
    }
    markAdminLoggedIn();

    return {
        accessToken,
        refreshToken,
        expiresAt,
        user: user ? { id: user.id ?? "", email: user.email, name: user.name } : undefined,
        message: typeof envelope.message === "string" ? envelope.message : undefined,
    };
}

// ============ Feedbacks ============

export async function getAdminFeedbacks(query?: AdminFeedbackListQuery): Promise<AdminFeedbackListResponse> {
    const page = query?.page ?? 1;
    const pageSize = query?.pageSize ?? 20;
    const params: Record<string, string | number | boolean | undefined> = { page, pageSize };
    if (query?.type) params.type = query.type;
    if (query?.server) params.server = query.server;
    if (query?.status) params.status = query.status;
    if (query?.priority !== undefined) params.priority = query.priority;
    if (query?.isPinned !== undefined) params.isPinned = String(query.isPinned);
    if (query?.search) params.search = query.search;

    const url = buildUrl("/api/admin/feedbacks", params);
    const authHeaders = getAuthHeaders();
    console.debug("[admin:api] getAdminFeedbacks request", { url, headers: authHeaders, tokenPresent: !!getAdminToken() });

    const response = await fetch(url, {
        method: "GET",
        credentials: "include",
        headers: authHeaders,
    });
    const raw = await handleResponse<unknown>(response);
    return normalizeAdminListResponse(raw, page, pageSize);
}

export async function getAdminFeedbackById(id: string): Promise<AdminFeedback> {
    const response = await fetch(buildUrl(`/api/admin/feedbacks/${id}`), {
        method: "GET",
        credentials: "include",
        headers: getAuthHeaders(),
    });
    const raw = await handleResponse<unknown>(response);
    return normalizeAdminFeedback(raw);
}

export async function updateAdminFeedback(id: string, payload: UpdateFeedbackPayload): Promise<AdminFeedback> {
    const response = await fetch(buildUrl(`/api/admin/feedbacks/${id}`), {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify(payload),
    });
    const raw = await handleResponse<unknown>(response);
    return normalizeAdminFeedback(raw);
}

export async function deleteAdminFeedback(id: string): Promise<void> {
    const response = await fetch(buildUrl(`/api/admin/feedbacks/${id}`), {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    });
    await handleResponse<unknown>(response);
}

export async function addAdminComment(feedbackId: string, payload: AdminCommentPayload): Promise<void> {
    const response = await fetch(buildUrl(`/api/admin/feedbacks/${feedbackId}/comments`), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify(payload),
    });
    await handleResponse<unknown>(response);
}

export async function deleteAdminComment(commentId: string): Promise<void> {
    const response = await fetch(buildUrl(`/api/admin/comments/${commentId}`), {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    });
    await handleResponse<unknown>(response);
}

