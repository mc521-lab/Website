export type FeedbackType = "bug" | "feature" | "report";

export type FeedbackServer = "hub" | "survival" | "resource" | "plot";

export type FeedbackStatus = "waiting_admin" | "waiting_player" | "resolved" | "closed";

export interface FeedbackAuthor {
    id?: string;
    name: string;
}

export interface FeedbackComment {
    id: string;
    author: FeedbackAuthor;
    content: string;
    createdAt?: string;
    isAdmin?: boolean;
}

export interface Feedback {
    id: string;
    number: number;
    type: FeedbackType;
    server: FeedbackServer;
    playerName: string;
    title: string;
    content: string;
    status: FeedbackStatus;
    priority?: number;
    isPinned?: boolean;
    adminOnly?: boolean;
    createdAt?: string;
    updatedAt?: string;
    closedAt?: string | null;
    comments?: FeedbackComment[];
    commentCount?: number;
}

export interface FeedbackListResponse {
    data: Feedback[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export interface CreateFeedbackPayload {
    type: FeedbackType;
    server: FeedbackServer;
    playerName: string;
    title: string;
    content: string;
}

export interface CreateCommentPayload {
    content: string;
}

export interface FeedbackListQuery {
    page?: number;
    pageSize?: number;
    type?: FeedbackType;
    server?: FeedbackServer;
    status?: FeedbackStatus;
    search?: string;
    mine?: boolean;
}

export const FEEDBACK_TYPE_LABEL: Record<FeedbackType, string> = {
    bug: "Bug 反馈",
    feature: "功能建议",
    report: "举报投诉",
};

export const FEEDBACK_TYPE_COLOR: Record<FeedbackType, string> = {
    bug: "text-red-400 border-red-400/30 bg-red-400/10",
    feature: "text-blue-400 border-blue-400/30 bg-blue-400/10",
    report: "text-amber-400 border-amber-400/30 bg-amber-400/10",
};

export const FEEDBACK_SERVER_LABEL: Record<FeedbackServer, string> = {
    hub: "主城/副本",
    survival: "生存",
    resource: "资源/下界/末地",
    plot: "地皮",
};

export const FEEDBACK_STATUS_LABEL: Record<FeedbackStatus, string> = {
    waiting_admin: "等待管理员处理",
    waiting_player: "等待玩家回复",
    resolved: "已解决",
    closed: "已关闭",
};

export const FEEDBACK_STATUS_COLOR: Record<FeedbackStatus, string> = {
    waiting_admin: "text-amber-400 border-amber-400/30 bg-amber-400/10",
    waiting_player: "text-blue-400 border-blue-400/30 bg-blue-400/10",
    resolved: "text-green-400 border-green-400/30 bg-green-400/10",
    closed: "text-gray-400 border-gray-400/30 bg-gray-400/10",
};
