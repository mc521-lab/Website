"use client";

import { useState, useEffect, useCallback, startTransition } from "react";
import { toast } from "sonner";
import { getFeedbacks } from "@/lib/api";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { IconifyIcon } from "@/components/iconify-icon";
import {
    type Feedback,
    type FeedbackType,
    type FeedbackServer,
    type FeedbackListQuery,
    FEEDBACK_TYPE_LABEL,
    FEEDBACK_TYPE_COLOR,
    FEEDBACK_SERVER_LABEL,
    FEEDBACK_STATUS_LABEL,
    FEEDBACK_STATUS_COLOR,
} from "./types";
import { cn } from "@/lib/utils";
import { Search, ChevronLeft, ChevronRight, Loader2, MessageSquare } from "lucide-react";

interface FeedbackListProps {
    refreshKey?: number;
}

const TYPE_FILTER_OPTIONS: { value: FeedbackType | "all"; label: string }[] = [
    { value: "all", label: "全部" },
    { value: "bug", label: "Bug" },
    { value: "feature", label: "建议" },
    { value: "report", label: "举报" },
];

const SERVER_FILTER_OPTIONS: { value: FeedbackServer | "all"; label: string }[] = [
    { value: "all", label: "全部" },
    { value: "hub", label: "主城/副本" },
    { value: "survival", label: "生存" },
    { value: "resource", label: "资源/下界/末地" },
    { value: "plot", label: "地皮" },
];

export function FeedbackList({ refreshKey }: FeedbackListProps) {
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(20);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState<FeedbackType | "all">("all");
    const [serverFilter, setServerFilter] = useState<FeedbackServer | "all">("all");

    const fetchFeedbacks = useCallback(async (query: FeedbackListQuery) => {
        startTransition(() => setLoading(true));
        try {
            const result = await getFeedbacks(query);
            startTransition(() => {
                setFeedbacks(result.data ?? []);
                setTotal(result.total ?? 0);
                setPage(result.page ?? 1);
                setTotalPages(result.totalPages ?? 1);
            });
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "加载失败");
            startTransition(() => setFeedbacks([]));
        } finally {
            startTransition(() => setLoading(false));
        }
    }, []);

    const fetchWithFilters = useCallback(
        (p = 1) => {
            const query: FeedbackListQuery = {
                page: p,
                pageSize,
            };
            if (typeFilter !== "all") query.type = typeFilter;
            if (serverFilter !== "all") query.server = serverFilter;
            if (search.trim()) query.search = search.trim();
            fetchFeedbacks(query);
        },
        [fetchFeedbacks, pageSize, typeFilter, serverFilter, search]
    );

    useEffect(() => {
        void fetchWithFilters(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refreshKey]);

    const handleSearch = useCallback(() => {
        fetchWithFilters(1);
    }, [fetchWithFilters]);

    const handlePageChange = useCallback(
        (newPage: number) => {
            if (newPage < 1 || newPage > totalPages) return;
            fetchWithFilters(newPage);
        },
        [fetchWithFilters, totalPages]
    );

    return (
        <section className="feedback-list-panel flex-1">
            {/* Toolbar with filters */}
            <div className="feedback-list-toolbar">
                <div className="feedback-list-toolbar-title">
                    <span className="feedback-list-toolbar-icon" aria-hidden="true">
                        <IconifyIcon icon="lucide:clipboard-list" width={18} height={18} />
                    </span>
                    <div>
                        <strong>反馈看板</strong>
                        <span>查看所有玩家的反馈与建议</span>
                    </div>
                </div>
                <div className="feedback-list-toolbar-actions">
                    <div className="feedback-list-search">
                        <Search size={14} />
                        <input
                            type="text"
                            placeholder="搜索反馈..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            className="feedback-list-search-input"
                        />
                        {search && (
                            <button
                                type="button"
                                className="feedback-list-search-clear"
                                onClick={() => {
                                    setSearch("");
                                    fetchWithFilters(1);
                                }}>
                                ×
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Filter chips */}
            <div className="feedback-list-filters">
                <div className="feedback-filter-group">
                    <span className="feedback-filter-label">类型</span>
                    <div className="feedback-filter-chips">
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
                                    className={`feedback-filter-chip ${isActive ? "is-active" : ""}`}>
                                    {opt.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
                <div className="feedback-filter-group">
                    <span className="feedback-filter-label">服务器</span>
                    <div className="feedback-filter-chips">
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
                                    className={`feedback-filter-chip ${isActive ? "is-active" : ""}`}>
                                    {opt.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Feedback list */}
            <div className="feedback-list-body">
                {loading ? (
                    <div className="feedback-list-loading">
                        <Loader2 size={24} className="animate-spin" />
                        <span>加载反馈列表...</span>
                    </div>
                ) : feedbacks.length === 0 ? (
                    <div className="feedback-list-empty">
                        <IconifyIcon icon="lucide:inbox" width={48} height={48} />
                        <p>暂无符合条件的反馈</p>
                        <span>试试调整筛选条件</span>
                    </div>
                ) : (
                    <div className="feedback-list-items">
                        {feedbacks.map((fb) => (
                            <Link key={fb.id} href={`/feedback/${fb.number}`} className="feedback-item-card">
                                <div className="feedback-item-header">
                                    <div className="feedback-item-badges">
                                        <span className={cn("feedback-item-badge", FEEDBACK_TYPE_COLOR[fb.type])}>
                                            {FEEDBACK_TYPE_LABEL[fb.type]}
                                        </span>
                                        <span className="feedback-item-badge feedback-item-badge-server">
                                            {FEEDBACK_SERVER_LABEL[fb.server]}
                                        </span>
                                        {fb.isPinned && (
                                            <span className="feedback-item-badge feedback-item-badge-pinned">📌 置顶</span>
                                        )}
                                    </div>
                                    <span className={cn("feedback-item-status", FEEDBACK_STATUS_COLOR[fb.status])}>
                                        {FEEDBACK_STATUS_LABEL[fb.status]}
                                    </span>
                                </div>
                                <h3 className="feedback-item-title">{fb.title}</h3>
                                <p className="feedback-item-content">{fb.content}</p>
                                <div className="feedback-item-footer">
                                    <span className="feedback-item-author">
                                        <IconifyIcon icon="lucide:user" width={12} height={12} />
                                        {fb.playerName}
                                    </span>
                                    <div className="feedback-item-meta">
                                        <span className="feedback-item-number">#{fb.number}</span>
                                        {typeof fb.commentCount === "number" && fb.commentCount > 0 && (
                                            <span className="feedback-item-comments">
                                                <MessageSquare size={12} />
                                                {fb.commentCount}
                                            </span>
                                        )}
                                        {fb.createdAt && (
                                            <span className="feedback-item-date">
                                                {new Date(fb.createdAt).toLocaleDateString("zh-CN")}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* Pagination */}
            {!loading && feedbacks.length > 0 && totalPages > 1 && (
                <div className="feedback-list-pagination">
                    <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => handlePageChange(page - 1)}>
                        <ChevronLeft size={16} />
                        上一页
                    </Button>
                    <span className="feedback-pagination-info">
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
        </section>
    );
}
