import type {
    CreateCommentPayload,
    CreateFeedbackPayload,
    Feedback,
    FeedbackComment,
    FeedbackListQuery,
    FeedbackListResponse,
} from "@/components/mc521/feedback/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

let sessionPromise: Promise<void> | null = null;

async function ensureSession(): Promise<void> {
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
            // Consume the body so the connection is properly closed
            await res.text();
        } catch {
            // Reset the cache so we can retry on next attempt
            sessionPromise = null;
            throw new Error("无法建立会话，请检查网络连接后重试");
        }
    })();
    return sessionPromise;
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

async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        let message = response.statusText;
        try {
            const errorData = await response.json();
            message = errorData?.message ?? errorData?.error ?? message;
        } catch {
            // response is not JSON
        }
        throw new Error(message || `请求失败 (${response.status})`);
    }
    // Some APIs may return empty body
    const text = await response.text();
    if (!text) return {} as T;
    try {
        return JSON.parse(text) as T;
    } catch {
        return {} as T;
    }
}

function normalizeListResponse(raw: unknown, page: number, pageSize: number): FeedbackListResponse {
    // Case 1: API returns an array directly
    if (Array.isArray(raw)) {
        const items = raw as Feedback[];
        const total = items.length;
        return {
            data: items,
            total,
            page,
            pageSize,
            totalPages: Math.max(1, Math.ceil(total / pageSize)),
        };
    }

    // Case 2: API returns an object
    if (raw && typeof raw === "object") {
        let obj = raw as Record<string, unknown>;

        // Unwrap one level: if the object has a "data" field that is itself an object
        // (not array), treat that as the payload (handles { success, data: { items } })
        if (obj.data && typeof obj.data === "object" && !Array.isArray(obj.data)) {
            obj = obj.data as Record<string, unknown>;
        }

        // Extract items array: check data → items → list (after unwrapping)
        const items =
            (Array.isArray(obj.data) ? (obj.data as Feedback[]) : undefined) ??
            (Array.isArray(obj.items) ? (obj.items as Feedback[]) : undefined) ??
            (Array.isArray(obj.list) ? (obj.list as Feedback[]) : undefined) ??
            [];

        const total = typeof obj.total === "number" ? obj.total : items.length;
        const p = typeof obj.page === "number" ? obj.page : page;
        const ps = typeof obj.pageSize === "number" ? obj.pageSize : pageSize;
        const totalPages = typeof obj.totalPages === "number" ? obj.totalPages : Math.max(1, Math.ceil(total / ps));

        return { data: items, total, page: p, pageSize: ps, totalPages };
    }

    // Fallback
    return { data: [], total: 0, page, pageSize, totalPages: 1 };
}

export async function getFeedbacks(query?: FeedbackListQuery): Promise<FeedbackListResponse> {
    const page = query?.page ?? 1;
    const pageSize = query?.pageSize ?? 20;
    const params: Record<string, string | number | boolean | undefined> = { page, pageSize };
    if (query?.type) params.type = query.type;
    if (query?.server) params.server = query.server;
    if (query?.status) params.status = query.status;
    if (query?.search) params.search = query.search;
    if (query?.mine !== undefined) params.mine = String(query.mine);

    const response = await fetch(buildUrl("/api/feedbacks", params), {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
    });
    const raw = await handleResponse<unknown>(response);
    return normalizeListResponse(raw, page, pageSize);
}

export async function getMyFeedbacks(): Promise<FeedbackListResponse> {
    const response = await fetch(buildUrl("/api/feedbacks/me"), {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
    });
    const raw = await handleResponse<unknown>(response);
    return normalizeListResponse(raw, 1, 20);
}

function normalizeComment(raw: unknown): FeedbackComment {
    if (raw && typeof raw === "object") {
        const c = raw as Record<string, unknown>;
        // API may return authorName (string) instead of author object
        const authorName =
            typeof c.authorName === "string"
                ? c.authorName
                : typeof (c.author as Record<string, unknown> | undefined)?.name === "string"
                  ? ((c.author as Record<string, unknown>).name as string)
                  : "匿名玩家";
        const authorId =
            typeof (c.author as Record<string, unknown> | undefined)?.id === "string"
                ? ((c.author as Record<string, unknown>).id as string)
                : undefined;

        return {
            id: (c.id as string) ?? "",
            author: { id: authorId, name: authorName },
            content: (c.content as string) ?? "",
            createdAt: c.createdAt as string | undefined,
            isAdmin: c.isAdmin as boolean | undefined,
        };
    }
    return { id: "", author: { name: "匿名玩家" }, content: "" };
}

function normalizeSingleResponse(raw: unknown): Feedback {
    if (raw && typeof raw === "object" && !Array.isArray(raw)) {
        let obj = raw as Record<string, unknown>;
        // Unwrap { success, data: {...} } wrapper
        if (obj.data && typeof obj.data === "object" && !Array.isArray(obj.data)) {
            obj = obj.data as Record<string, unknown>;
        }

        // Normalize comments: API uses authorName (string), our type uses author.name (object)
        if (Array.isArray(obj.comments)) {
            obj.comments = (obj.comments as unknown[]).map(normalizeComment);
        }

        return obj as unknown as Feedback;
    }
    return raw as unknown as Feedback;
}

export async function getFeedbackByNumber(number: number): Promise<Feedback> {
    const response = await fetch(buildUrl(`/api/feedbacks/${number}`), {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
    });
    const raw = await handleResponse<unknown>(response);
    return normalizeSingleResponse(raw);
}

export async function createFeedback(payload: CreateFeedbackPayload): Promise<Feedback> {
    await ensureSession();
    const response = await fetch(buildUrl("/api/feedbacks"), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    const raw = await handleResponse<unknown>(response);
    return normalizeSingleResponse(raw);
}

export async function addFeedbackComment(number: number, payload: CreateCommentPayload): Promise<void> {
    await ensureSession();
    const response = await fetch(buildUrl(`/api/feedbacks/${number}/comments`), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    await handleResponse<unknown>(response);
}

