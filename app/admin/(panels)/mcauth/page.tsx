"use client";

import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { getAdminMcauthList, markMcauthChecked, deleteMcauthRecord, copyToClipboard, type McauthRecord } from "@/lib/mcauth";
import { Button } from "@/components/ui/button";
import { IconifyIcon } from "@/components/iconify-icon";
import { cn } from "@/lib/utils";
import { Search, ChevronLeft, ChevronRight, Loader2, CheckCircle2, XCircle, Copy, Trash2, Shield, User, Calendar } from "lucide-react";

type McauthFilterOption = "all" | "true" | "false";

const VALIDITY_FILTER_OPTIONS: { value: McauthFilterOption; label: string }[] = [
    { value: "all", label: "全部" },
    { value: "true", label: "通过" },
    { value: "false", label: "失败" },
];

const CHECKED_FILTER_OPTIONS: { value: McauthFilterOption; label: string }[] = [
    { value: "all", label: "全部" },
    { value: "true", label: "已确认" },
    { value: "false", label: "未确认" },
];

export default function AdminMcauthPage() {
    const [records, setRecords] = useState<McauthRecord[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(20);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [validityFilter, setValidityFilter] = useState<McauthFilterOption>("all");
    const [checkedFilter, setCheckedFilter] = useState<McauthFilterOption>("all");
    const [refreshKey, setRefreshKey] = useState(0);

    const fetchRecords = useCallback(async (p: number) => {
        setLoading(true);
        try {
            const query: Record<string, unknown> = { page: p, pageSize };
            if (search.trim()) query.search = search.trim();
            if (validityFilter !== "all") query.hasValidMcje = validityFilter === "true";
            if (checkedFilter !== "all") query.checkedByAdmin = checkedFilter === "true";

            const result = await getAdminMcauthList(query);
            setRecords(result.data ?? []);
            setTotal(result.total ?? 0);
            setPage(result.page ?? 1);
            setTotalPages(result.totalPages ?? 1);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "加载失败");
            setRecords([]);
        } finally {
            setLoading(false);
        }
    }, [pageSize, search, validityFilter, checkedFilter]);

    const fetchWithFilters = useCallback(
        (p = 1) => fetchRecords(p),
        [fetchRecords]
    );

    useEffect(() => {
        queueMicrotask(() => fetchWithFilters(1));
    }, [refreshKey, fetchWithFilters]);

    const handleSearch = useCallback(() => fetchWithFilters(1), [fetchWithFilters]);

    const handlePageChange = useCallback(
        (newPage: number) => {
            if (newPage < 1 || newPage > totalPages) return;
            fetchWithFilters(newPage);
        },
        [fetchWithFilters, totalPages]
    );

    const handleMarkChecked = useCallback(async (id: string) => {
        try {
            await markMcauthChecked(id);
            toast.success("已确认");
            setRefreshKey((k) => k + 1);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "操作失败");
        }
    }, []);

    const handleDelete = useCallback(async (id: string) => {
        if (!confirm("确定删除此验证记录吗？此操作不可恢复。")) return;
        try {
            await deleteMcauthRecord(id);
            toast.success("记录已删除");
            setRefreshKey((k) => k + 1);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "删除失败");
        }
    }, []);

    const handleCopyCommand = useCallback(async (record: McauthRecord) => {
        try {
            await copyToClipboard(`/lp user ${record.accountName} permission set ch.zhengban`);
            toast.success("指令已复制");
        } catch {
            toast.error("复制失败");
        }
    }, []);

    return (
        <div className="island-content-inner admin-mcauth-content">
            {/* Header */}
            <header className="admin-feedbacks-header">
                <div className="admin-feedbacks-header-icon">
                    <IconifyIcon icon="lucide:shield-check" width={28} height={28} />
                </div>
                <div>
                    <h1 className="admin-feedbacks-title">正版验证管理</h1>
                    <p className="admin-feedbacks-subtitle">
                        共 <strong>{total}</strong> 条验证记录 · 第 {page} / {totalPages} 页
                    </p>
                </div>
            </header>

            {/* Filters */}
            <div className="admin-feedbacks-filters">
                <div className="admin-feedbacks-search">
                    <Search size={14} />
                    <input
                        type="text"
                        placeholder="搜索玩家名称或 XUID..."
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
                        <span className="admin-filter-label">验证状态</span>
                        <div className="admin-filter-chips">
                            {VALIDITY_FILTER_OPTIONS.map((opt) => {
                                const isActive = validityFilter === opt.value;
                                return (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => {
                                            setValidityFilter(opt.value);
                                            fetchWithFilters(1);
                                        }}
                                        className={cn("admin-filter-chip", isActive && "is-active")}>
                                        {opt.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    <div className="admin-filter-group">
                        <span className="admin-filter-label">审核状态</span>
                        <div className="admin-filter-chips">
                            {CHECKED_FILTER_OPTIONS.map((opt) => {
                                const isActive = checkedFilter === opt.value;
                                return (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => {
                                            setCheckedFilter(opt.value);
                                            fetchWithFilters(1);
                                        }}
                                        className={cn("admin-filter-chip", isActive && "is-active")}>
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
                    <span>加载验证记录...</span>
                </div>
            ) : records.length === 0 ? (
                <div className="admin-empty">
                    <IconifyIcon icon="lucide:inbox" width={48} height={48} />
                    <p>暂无验证记录</p>
                    <span>试试调整筛选条件</span>
                </div>
            ) : (
                <div className="admin-mcauth-list">
                    {/* Table Header */}
                    <div className="admin-mcauth-table-header">
                        <span className="w-32">玩家名称</span>
                        <span className="flex-1">XUID</span>
                        <span className="w-24">验证状态</span>
                        <span className="w-24">确认状态</span>
                        <span className="w-32">创建时间</span>
                        <span className="w-32 text-right">操作</span>
                    </div>

                    {/* Table Rows */}
                    {records.map((record) => (
                        <div key={record.id} className="admin-mcauth-row">
                            <div className="w-32 truncate" title={record.accountName}>
                                <User size={12} className="inline mr-1 text-foreground/50" />
                                {record.accountName}
                            </div>
                            <div className="flex-1 truncate font-mono text-xs text-foreground/60" title={record.accountXuid}>
                                {record.accountXuid}
                            </div>
                            <div className="w-24">
                                {record.hasValidMcje ? (
                                    <span className="inline-flex items-center gap-1 rounded border border-green-500/30 bg-green-500/10 px-2 py-0.5 text-xs text-green-400">
                                        <CheckCircle2 size={12} />
                                        已验证
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 rounded border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-xs text-red-400">
                                        <XCircle size={12} />
                                        未验证
                                    </span>
                                )}
                            </div>
                            <div className="w-24">
                                {record.checkedByAdmin ? (
                                    <span className="inline-flex items-center gap-1 rounded border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 text-xs text-blue-400">
                                        <Shield size={12} />
                                        已确认
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 rounded border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-xs text-amber-400">
                                        <Loader2 size={12} />
                                        未确认
                                    </span>
                                )}
                            </div>
                            <div className="w-32 flex items-center gap-1 text-xs text-foreground/60">
                                <Calendar size={12} />
                                {record.createdAt ? new Date(record.createdAt).toLocaleDateString("zh-CN") : "-"}
                            </div>
                            <div className="w-32 flex items-center justify-end gap-1">
                                {record.hasValidMcje && (
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleCopyCommand(record)}
                                        title="复制权限指令">
                                        <Copy size={14} />
                                    </Button>
                                )}
                                {!record.checkedByAdmin && (
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleMarkChecked(record.id)}
                                        title="标记为已确认">
                                        <CheckCircle2 size={14} />
                                    </Button>
                                )}
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-red-400 hover:bg-red-500/10 hover:text-red-300"
                                    onClick={() => handleDelete(record.id)}
                                    title="删除记录">
                                    <Trash2 size={14} />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {!loading && records.length > 0 && totalPages > 1 && (
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
