import { request, ensureSession } from "./client";
import type {
    CreateCommentPayload,
    CreateFeedbackPayload,
    Feedback,
    FeedbackComment,
    FeedbackListQuery,
    FeedbackListResponse,
} from "@/components/mc521/feedback/types";

// ============ Normalization Helpers ============

function ensureItemFields(item: Feedback): Feedback {
    const result: Feedback = { ...item };
    if (!result.id && result.number !== undefined && result.number !== null) {
        result.id = String(result.number);
    }
    if (!result.content) {
        result.content = "";
    }
    return result;
}

function normalizeComment(raw: unknown): FeedbackComment {
    if (raw && typeof raw === "object") {
        const c = raw as Record<string, unknown>;
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

function normalizeListResponse(raw: unknown, page: number, pageSize: number): FeedbackListResponse {
    if (Array.isArray(raw)) {
        const items = (raw as Feedback[]).map(ensureItemFields);
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

        if (obj.data && typeof obj.data === "object" && !Array.isArray(obj.data)) {
            obj = obj.data as Record<string, unknown>;
        }

        const items =
            (Array.isArray(obj.data) ? (obj.data as Feedback[]) : undefined) ??
            (Array.isArray(obj.items) ? (obj.items as Feedback[]) : undefined) ??
            (Array.isArray(obj.list) ? (obj.list as Feedback[]) : undefined) ??
            [];

        const normalizedItems = items.map(ensureItemFields);
        const total = typeof obj.total === "number" ? obj.total : normalizedItems.length;
        const p = typeof obj.page === "number" ? obj.page : page;
        const ps = typeof obj.pageSize === "number" ? obj.pageSize : pageSize;
        const totalPages = typeof obj.totalPages === "number" ? obj.totalPages : Math.max(1, Math.ceil(total / ps));

        return { data: normalizedItems, total, page: p, pageSize: ps, totalPages };
    }

    return { data: [], total: 0, page, pageSize, totalPages: 1 };
}

function normalizeSingleResponse(raw: unknown): Feedback {
    if (raw && typeof raw === "object" && !Array.isArray(raw)) {
        let obj = raw as Record<string, unknown>;
        if (obj.data && typeof obj.data === "object" && !Array.isArray(obj.data)) {
            obj = obj.data as Record<string, unknown>;
        }

        if (Array.isArray(obj.comments)) {
            obj.comments = (obj.comments as unknown[]).map(normalizeComment);
        }

        return ensureItemFields(obj as unknown as Feedback);
    }
    return raw as unknown as Feedback;
}

// ============ API Endpoints ============

export async function getFeedbacks(query?: FeedbackListQuery): Promise<FeedbackListResponse> {
    const page = query?.page ?? 1;
    const pageSize = query?.pageSize ?? 20;
    const params: Record<string, string | number | boolean | undefined> = { page, pageSize };
    if (query?.type) params.type = query.type;
    if (query?.server) params.server = query.server;
    if (query?.status) params.status = query.status;
    if (query?.search) params.search = query.search;
    if (query?.mine !== undefined) params.mine = String(query.mine);

    const raw = await request<unknown>("/api/feedbacks", {
        method: "GET",
        params,
    });
    return normalizeListResponse(raw, page, pageSize);
}

export async function getMyFeedbacks(): Promise<FeedbackListResponse> {
    const raw = await request<unknown>("/api/feedbacks/me", {
        method: "GET",
    });
    return normalizeListResponse(raw, 1, 20);
}

export async function getFeedbackByNumber(number: number): Promise<Feedback> {
    const raw = await request<unknown>(`/api/feedbacks/${number}`, {
        method: "GET",
    });
    return normalizeSingleResponse(raw);
}

export async function createFeedback(payload: CreateFeedbackPayload): Promise<Feedback> {
    await ensureSession();
    const raw = await request<unknown>("/api/feedbacks", {
        method: "POST",
        body: payload,
    });
    return normalizeSingleResponse(raw);
}

export async function addFeedbackComment(number: number, payload: CreateCommentPayload): Promise<void> {
    await ensureSession();
    await request<unknown>(`/api/feedbacks/${number}/comments`, {
        method: "POST",
        body: payload,
    });
}
