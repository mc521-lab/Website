"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";
import { Loader2, MessageSquare, Trash2, Pin, Check, X, Send, Calendar, Shield, User, ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    type AdminFeedback,
    type AdminFeedbackStatus,
    ADMIN_FEEDBACK_TYPE_LABEL,
    ADMIN_FEEDBACK_TYPE_COLOR,
    ADMIN_FEEDBACK_SERVER_LABEL,
    ADMIN_FEEDBACK_STATUS_LABEL,
    ADMIN_FEEDBACK_STATUS_COLOR,
    ADMIN_PRIORITY_OPTIONS,
} from "@/app/admin/_components/types";

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

export function FeedbackDetailView({
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
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "评论发送失败");
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

            <div className="admin-detail-actions">
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
