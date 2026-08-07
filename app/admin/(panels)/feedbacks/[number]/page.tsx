"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getAdminFeedbackById, deleteAdminFeedback, updateAdminFeedback, addAdminComment, deleteAdminComment } from "@/lib/api";
import { FeedbackDetailView } from "@/app/admin/(panels)/feedbacks/feedback-detail-view";
import type { AdminFeedback, AdminFeedbackStatus } from "@/components/mc521/admin/types";

export default function AdminFeedbackDetailPage({ params }: { params: Promise<{ number: string }> }) {
    const router = useRouter();
    const [number, setNumber] = useState<number | null>(null);
    const [feedback, setFeedback] = useState<AdminFeedback | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        void params.then((value) => {
            const parsed = Number(value.number);
            setNumber(Number.isFinite(parsed) ? parsed : null);
        });
    }, [params]);

    const fetchDetail = useCallback(async (currentNumber: number) => {
        setLoading(true);
        try {
            const detail = await getAdminFeedbackById(String(currentNumber));
            setFeedback(detail);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "加载详情失败");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (number !== null) {
            void fetchDetail(number);
        }
    }, [number, fetchDetail]);

    const handleRefresh = useCallback(() => {
        if (number !== null) {
            void fetchDetail(number);
        }
    }, [number, fetchDetail]);

    const handleUpdateStatus = useCallback(
        async (status: AdminFeedbackStatus) => {
            if (!feedback) return;
            try {
                await updateAdminFeedback(feedback.id, { status });
                toast.success("状态已更新");
                handleRefresh();
            } catch (err) {
                toast.error(err instanceof Error ? err.message : "更新失败");
            }
        },
        [feedback, handleRefresh]
    );

    const handleTogglePin = useCallback(async () => {
        if (!feedback) return;
        try {
            await updateAdminFeedback(feedback.id, { isPinned: !feedback.isPinned });
            toast.success(feedback.isPinned ? "已取消置顶" : "已置顶");
            handleRefresh();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "操作失败");
        }
    }, [feedback, handleRefresh]);

    const handleSetPriority = useCallback(
        async (priority: number) => {
            if (!feedback) return;
            try {
                await updateAdminFeedback(feedback.id, { priority });
                toast.success("优先级已更新");
                handleRefresh();
            } catch (err) {
                toast.error(err instanceof Error ? err.message : "操作失败");
            }
        },
        [feedback, handleRefresh]
    );

    const handleDelete = useCallback(async () => {
        if (!feedback) return;
        if (!confirm("确定删除该反馈吗？此操作不可恢复。")) return;
        try {
            await deleteAdminFeedback(feedback.id);
            toast.success("反馈已删除");
            router.push("/admin/feedbacks");
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "删除失败");
        }
    }, [feedback, router]);

    const handleAddComment = useCallback(
        async (content: string) => {
            if (!feedback) return;
            try {
                await addAdminComment(feedback.id, { content });
                handleRefresh();
            } catch (err) {
                toast.error(err instanceof Error ? err.message : "评论发送失败");
            }
        },
        [feedback, handleRefresh]
    );

    const handleDeleteComment = useCallback(
        async (commentId: string) => {
            if (!confirm("确定删除该评论吗？")) return;
            try {
                await deleteAdminComment(commentId);
                handleRefresh();
            } catch (err) {
                toast.error(err instanceof Error ? err.message : "删除失败");
            }
        },
        [handleRefresh]
    );

    if (number === null) {
        return <div className="admin-detail-view" />;
    }

    if (!feedback) {
        return (
            <div className="admin-detail-view">
                {loading ? <div className="admin-loading">加载详情...</div> : <div className="admin-empty">反馈不存在</div>}
            </div>
        );
    }

    return (
        <div className="p-8">
            <FeedbackDetailView
                feedback={feedback}
                loading={loading}
                onBack={() => router.push("/admin/feedbacks")}
                onUpdateStatus={handleUpdateStatus}
                onTogglePin={handleTogglePin}
                onSetPriority={handleSetPriority}
                onDelete={handleDelete}
                onAddComment={handleAddComment}
                onDeleteComment={handleDeleteComment}
            />
        </div>
    );
}

