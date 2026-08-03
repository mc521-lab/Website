import { request, getAdminToken, setAdminToken, setAdminUser, markAdminLoggedIn, clearAdminAuth } from "./client";
import type {
    AdminFeedback,
    AdminFeedbackComment,
    AdminFeedbackListQuery,
    AdminFeedbackListResponse,
    UpdateFeedbackPayload,
    AdminCommentPayload,
    AdminLoginPayload,
    AdminLoginResponse,
} from "@/components/mc521/admin/types";

// ============ Normalization Helpers ============

function mapFeedbackItem(item: Record<string, unknown>): AdminFeedback {
    const id = (item.id as string) ?? "";
    const number = typeof item.number === "number" ? item.number : 0;
    const type = (item.type as AdminFeedback["type"]) ?? "feature";
    const server = (item.server as AdminFeedback["server"]) ?? "hub";
    const status = (item.status as AdminFeedback["status"]) ?? "waiting_admin";
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
    if (Array.isArray(raw)) {
        const mappedItems = (raw as Record<string, unknown>[]).map(mapFeedbackItem);
        const total = mappedItems.length;
        return {
            data: mappedItems,
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

        const items = rawItems.map(mapFeedbackItem);
        const total = typeof obj.total === "number" ? obj.total : items.length;
        const p = typeof obj.page === "number" ? obj.page : page;
        const ps = typeof obj.pageSize === "number" ? obj.pageSize : pageSize;
        const totalPages = typeof obj.totalPages === "number" ? obj.totalPages : Math.max(1, Math.ceil(total / ps));

        return { data: items, total, page: p, pageSize: ps, totalPages };
    }

    return { data: [], total: 0, page, pageSize, totalPages: 1 };
}

function mapCommentItem(c: Record<string, unknown>): AdminFeedbackComment {
    const id = (c.id as string) ?? "";
    const content = (c.content as string) ?? "";
    const createdAt = (c.createdAt as string) ?? (c.created_at as string) ?? undefined;

    const rawIsAdmin = c.isAdmin ?? c.is_admin;
    const authorType = (c.authorType as string) ?? (c.author_type as string) ?? undefined;
    const isAdmin = typeof rawIsAdmin === "boolean" ? rawIsAdmin : authorType === "admin";

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

export { getAdminToken, clearAdminAuth };

export async function adminLogin(payload: AdminLoginPayload): Promise<AdminLoginResponse> {
    const envelope = await request<Record<string, unknown>>("/api/admin/auth/login", {
        method: "POST",
        body: payload,
    });

    // After unwrapSuccessEnvelope strips the `{ data }` wrapper,
    // `accessToken` sits directly on the envelope object.
    // Fall back to nested `envelope.data` for robustness across response shapes.
    const innerData = envelope.data as Record<string, unknown> | undefined;
    const src = innerData && typeof innerData.accessToken === "string" ? innerData : envelope;

    const accessToken = typeof src.accessToken === "string" ? src.accessToken : undefined;
    const refreshToken = typeof src.refreshToken === "string" ? src.refreshToken : undefined;
    const expiresAt = typeof src.expiresAt === "number" ? src.expiresAt : undefined;

    const rawUser = src.user as Record<string, unknown> | undefined;
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
        message:
            typeof src.message === "string" ? src.message : typeof envelope.message === "string" ? envelope.message : undefined,
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

    const raw = await request<unknown>("/api/admin/feedbacks", {
        method: "GET",
        params,
        adminAuth: true,
    });
    return normalizeAdminListResponse(raw, page, pageSize);
}

export async function getAdminFeedbackById(id: string): Promise<AdminFeedback> {
    const raw = await request<unknown>(`/api/admin/feedbacks/${id}`, {
        method: "GET",
        adminAuth: true,
    });
    return normalizeAdminFeedback(raw);
}

export async function updateAdminFeedback(id: string, payload: UpdateFeedbackPayload): Promise<AdminFeedback> {
    const raw = await request<unknown>(`/api/admin/feedbacks/${id}`, {
        method: "PATCH",
        body: payload,
        adminAuth: true,
    });
    return normalizeAdminFeedback(raw);
}

export async function deleteAdminFeedback(id: string): Promise<void> {
    await request<unknown>(`/api/admin/feedbacks/${id}`, {
        method: "DELETE",
        adminAuth: true,
    });
}

export async function addAdminComment(feedbackId: string, payload: AdminCommentPayload): Promise<void> {
    await request<unknown>(`/api/admin/feedbacks/${feedbackId}/comments`, {
        method: "POST",
        body: payload,
        adminAuth: true,
    });
}

export async function deleteAdminComment(commentId: string): Promise<void> {
    await request<unknown>(`/api/admin/comments/${commentId}`, {
        method: "DELETE",
        adminAuth: true,
    });
}
