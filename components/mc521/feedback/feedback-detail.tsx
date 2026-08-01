"use client";

import { useState, useEffect, useCallback, startTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getFeedbackByNumber, addFeedbackComment } from "@/lib/feedback";
import {
    type Feedback,
    type FeedbackComment,
    FEEDBACK_TYPE_LABEL,
    FEEDBACK_TYPE_COLOR,
    FEEDBACK_SERVER_LABEL,
    FEEDBACK_STATUS_LABEL,
    FEEDBACK_STATUS_COLOR,
} from "./types";
import { cn } from "@/lib/utils";
import { ArrowLeft, Send, Loader2, User, Shield, Calendar, MessageSquare } from "lucide-react";

interface FeedbackDetailProps {
    feedbackNumber: number;
    onBack: () => void;
}

export function FeedbackDetail({ feedbackNumber, onBack }: FeedbackDetailProps) {
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const [loading, setLoading] = useState(true);
    const [commentText, setCommentText] = useState("");
    const [submittingComment, setSubmittingComment] = useState(false);

    const fetchFeedback = useCallback(async () => {
        startTransition(() => setLoading(true));
        try {
            const data = await getFeedbackByNumber(feedbackNumber);
            startTransition(() => setFeedback(data));
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "加载失败");
        } finally {
            startTransition(() => setLoading(false));
        }
    }, [feedbackNumber]);

    useEffect(() => {
        void fetchFeedback();
    }, [fetchFeedback]);

    const handleAddComment = useCallback(async () => {
        if (!commentText.trim()) return;
        setSubmittingComment(true);
        try {
            await addFeedbackComment(feedbackNumber, { content: commentText.trim() });
            toast.success("评论已发送");
            setCommentText("");
            fetchFeedback();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "评论发送失败");
        } finally {
            setSubmittingComment(false);
        }
    }, [commentText, feedbackNumber, fetchFeedback]);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
            if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                handleAddComment();
            }
        },
        [handleAddComment]
    );

    if (loading) {
        return (
            <div className="feedback-detail-loading">
                <Loader2 size={24} className="animate-spin" />
                <span>加载反馈详情...</span>
            </div>
        );
    }

    if (!feedback) {
        return (
            <div className="feedback-detail-empty">
                <p>反馈 #${feedbackNumber} 不存在或已被删除</p>
                <Button variant="outline" onClick={onBack}>
                    返回列表
                </Button>
            </div>
        );
    }

    const comments = feedback.comments ?? [];

    return (
        <section className="feedback-detail-panel">
            {/* Back button */}
            <div className="feedback-detail-header">
                <Button variant="ghost" onClick={onBack} className="gap-2">
                    <ArrowLeft size={16} />
                    返回列表
                </Button>
            </div>

            {/* Feedback content */}
            <div className="feedback-detail-content">
                <div className="feedback-detail-meta">
                    <div className="feedback-detail-badges">
                        <span className={cn("feedback-detail-badge", FEEDBACK_TYPE_COLOR[feedback.type])}>
                            {FEEDBACK_TYPE_LABEL[feedback.type]}
                        </span>
                        <span className="feedback-detail-badge feedback-detail-badge-server">
                            {FEEDBACK_SERVER_LABEL[feedback.server]}
                        </span>
                        <span className={cn("feedback-detail-status", FEEDBACK_STATUS_COLOR[feedback.status])}>
                            {FEEDBACK_STATUS_LABEL[feedback.status]}
                        </span>
                    </div>
                    <span className="feedback-detail-number">#{feedback.number}</span>
                </div>

                <h1 className="feedback-detail-title">{feedback.title}</h1>

                <div className="feedback-detail-author">
                    <div className="feedback-detail-avatar">
                        <User size={16} />
                    </div>
                    <div className="feedback-detail-author-info">
                        <span className="feedback-detail-author-name">{feedback.playerName}</span>
                        {feedback.createdAt && (
                            <span className="feedback-detail-author-date">
                                <Calendar size={12} />
                                {new Date(feedback.createdAt).toLocaleString("zh-CN")}
                            </span>
                        )}
                    </div>
                </div>

                <p className="feedback-detail-body">{feedback.content}</p>
            </div>

            {/* Comments section */}
            <div className="feedback-detail-comments">
                <div className="feedback-comments-header">
                    <MessageSquare size={16} />
                    <span>评论 ({comments.length})</span>
                </div>

                {comments.length > 0 ? (
                    <div className="feedback-comments-list">
                        {comments.map((comment: FeedbackComment) => (
                            <div key={comment.id} className={`feedback-comment ${comment.isAdmin ? "is-admin" : ""}`}>
                                <div className="feedback-comment-avatar">
                                    {comment.isAdmin ? <Shield size={14} /> : <User size={14} />}
                                </div>
                                <div className="feedback-comment-body">
                                    <div className="feedback-comment-meta">
                                        <span className={cn("feedback-comment-author", comment.isAdmin && "text-primary!")}>
                                            {comment.isAdmin ? "管理员" : (comment.author?.name ?? "匿名玩家")}
                                        </span>
                                        {comment.createdAt && (
                                            <span className="feedback-comment-date">
                                                {new Date(comment.createdAt).toLocaleString("zh-CN")}
                                            </span>
                                        )}
                                    </div>
                                    <p className="feedback-comment-content">{comment.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="feedback-comments-empty">
                        <p>暂无评论，来抢个沙发吧！</p>
                    </div>
                )}

                {/* Comment input */}
                <div className="feedback-comment-input">
                    <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="发表你的看法... (Ctrl+Enter 提交)"
                        maxLength={5000}
                        rows={3}
                        className="feedback-comment-textarea"
                    />
                    <div className="feedback-comment-actions">
                        <span className="feedback-comment-counter">{commentText.length} / 5000</span>
                        <Button
                            size="sm"
                            disabled={submittingComment || !commentText.trim()}
                            onClick={handleAddComment}
                            className="gap-2">
                            {submittingComment ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                            发送评论
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}

