export type AdminFeedbackType = "bug" | "feature" | "report";

export type AdminFeedbackServer = "hub" | "survival" | "resource" | "plot";

export type AdminFeedbackStatus = "waiting_admin" | "waiting_player" | "resolved" | "closed";

export interface AdminFeedbackAuthor {
    id?: string;
    name: string;
}

export interface AdminFeedbackComment {
    id: string;
    author: AdminFeedbackAuthor;
    content: string;
    createdAt?: string;
    isAdmin?: boolean;
}

export interface AdminFeedback {
    id: string;
    number: number;
    type: AdminFeedbackType;
    server: AdminFeedbackServer;
    playerName: string;
    title: string;
    content: string;
    status: AdminFeedbackStatus;
    priority?: number;
    isPinned?: boolean;
    adminOnly?: boolean;
    createdAt?: string;
    updatedAt?: string;
    closedAt?: string | null;
    comments?: AdminFeedbackComment[];
    commentCount?: number;
}

export interface AdminFeedbackListResponse {
    data: AdminFeedback[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export interface AdminFeedbackListQuery {
    page?: number;
    pageSize?: number;
    type?: AdminFeedbackType;
    server?: AdminFeedbackServer;
    status?: AdminFeedbackStatus;
    priority?: number;
    isPinned?: boolean;
    search?: string;
}

export interface UpdateFeedbackPayload {
    type?: AdminFeedbackType;
    server?: AdminFeedbackServer;
    playerName?: string;
    title?: string;
    content?: string;
    status?: AdminFeedbackStatus;
    priority?: number;
    isPinned?: boolean;
    adminOnly?: boolean;
    closedAt?: string | null;
}

export interface AdminCommentPayload {
    content: string;
}

export interface AdminLoginPayload {
    email: string;
    password: string;
}

export interface AdminLoginResponse {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
    user?: {
        id: string;
        email: string;
        name?: string;
    };
    message?: string;
}

export const ADMIN_FEEDBACK_TYPE_LABEL: Record<AdminFeedbackType, string> = {
    bug: "Bug 反馈",
    feature: "功能建议",
    report: "举报投诉",
};

export const ADMIN_FEEDBACK_TYPE_COLOR: Record<AdminFeedbackType, string> = {
    bug: "text-red-400 border-red-400/30 bg-red-400/10",
    feature: "text-blue-400 border-blue-400/30 bg-blue-400/10",
    report: "text-amber-400 border-amber-400/30 bg-amber-400/10",
};

export const ADMIN_FEEDBACK_SERVER_LABEL: Record<AdminFeedbackServer, string> = {
    hub: "主城/副本",
    survival: "生存",
    resource: "资源/下界/末地",
    plot: "地皮",
};

export const ADMIN_FEEDBACK_STATUS_LABEL: Record<AdminFeedbackStatus, string> = {
    waiting_admin: "等待管理员处理",
    waiting_player: "等待玩家回复",
    resolved: "已解决",
    closed: "已关闭",
};

export const ADMIN_FEEDBACK_STATUS_COLOR: Record<AdminFeedbackStatus, string> = {
    waiting_admin: "text-amber-400 border-amber-400/30 bg-amber-400/10",
    waiting_player: "text-blue-400 border-blue-400/30 bg-blue-400/10",
    resolved: "text-green-400 border-green-400/30 bg-green-400/10",
    closed: "text-gray-400 border-gray-400/30 bg-gray-400/10",
};

export const ADMIN_PRIORITY_OPTIONS: { value: number; label: string; color: string }[] = [
    { value: 0, label: "普通", color: "text-gray-400 border-gray-400/30 bg-gray-400/10" },
    { value: 3, label: "一般", color: "text-blue-400 border-blue-400/30 bg-blue-400/10" },
    { value: 5, label: "重要", color: "text-amber-400 border-amber-400/30 bg-amber-400/10" },
    { value: 8, label: "紧急", color: "text-red-400 border-red-400/30 bg-red-400/10" },
    { value: 10, label: "最高", color: "text-red-500 border-red-500/30 bg-red-500/10" },
];
