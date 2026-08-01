"use client";

import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import {
    getAdminFeedbacks,
    getAdminFeedbackById,
    deleteAdminFeedback,
    updateAdminFeedback,
    addAdminComment,
    deleteAdminComment,
} from "@/lib/admin";
import { Button } from "@/components/ui/button";
import { IconifyIcon } from "@/components/iconify-icon";
import {
    type AdminFeedback,
    type AdminFeedbackListQuery,
    type AdminFeedbackStatus,
    type AdminFeedbackType,
    type AdminFeedbackServer,
    ADMIN_FEEDBACK_TYPE_LABEL,
    ADMIN_FEEDBACK_TYPE_COLOR,
    ADMIN_FEEDBACK_SERVER_LABEL,
    ADMIN_FEEDBACK_STATUS_LABEL,
    ADMIN_FEEDBACK_STATUS_COLOR,
    ADMIN_PRIORITY_OPTIONS,
} from "@/components/mc521/admin/types";
import { cn } from "@/lib/utils";
import {
    Search,
    ChevronLeft,
    ChevronRight,
    Loader2,
    MessageSquare,
    Trash2,
    Pin,
    Check,
    X,
    Send,
    Calendar,
    Shield,
    User,
} from "lucide-react";

type ViewMode = "list" | "detail";

const TYPE_FILTER_OPTIONS: { value: AdminFeedbackType | "all"; label: string }[] = [
    { value: "all", label: "全部" },
    { value: "bug", label: "Bug" },
    { value: "feature", label: "建议" },
    { value: "report", label: "举报" },
];

const SERVER_FILTER_OPTIONS: { value: AdminFeedbackServer | "all"; label: string }[] = [
    { value: "all", label: "全部" },
    { value: "hub", label: "主城/副本" },
    { value: "survival", label: "生存" },
    { value: "resource", label: "资源/下界/末地" },
    { value: "plot", label: "地皮" },
];

const STATUS_FILTER_OPTIONS: { value: AdminFeedbackStatus | "all"; label: string }[] = [
    { value: "all", label: "全部" },
    { value: "waiting_admin", label: "待处理" },
    { value: "waiting_player", label: "待回复" },
    { value: "resolved", label: "已解决" },
    { value: "closed", label: "已关闭" },
];

export default function AdminFeedbacksPage() {
    const [feedbacks, setFeedbacks] = useState<AdminFeedback[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(20);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState<AdminFeedbackType | "all">("all");
    const [serverFilter, setServerFilter] = useState<AdminFeedbackServer | "all">("all");
    const [statusFilter, setStatusFilter] = useState<AdminFeedbackStatus | "all">("all");
    const [view, setView] = useState<ViewMode>("list");
    const [selectedFeedback, setSelectedFeedback] = useState<AdminFeedback | null>(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const fetchFeedbacks = useCallback(async (query: AdminFeedbackListQuery) => {
        setLoading(true);
        try {
            const result = await getAdminFeedbacks(query);
            setFeedbacks(result.data ?? []);
            setTotal(result.total ?? 0);
            setPage(result.page ?? 1);
            setTotalPages(result.totalPages ?? 1);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "加载失败");
            setFeedbacks([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchWithFilters = useCallback(
        (p = 1) => {
            const query: AdminFeedbackListQuery = { page: p, pageSize };
            if (typeFilter !== "all") query.type = typeFilter;
            if (serverFilter !== "all") query.server = serverFilter;
            if (statusFilter !== "all") query.status = statusFilter;
            if (search.trim()) query.search = search.trim();
            return fetchFeedbacks(query);
        },
        [fetchFeedbacks, pageSize, typeFilter, serverFilter, statusFilter, search]
    );

    useEffect(() => {
        queueMicrotask(() => fetchWithFilters(1));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refreshKey]);

    const handleSearch = useCallback(() => fetchWithFilters(1), [fetchWithFilters]);

    const handlePageChange = useCallback(
        (newPage: number) => {
            if (newPage < 1 || newPage > totalPages) return;
            fetchWithFilters(newPage);
        },
        [fetchWithFilters, totalPages]
    );

    const handleSelectFeedback = useCallback(async (feedback: AdminFeedback) => {
        setSelectedFeedback(feedback);
        setView("detail");
        setDetailLoading(true);
        try {
            const detail = await getAdminFeedbackById(feedback.id);
            setSelectedFeedback(detail);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "加载详情失败");
        } finally {
            setDetailLoading(false);
        }
    }, []);

    const handleBackToList = useCallback(() => {
        setSelectedFeedback(null);
        setView("list");
        setRefreshKey((k) => k + 1);
    }, []);

    // Feedback detail handlers
    const handleUpdateStatus = useCallback(
        async (id: string, status: AdminFeedbackStatus) => {
            try {
                await updateAdminFeedback(id, { status });
                toast.success("状态已更新");
                setRefreshKey((k) => k + 1);
                if (selectedFeedback?.id === id) {
                    setSelectedFeedback((prev) => (prev ? { ...prev, status } : null));
                }
            } catch (err) {
                toast.error(err instanceof Error ? err.message : "更新失败");
            }
        },
        [selectedFeedback]
    );

    const handleTogglePin = useCallback(
        async (id: string, current: boolean) => {
            try {
                await updateAdminFeedback(id, { isPinned: !current });
                toast.success(current ? "已取消置顶" : "已置顶");
                setRefreshKey((k) => k + 1);
                if (selectedFeedback?.id === id) {
                    setSelectedFeedback((prev) => (prev ? { ...prev, isPinned: !current } : null));
                }
            } catch (err) {
                toast.error(err instanceof Error ? err.message : "操作失败");
            }
        },
        [selectedFeedback]
    );

    const handleSetPriority = useCallback(
        async (id: string, priority: number) => {
            try {
                await updateAdminFeedback(id, { priority });
                toast.success("优先级已更新");
                setRefreshKey((k) => k + 1);
                if (selectedFeedback?.id === id) {
                    setSelectedFeedback((prev) => (prev ? { ...prev, priority } : null));
                }
            } catch (err) {
                toast.error(err instanceof Error ? err.message : "操作失败");
            }
        },
        [selectedFeedback]
    );

    const handleDelete = useCallback(
        async (id: string) => {
            if (!confirm("确定删除该反馈吗？此操作不可恢复。")) return;
            try {
                await deleteAdminFeedback(id);
                toast.success("反馈已删除");
                if (selectedFeedback?.id === id) {
                    setSelectedFeedback(null);
                    setView("list");
                }
                setRefreshKey((k) => k + 1);
            } catch (err) {
                toast.error(err instanceof Error ? err.message : "删除失败");
            }
        },
        [selectedFeedback]
    );

    const handleAddComment = useCallback(async (feedbackId: string, content: string) => {
        try {
            await addAdminComment(feedbackId, { content });
            toast.success("评论已发送");
            setRefreshKey((k) => k + 1);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "评论发送失败");
        }
    }, []);

    const handleDeleteComment = useCallback(async (commentId: string) => {
        if (!confirm("确定删除该评论吗？")) return;
        try {
            await deleteAdminComment(commentId);
            toast.success("评论已删除");
            setRefreshKey((k) => k + 1);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "删除失败");
        }
    }, []);

    return (
        <div className="island-content-inner admin-feedbacks-content">
            {view === "list" && (
                <>
                    {/* Header */}
                    <header className="admin-feedbacks-header">
                        <div className="admin-feedbacks-header-icon">
                            <IconifyIcon icon="lucide:clipboard-list" width={28} height={28} />
                        </div>
                        <div>
                            <h1 className="admin-feedbacks-title">反馈管理</h1>
                            <p className="admin-feedbacks-subtitle">
                                共 <strong>{total}</strong> 条反馈 · 第 {page} / {totalPages} 页
                            </p>
                        </div>
                    </header>

                    {/* Filters */}
                    <div className="admin-feedbacks-filters">
                        <div className="admin-feedbacks-search">
                            <Search size={14} />
                            <input
                                type="text"
                                placeholder="搜索反馈..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                className="admin-search-input"
                            />
                            {search && (
                                <button
                                    type="button"
                                    className="admin-search-clear"
                                    onClick={() => {
                                        setSearch("");
                                        fetchWithFilters(1);
                                    }}>
                                    ×
                                </button>
                            )}
                        </div>
                        <div className="flex gap-4 pl-1">
                            <div className="admin-filter-group">
                                <span className="admin-filter-label">类型</span>
                                <div className="admin-filter-chips">
                                    {TYPE_FILTER_OPTIONS.map((opt) => {
                                        const isActive = typeFilter === opt.value;
                                        return (
                                            <button
                                                key={opt.value}
                                                type="button"
                                                onClick={() => {
                                                    setTypeFilter(opt.value);
                                                    fetchWithFilters(1);
                                                }}
                                                className={`admin-filter-chip ${isActive ? "is-active" : ""}`}>
                                                {opt.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="admin-filter-group">
                                <span className="admin-filter-label">服务器</span>
                                <div className="admin-filter-chips">
                                    {SERVER_FILTER_OPTIONS.map((opt) => {
                                        const isActive = serverFilter === opt.value;
                                        return (
                                            <button
                                                key={opt.value}
                                                type="button"
                                                onClick={() => {
                                                    setServerFilter(opt.value);
                                                    fetchWithFilters(1);
                                                }}
                                                className={`admin-filter-chip ${isActive ? "is-active" : ""}`}>
                                                {opt.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="admin-filter-group">
                                <span className="admin-filter-label">状态</span>
                                <div className="admin-filter-chips">
                                    {STATUS_FILTER_OPTIONS.map((opt) => {
                                        const isActive = statusFilter === opt.value;
                                        return (
                                            <button
                                                key={opt.value}
                                                type="button"
                                                onClick={() => {
                                                    setStatusFilter(opt.value);
                                                    fetchWithFilters(1);
                                                }}
                                                className={`admin-filter-chip ${isActive ? "is-active" : ""}`}>
                                                {opt.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* List */}
                    {loading ? (
                        <div className="admin-loading">
                            <Loader2 size={24} className="animate-spin" />
                            <span>加载反馈列表...</span>
                        </div>
                    ) : feedbacks.length === 0 ? (
                        <div className="admin-empty">
                            <IconifyIcon icon="lucide:inbox" width={48} height={48} />
                            <p>暂无符合条件的反馈</p>
                            <span>试试调整筛选条件</span>
                        </div>
                    ) : (
                        <div className="admin-feedback-list">
                            {feedbacks.map((fb) => (
                                <div key={fb.id} className="admin-feedback-card" onClick={() => handleSelectFeedback(fb)}>
                                    <div className="admin-feedback-card-header">
                                        <div className="admin-feedback-badges">
                                            <span className={cn("admin-feedback-badge", ADMIN_FEEDBACK_TYPE_COLOR[fb.type])}>
                                                {ADMIN_FEEDBACK_TYPE_LABEL[fb.type]}
                                            </span>
                                            <span className="admin-feedback-badge admin-feedback-badge-server">
                                                {ADMIN_FEEDBACK_SERVER_LABEL[fb.server]}
                                            </span>
                                            {fb.isPinned && (
                                                <span className="admin-feedback-badge admin-feedback-badge-pinned">
                                                    📌 置顶
                                                </span>
                                            )}
                                            {typeof fb.priority === "number" && fb.priority > 0 && (
                                                <span
                                                    className={cn(
                                                        "admin-feedback-badge",
                                                        ADMIN_PRIORITY_OPTIONS.find((p) => p.value === fb.priority)?.color ?? ""
                                                    )}>
                                                    P{fb.priority}
                                                </span>
                                            )}
                                        </div>
                                        <span className={cn("admin-feedback-status", ADMIN_FEEDBACK_STATUS_COLOR[fb.status])}>
                                            {ADMIN_FEEDBACK_STATUS_LABEL[fb.status]}
                                        </span>
                                    </div>
                                    <h3 className="admin-feedback-title">{fb.title}</h3>
                                    <p className="admin-feedback-content">{fb.content}</p>
                                    <div className="admin-feedback-footer">
                                        <span className="admin-feedback-author">
                                            <IconifyIcon icon="lucide:user" width={12} height={12} />
                                            {fb.playerName}
                                        </span>
                                        <div className="admin-feedback-meta">
                                            <span className="admin-feedback-number">#{fb.number}</span>
                                            {typeof fb.commentCount === "number" && fb.commentCount > 0 && (
                                                <span className="admin-feedback-comments">
                                                    <MessageSquare size={12} />
                                                    {fb.commentCount}
                                                </span>
                                            )}
                                            {fb.createdAt && (
                                                <span className="admin-feedback-date">
                                                    {new Date(fb.createdAt).toLocaleDateString("zh-CN")}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {!loading && feedbacks.length > 0 && totalPages > 1 && (
                        <div className="admin-pagination">
                            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => handlePageChange(page - 1)}>
                                <ChevronLeft size={16} />
                                上一页
                            </Button>
                            <span className="admin-pagination-info">
                                第 <strong>{page}</strong> / {totalPages} 页 · 共 {total} 条
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={page >= totalPages}
                                onClick={() => handlePageChange(page + 1)}>
                                下一页
                                <ChevronRight size={16} />
                            </Button>
                        </div>
                    )}
                </>
            )}

            {view === "detail" && selectedFeedback && (
                <FeedbackDetailView
                    feedback={selectedFeedback}
                    loading={detailLoading}
                    onBack={handleBackToList}
                    onUpdateStatus={(s) => handleUpdateStatus(selectedFeedback.id, s)}
                    onTogglePin={() => handleTogglePin(selectedFeedback.id, !!selectedFeedback.isPinned)}
                    onSetPriority={(p) => handleSetPriority(selectedFeedback.id, p)}
                    onDelete={() => handleDelete(selectedFeedback.id)}
                    onAddComment={(content) => handleAddComment(selectedFeedback.id, content)}
                    onDeleteComment={handleDeleteComment}
                />
            )}
        </div>
    );
}

// ============ Feedback Detail View ============

interface FeedbackDetailViewProps {
    feedback: AdminFeedback;
    loading?: boolean;
    onBack: () => void;
    onUpdateStatus: (status: AdminFeedbackStatus) => void;
    onTogglePin: () => void;
    onSetPriority: (priority: number) => void;
    onDelete: () => void;
    onAddComment: (content: string) => Promise<void>;
    onDeleteComment: (commentId: string) => Promise<void>;
}

function FeedbackDetailView({
    feedback,
    loading,
    onBack,
    onUpdateStatus,
    onTogglePin,
    onSetPriority,
    onDelete,
    onAddComment,
    onDeleteComment,
}: FeedbackDetailViewProps) {
    const [commentText, setCommentText] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);

    const comments = feedback.comments ?? [];

    const handleSubmitComment = useCallback(async () => {
        if (!commentText.trim()) return;
        setSubmitting(true);
        try {
            await onAddComment(commentText.trim());
            setCommentText("");
        } finally {
            setSubmitting(false);
        }
    }, [commentText, onAddComment]);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
            if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                handleSubmitComment();
            }
        },
        [handleSubmitComment]
    );

    if (loading) {
        return (
            <div className="admin-detail-view">
                <div className="admin-detail-header">
                    <Button variant="ghost" onClick={onBack} className="gap-2">
                        <ChevronLeft size={16} />
                        返回列表
                    </Button>
                </div>
                <div className="admin-loading">
                    <Loader2 size={24} className="animate-spin" />
                    <span>加载详情...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-detail-view">
            {/* Back */}
            <div className="admin-detail-header">
                <Button variant="ghost" onClick={onBack} className="gap-2">
                    <ChevronLeft size={16} />
                    返回列表
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:bg-red-500/10 hover:text-red-300"
                    onClick={onDelete}>
                    <Trash2 size={14} />
                    删除反馈
                </Button>
            </div>

            {/* Feedback content */}
            <div className="admin-detail-content">
                <div className="admin-detail-meta">
                    <div className="admin-detail-badges">
                        <span className={cn("admin-detail-badge", ADMIN_FEEDBACK_TYPE_COLOR[feedback.type])}>
                            {ADMIN_FEEDBACK_TYPE_LABEL[feedback.type]}
                        </span>
                        <span className="admin-detail-badge admin-detail-badge-server">
                            {ADMIN_FEEDBACK_SERVER_LABEL[feedback.server]}
                        </span>
                        <span className={cn("admin-detail-status", ADMIN_FEEDBACK_STATUS_COLOR[feedback.status])}>
                            {ADMIN_FEEDBACK_STATUS_LABEL[feedback.status]}
                        </span>
                        {feedback.isPinned && <span className="admin-detail-badge admin-detail-badge-pinned">📌 置顶</span>}
                    </div>
                    <span className="admin-detail-number">#{feedback.number}</span>
                </div>

                <h1 className="admin-detail-title">{feedback.title}</h1>

                <div className="admin-detail-author">
                    <div className="admin-detail-avatar">
                        <User size={16} />
                    </div>
                    <div className="admin-detail-author-info">
                        <span className="admin-detail-author-name">{feedback.playerName}</span>
                        {feedback.createdAt && (
                            <span className="admin-detail-author-date">
                                <Calendar size={12} />
                                {new Date(feedback.createdAt).toLocaleString("zh-CN")}
                            </span>
                        )}
                    </div>
                </div>

                <p className="admin-detail-body">{feedback.content}</p>
            </div>

            {/* Admin actions */}
            <div className="admin-detail-actions">
                {/* Status */}
                <div className="admin-action-group">
                    <span className="admin-action-label">更新状态</span>
                    <div className="admin-action-buttons">
                        <Button
                            size="sm"
                            variant={feedback.status === "waiting_admin" ? "default" : "outline"}
                            onClick={() => onUpdateStatus("waiting_admin")}>
                            待处理
                        </Button>
                        <Button
                            size="sm"
                            variant={feedback.status === "waiting_player" ? "default" : "outline"}
                            onClick={() => onUpdateStatus("waiting_player")}>
                            待回复
                        </Button>
                        <Button
                            size="sm"
                            variant={feedback.status === "resolved" ? "default" : "outline"}
                            onClick={() => onUpdateStatus("resolved")}>
                            <Check size={14} />
                            已解决
                        </Button>
                        <Button
                            size="sm"
                            variant={feedback.status === "closed" ? "default" : "outline"}
                            onClick={() => onUpdateStatus("closed")}>
                            <X size={14} />
                            已关闭
                        </Button>
                    </div>
                </div>

                {/* Priority */}
                <div className="admin-action-group">
                    <span className="admin-action-label">优先级</span>
                    <div className="admin-action-buttons">
                        {ADMIN_PRIORITY_OPTIONS.map((opt) => (
                            <Button
                                key={opt.value}
                                size="sm"
                                variant={feedback.priority === opt.value ? "default" : "outline"}
                                onClick={() => onSetPriority(opt.value)}>
                                {opt.label}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Pin */}
                <div className="admin-action-group">
                    <span className="admin-action-label">其他操作</span>
                    <div className="admin-action-buttons">
                        <Button size="sm" variant={feedback.isPinned ? "default" : "outline"} onClick={onTogglePin}>
                            <Pin size={14} />
                            {feedback.isPinned ? "取消置顶" : "置顶"}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Comments */}
            <div className="admin-detail-comments">
                <div className="admin-comments-header">
                    <MessageSquare size={16} />
                    <span>评论 ({comments.length})</span>
                </div>

                {comments.length > 0 ? (
                    <div className="admin-comments-list">
                        {comments.map((comment) => (
                            <div key={comment.id} className={cn("admin-comment", comment.isAdmin && "is-admin")}>
                                <div className="admin-comment-avatar">
                                    {comment.isAdmin ? <Shield size={14} /> : <User size={14} />}
                                </div>
                                <div className="admin-comment-body">
                                    <div className="admin-comment-meta">
                                        <span className={cn("admin-comment-author", comment.isAdmin && "text-primary!")}>
                                            {comment.isAdmin ? "管理员" : (comment.author?.name ?? "匿名玩家")}
                                        </span>
                                        {comment.createdAt && (
                                            <span className="admin-comment-date">
                                                {new Date(comment.createdAt).toLocaleString("zh-CN")}
                                            </span>
                                        )}
                                        <button
                                            type="button"
                                            className="admin-comment-delete"
                                            disabled={deletingCommentId === comment.id}
                                            onClick={async () => {
                                                setDeletingCommentId(comment.id);
                                                try {
                                                    await onDeleteComment(comment.id);
                                                } finally {
                                                    setDeletingCommentId(null);
                                                }
                                            }}>
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                    <p className="admin-comment-content">{comment.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="admin-comments-empty">
                        <p>暂无评论</p>
                    </div>
                )}

                {/* Comment input */}
                <div className="admin-comment-input">
                    <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="作为管理员发表评论... (Ctrl+Enter 提交)"
                        maxLength={5000}
                        rows={3}
                        className="admin-comment-textarea"
                    />
                    <div className="admin-comment-actions">
                        <span className="admin-comment-counter">{commentText.length} / 5000</span>
                        <Button size="sm" disabled={submitting || !commentText.trim()} onClick={handleSubmitComment}>
                            {submitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                            发送评论
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

