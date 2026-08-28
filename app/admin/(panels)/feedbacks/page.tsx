"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { getAdminFeedbacks } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { IconifyIcon } from "@/components/iconify-icon";
import {
    type AdminFeedbackListQuery,
    type AdminFeedbackStatus,
    type AdminFeedbackType,
    type AdminFeedbackServer,
    ADMIN_PRIORITY_OPTIONS,
    ADMIN_FEEDBACK_TYPE_LABEL,
    ADMIN_FEEDBACK_TYPE_COLOR,
    ADMIN_FEEDBACK_SERVER_LABEL,
    ADMIN_FEEDBACK_STATUS_LABEL,
    ADMIN_FEEDBACK_STATUS_COLOR,
} from "@/app/admin/_components/types";
import { cn } from "@/lib/utils";
import { Search, ChevronLeft, ChevronRight, Loader2, MessageSquare } from "lucide-react";

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
    const [feedbacks, setFeedbacks] = useState<import("@/app/admin/_components/types").AdminFeedback[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(20);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState<AdminFeedbackType | "all">("all");
    const [serverFilter, setServerFilter] = useState<AdminFeedbackServer | "all">("all");
    const [statusFilter, setStatusFilter] = useState<AdminFeedbackStatus | "all">("all");

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
    }, []);

    const handleSearch = useCallback(() => fetchWithFilters(1), [fetchWithFilters]);

    const handlePageChange = useCallback(
        (newPage: number) => {
            if (newPage < 1 || newPage > totalPages) return;
            fetchWithFilters(newPage);
        },
        [fetchWithFilters, totalPages]
    );

    return (
        <div className="island-content-inner admin-feedbacks-content">
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
                        <Link key={fb.id} href={`/admin/feedbacks/${fb.number}`} className="admin-feedback-card">
                            <div className="admin-feedback-card-header">
                                <div className="admin-feedback-badges">
                                    <span className={cn("admin-feedback-badge", ADMIN_FEEDBACK_TYPE_COLOR[fb.type])}>
                                        {ADMIN_FEEDBACK_TYPE_LABEL[fb.type]}
                                    </span>
                                    <span className="admin-feedback-badge admin-feedback-badge-server">
                                        {ADMIN_FEEDBACK_SERVER_LABEL[fb.server]}
                                    </span>
                                    {fb.isPinned && (
                                        <span className="admin-feedback-badge admin-feedback-badge-pinned">📌 置顶</span>
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
                        </Link>
                    ))}
                </div>
            )}

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
        </div>
    );
}
