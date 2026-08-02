import { supabase } from "./supabase";
import type {
    FeedbackRow,
    CommentRow,
    FeedbackType,
    FeedbackStatus,
    ServerType,
    PublicFeedbackListItem,
    PublicFeedbackDetail,
    PublicComment,
    AdminFeedbackListItem,
    AdminFeedbackDetail,
    AdminComment,
    ListFilters,
    Pagination,
    ListResult,
} from "./types";

function toPublicItem(row: FeedbackRow, commentCount: number, viewerIdentity?: string): PublicFeedbackListItem {
    return {
        number: row.number,
        type: row.type,
        server: row.server,
        playerName: row.player_name,
        title: row.title,
        status: row.status,
        priority: row.priority,
        isPinned: row.is_pinned,
        isOwn: !!viewerIdentity && row.identity === viewerIdentity,
        commentCount,
        lastCommentedAt: row.last_comment_at,
        createdAt: row.created_at,
    };
}

function toPublicComment(row: CommentRow): PublicComment {
    return {
        id: row.id,
        authorName: row.author_name,
        content: row.content,
        isAdmin: row.author_type === "admin",
        createdAt: row.created_at,
    };
}

function toAdminItem(row: FeedbackRow, commentCount: number): AdminFeedbackListItem {
    return {
        id: row.id,
        number: row.number,
        type: row.type,
        server: row.server,
        playerName: row.player_name,
        identity: row.identity,
        title: row.title,
        status: row.status,
        priority: row.priority,
        isPinned: row.is_pinned,
        adminOnly: row.admin_only,
        commentCount,
        lastCommentedAt: row.last_comment_at,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}

function toAdminComment(row: CommentRow): AdminComment {
    return {
        id: row.id,
        feedbackId: row.feedback_id,
        authorName: row.author_name,
        content: row.content,
        authorType: row.author_type,
        editedAt: row.edited_at,
        createdAt: row.created_at,
    };
}

function buildSearchOr(term: string): string {
    const safe = term.replace(/[%_]/g, "\\$&");
    return `title.ilike.%${safe}%,content.ilike.%${safe}%,player_name.ilike.%${safe}%`;
}

async function fetchCommentCounts(feedbackIds: string[]): Promise<Map<string, number>> {
    if (feedbackIds.length === 0) return new Map();
    const { data, error } = await supabase
        .from("feedback_comments")
        .select("feedback_id")
        .in("feedback_id", feedbackIds);
    if (error) throw error;

    const counts = new Map<string, number>();
    for (const row of (data ?? []) as { feedback_id: string }[]) {
        counts.set(row.feedback_id, (counts.get(row.feedback_id) ?? 0) + 1);
    }
    return counts;
}

function buildFeedbackQuery(filters: ListFilters) {
    let query = supabase.from("feedbacks").select("*", { count: "exact" });

    if (filters.type) query = query.eq("type", filters.type);
    if (filters.server) query = query.eq("server", filters.server);
    if (filters.status) {
        if (Array.isArray(filters.status)) {
            query = query.in("status", filters.status);
        } else {
            query = query.eq("status", filters.status);
        }
    }
    if (filters.identity) query = query.eq("identity", filters.identity);
    if (typeof filters.priority === "number") query = query.eq("priority", filters.priority);
    if (typeof filters.isPinned === "boolean") query = query.eq("is_pinned", filters.isPinned);
    if (filters.search) query = query.or(buildSearchOr(filters.search));

    return query
        .order("is_pinned", { ascending: false })
        .order("priority", { ascending: false })
        .order("last_comment_at", { ascending: false })
        .order("number", { ascending: false });
}

export async function listPublicFeedbacks(
    filters: ListFilters,
    pagination: Pagination,
    viewerIdentity?: string,
): Promise<ListResult<PublicFeedbackListItem>> {
    const from = (pagination.page - 1) * pagination.pageSize;
    const to = from + pagination.pageSize - 1;

    const query = buildFeedbackQuery(filters).range(from, to);
    const { data, error, count } = await query;
    if (error) throw error;

    const rows = (data ?? []) as FeedbackRow[];
    const counts = await fetchCommentCounts(rows.map((r) => r.id));

    return {
        items: rows.map((row) => toPublicItem(row, counts.get(row.id) ?? 0, viewerIdentity)),
        total: count ?? 0,
    };
}

export async function getPublicFeedbackDetail(
    number: number,
    viewerIdentity?: string,
): Promise<PublicFeedbackDetail | null> {
    const { data: rows, error } = await supabase.from("feedbacks").select("*").eq("number", number).limit(1);

    if (error) throw error;
    const row = (rows?.[0] ?? null) as FeedbackRow | null;
    if (!row) return null;

    const { data: comments, error: commentsError } = await supabase
        .from("feedback_comments")
        .select("*")
        .eq("feedback_id", row.id)
        .order("created_at", { ascending: true });

    if (commentsError) throw commentsError;

    const commentRows = (comments ?? []) as CommentRow[];

    return {
        ...toPublicItem(row, commentRows.length, viewerIdentity),
        content: row.content,
        comments: commentRows.map(toPublicComment),
    };
}

export async function createFeedback(input: {
    type: FeedbackType;
    server: ServerType;
    playerName: string;
    identity: string;
    title: string;
    content: string;
}): Promise<{ id: string; number: number }> {
    const { data, error } = await supabase
        .from("feedbacks")
        .insert({
            type: input.type,
            server: input.server,
            player_name: input.playerName,
            identity: input.identity,
            title: input.title,
            content: input.content,
        })
        .select("id, number")
        .single();

    const result = data as { id: string; number: number } | null;
    if (error) throw error;
    if (!result) throw new Error("Failed to create feedback");

    return { id: result.id, number: result.number };
}

export async function addPlayerComment(
    feedbackId: string,
    authorName: string,
    content: string,
): Promise<PublicComment> {
    const { data, error } = await supabase
        .from("feedback_comments")
        .insert({
            feedback_id: feedbackId,
            author_type: "player",
            author_name: authorName,
            content,
        })
        .select("*")
        .single();

    const comment = data as CommentRow | null;
    if (error) throw error;
    if (!comment) throw new Error("Failed to create comment");

    await supabase.from("feedbacks").update({ last_comment_at: new Date().toISOString() }).eq("id", feedbackId);

    return toPublicComment(comment);
}

export async function getFeedbackByNumber(number: number): Promise<FeedbackRow | null> {
    const { data, error } = await supabase.from("feedbacks").select("*").eq("number", number).limit(1);

    if (error) throw error;
    return (data?.[0] ?? null) as FeedbackRow | null;
}

export async function listAdminFeedbacks(
    filters: ListFilters,
    pagination: Pagination,
): Promise<ListResult<AdminFeedbackListItem>> {
    const from = (pagination.page - 1) * pagination.pageSize;
    const to = from + pagination.pageSize - 1;

    const query = buildFeedbackQuery(filters).range(from, to);
    const { data, error, count } = await query;
    if (error) throw error;

    const rows = (data ?? []) as FeedbackRow[];
    const counts = await fetchCommentCounts(rows.map((r) => r.id));

    return {
        items: rows.map((row) => toAdminItem(row, counts.get(row.id) ?? 0)),
        total: count ?? 0,
    };
}

export async function getAdminFeedbackDetail(id: string): Promise<AdminFeedbackDetail | null> {
    const { data: rows, error } = await supabase.from("feedbacks").select("*").eq("id", id).limit(1);

    if (error) throw error;
    const row = (rows?.[0] ?? null) as FeedbackRow | null;
    if (!row) return null;

    const { data: comments, error: commentsError } = await supabase
        .from("feedback_comments")
        .select("*")
        .eq("feedback_id", row.id)
        .order("created_at", { ascending: true });

    if (commentsError) throw commentsError;

    const commentRows = (comments ?? []) as CommentRow[];

    return {
        ...toAdminItem(row, commentRows.length),
        content: row.content,
        closedAt: row.closed_at,
        comments: commentRows.map(toAdminComment),
    };
}

export async function addAdminComment(feedbackId: string, authorName: string, content: string): Promise<AdminComment> {
    const { data, error } = await supabase
        .from("feedback_comments")
        .insert({
            feedback_id: feedbackId,
            author_type: "admin",
            author_name: authorName,
            content,
        })
        .select("*")
        .single();

    const comment = data as CommentRow | null;
    if (error) throw error;
    if (!comment) throw new Error("Failed to create admin comment");

    await supabase.from("feedbacks").update({ last_comment_at: new Date().toISOString() }).eq("id", feedbackId);

    return toAdminComment(comment);
}

export async function updateFeedback(
    id: string,
    patch: Partial<{
        type: FeedbackType;
        server: ServerType;
        playerName: string;
        title: string;
        content: string;
        status: FeedbackStatus;
        priority: number;
        isPinned: boolean;
        adminOnly: boolean;
        closedAt: string | null;
    }>,
): Promise<void> {
    const update: Record<string, unknown> = {};
    if (patch.type !== undefined) update.type = patch.type;
    if (patch.server !== undefined) update.server = patch.server;
    if (patch.playerName !== undefined) update.player_name = patch.playerName;
    if (patch.title !== undefined) update.title = patch.title;
    if (patch.content !== undefined) update.content = patch.content;
    if (patch.status !== undefined) update.status = patch.status;
    if (patch.priority !== undefined) update.priority = patch.priority;
    if (patch.isPinned !== undefined) update.is_pinned = patch.isPinned;
    if (patch.adminOnly !== undefined) update.admin_only = patch.adminOnly;
    if (patch.closedAt !== undefined) update.closed_at = patch.closedAt;

    if (Object.keys(update).length === 0) return;

    const { error } = await supabase.from("feedbacks").update(update).eq("id", id);
    if (error) throw error;
}

export async function deleteFeedback(id: string): Promise<void> {
    const { error: commentsError } = await supabase.from("feedback_comments").delete().eq("feedback_id", id);
    if (commentsError) throw commentsError;

    const { error } = await supabase.from("feedbacks").delete().eq("id", id);
    if (error) throw error;
}

export async function deleteComment(id: string): Promise<void> {
    const { error } = await supabase.from("feedback_comments").delete().eq("id", id);
    if (error) throw error;
}
