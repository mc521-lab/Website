export type FeedbackType = "bug" | "feature" | "report";
export type FeedbackStatus = "waiting_admin" | "waiting_player" | "resolved" | "closed";
export type ServerType = "hub" | "survival" | "resource" | "plot";
export type AuthorType = "player" | "admin" | "system";

export interface FeedbackRow {
    id: string;
    number: number;
    type: FeedbackType;
    server: ServerType;
    player_name: string;
    identity: string;
    title: string;
    content: string;
    status: FeedbackStatus;
    priority: number;
    is_pinned: boolean;
    admin_only: boolean;
    last_comment_at: string;
    closed_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface CommentRow {
    id: string;
    feedback_id: string;
    author_type: AuthorType;
    author_name: string;
    content: string;
    edited_at: string | null;
    created_at: string;
}

export interface PublicFeedbackListItem {
    number: number;
    type: FeedbackType;
    server: ServerType;
    playerName: string;
    title: string;
    status: FeedbackStatus;
    priority: number;
    isPinned: boolean;
    isOwn: boolean;
    commentCount: number;
    lastCommentedAt: string;
    createdAt: string;
}

export interface PublicFeedbackDetail extends PublicFeedbackListItem {
    content: string;
    comments: PublicComment[];
}

export interface PublicComment {
    id: string;
    authorName: string;
    content: string;
    isAdmin: boolean;
    createdAt: string;
}

export interface AdminFeedbackListItem {
    id: string;
    number: number;
    type: FeedbackType;
    server: ServerType;
    playerName: string;
    identity: string;
    title: string;
    status: FeedbackStatus;
    priority: number;
    isPinned: boolean;
    adminOnly: boolean;
    commentCount: number;
    lastCommentedAt: string;
    createdAt: string;
    updatedAt: string;
}

export interface AdminFeedbackDetail extends AdminFeedbackListItem {
    content: string;
    closedAt: string | null;
    comments: AdminComment[];
}

export interface AdminComment {
    id: string;
    feedbackId: string;
    authorName: string;
    content: string;
    authorType: AuthorType;
    editedAt: string | null;
    createdAt: string;
}

export interface McAuthRow {
    id: string;
    account_xuid: string;
    account_name: string | null;
    has_valid_mcje: boolean;
    invalid_reason: string | null;
    checked_by_admin: boolean;
    created_at: string;
}

export interface McAuthListItem {
    id: string;
    accountXuid: string;
    accountName: string | null;
    hasValidMcje: boolean;
    invalidReason: string | null;
    checkedByAdmin: boolean;
    createdAt: string;
}

export interface McAuthCheckResult {
    exists: boolean;
    hasValidMcje: boolean;
    checkedByAdmin: boolean;
}

export interface ListFilters {
    type?: FeedbackType;
    server?: ServerType;
    status?: FeedbackStatus | FeedbackStatus[];
    search?: string;
    identity?: string;
    priority?: number;
    isPinned?: boolean;
}

export interface Pagination {
    page: number;
    pageSize: number;
}

export interface ListResult<T> {
    items: T[];
    total: number;
}

export interface McAuthListFilters {
    xuid?: string;
    hasValidMcje?: boolean;
    checkedByAdmin?: boolean;
    search?: string;
}
