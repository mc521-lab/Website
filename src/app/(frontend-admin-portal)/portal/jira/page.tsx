"use client";

import { DataTable } from "@/components/@dashboard-ui";
import { Dashboard, Radix } from "@/components";
import { useEffect, useState } from "react";
import {
    GitPullRequestCreateIcon,
    GitPullRequestIcon,
    GitPullRequestArrowIcon,
    GitPullRequestClosedIcon,
    GitPullRequestDraftIcon,
    AngryIcon,
    AnnoyedIcon,
    FrownIcon,
    MehIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type JiraTicket = {
    id: number;
    created_at: string;
    updated_at: string;
    Title: string;
    Status: string;
    assignee: string;
    ReporterId: string;
    AssigneeId: string | null;
};

export default function Page() {
    const [tickets, setTickets] = useState<JiraTicket[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/jira/list");
            const data = await res.json();

            if (data.success) {
                setTickets(data.data || []);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // ✅ 修改状态
    const updateStatus = async (id: number, status: string) => {
        await fetch(`/api/jira/update?id=${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ Status: status }),
        });

        fetchData();
    };

    // ✅ 修改处理人
    const updateassignee = async (id: number, assignee: string) => {
        await fetch(`/api/jira/update?id=${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ assignee: assignee }),
        });

        fetchData();
    };

    // ✅ 修改处理人
    const updateAssignee = async (id: number, assignee: string) => {
        await fetch(`/api/jira/update?id=${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ AssigneeId: assignee }),
        });

        fetchData();
    };

    const columns = [
        { header: "工单 ID", accessorKey: "id" },
        {
            header: "标题",
            accessorKey: "Title",
        },
        {
            header: "描述",
            accessorKey: "Description",
            cell: (info: { getValue: () => string }) => (
                <Radix.Dialog>
                    <Radix.DialogTrigger asChild>
                        <Radix.Button variant="outline">查看描述</Radix.Button>
                    </Radix.DialogTrigger>
                    <Radix.DialogContent className="sm:max-w-md">
                        <Radix.DialogHeader>
                            <Radix.DialogTitle>描述</Radix.DialogTitle>
                            <div className="no-scrollbar -mx-4 max-h-[50vh] overflow-y-auto px-4">{info.getValue()}</div>
                        </Radix.DialogHeader>
                    </Radix.DialogContent>
                </Radix.Dialog>
            ),
        },
        {
            header: "反馈人",
            accessorKey: "ReporterId",
        },
        {
            header: "处理人",
            accessorKey: "AssigneeId",
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            cell: (info: any) => {
                const row = info.row.original;

                const stringMap = {
                    null: "未分配",
                    CC: "CC",
                    LingyunAwA: "LingyunAwA",
                    We1Rou: "We1Rou",
                };

                return (
                    <Radix.Select value={row.AssigneeId} onValueChange={(v) => updateAssignee(row.id, v)}>
                        <Radix.SelectTrigger className="w-35">
                            <Radix.SelectValue />
                        </Radix.SelectTrigger>
                        <Radix.SelectContent>
                            {Object.keys(stringMap).map((assignee) => (
                                <Radix.SelectItem key={assignee} value={assignee}>
                                    {stringMap[assignee as keyof typeof stringMap]}
                                </Radix.SelectItem>
                            ))}
                        </Radix.SelectContent>
                    </Radix.Select>
                );
            },
        },
        {
            header: "状态",
            accessorKey: "Status",
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            cell: (info: any) => {
                const row = info.row.original;

                const iconMap: Record<string, React.ReactNode> = {
                    Pending: <GitPullRequestCreateIcon />,
                    Processing: <GitPullRequestIcon />,
                    Resolved: <GitPullRequestArrowIcon />,
                    Invalid: <GitPullRequestClosedIcon />,
                    "Waiting-3rdParty": <GitPullRequestDraftIcon />,
                    Waiting: <GitPullRequestDraftIcon />,
                };
                const stringMap: Record<string, string> = {
                    Pending: "待处理",
                    Processing: "处理中",
                    Resolved: "已解决",
                    Invalid: "无效",
                    "Waiting-3rdParty": "等待第三方",
                    Waiting: "等待",
                };
                const colorMap: Record<string, string> = {
                    Pending: "text-foreground/80",
                    Processing: "text-cyan-500/80 dark:text-cyan-400/80",
                    Resolved: "text-green-500/80 dark:text-green-400/80",
                    Invalid: "text-destructive/80",
                    "Waiting-3rdParty": "text-primary/80",
                    Waiting: "text-primary/80",
                };

                return (
                    <Radix.Select value={row.Status} onValueChange={(v) => updateStatus(row.id, v)}>
                        <Radix.SelectTrigger className={cn("w-35", colorMap[row.Status])}>
                            <Radix.SelectValue />
                        </Radix.SelectTrigger>
                        <Radix.SelectContent>
                            {Object.keys(stringMap).map((status) => (
                                <Radix.SelectItem key={status} value={status} className={colorMap[status]}>
                                    {iconMap[status]}
                                    {stringMap[status]}
                                </Radix.SelectItem>
                            ))}
                        </Radix.SelectContent>
                    </Radix.Select>
                );
            },
        },
        {
            header: "优先级",
            accessorKey: "Priority",
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            cell: (info: any) => {
                const row = info.row.original;

                const iconMap: Record<string, React.ReactNode> = {
                    Critical: <AngryIcon />,
                    High: <FrownIcon />,
                    Medium: <AnnoyedIcon />,
                    Low: <MehIcon />,
                };
                const stringMap: Record<string, string> = {
                    Critical: "严重",
                    High: "高",
                    Medium: "中",
                    Low: "低",
                };
                const colorMap: Record<string, string> = {
                    Critical: "text-destructive/80",
                    High: "text-orange-500/80 dark:text-orange-400/80",
                    Medium: "text-yellow-500/80 dark:text-yellow-400/80",
                    Low: "text-cyan-500/80 dark:text-cyan-400/80",
                };

                return (
                    <Radix.Select value={row.Priority} onValueChange={(v) => updateassignee(row.id, v)}>
                        <Radix.SelectTrigger className={cn("w-35", colorMap[row.Priority])}>
                            <Radix.SelectValue />
                        </Radix.SelectTrigger>
                        <Radix.SelectContent>
                            {Object.keys(stringMap).map((Priority) => (
                                <Radix.SelectItem key={Priority} value={Priority} className={colorMap[Priority]}>
                                    {iconMap[Priority]}
                                    {stringMap[Priority]}
                                </Radix.SelectItem>
                            ))}
                        </Radix.SelectContent>
                    </Radix.Select>
                );
            },
        },
        {
            header: "创建时间",
            accessorKey: "created_at",
            cell: (info: { getValue: () => string }) => <>{new Date(info.getValue()).toLocaleString()}</>,
        },
        {
            header: "更新时间",
            accessorKey: "updated_at",
            cell: (info: { getValue: () => string }) => <>{new Date(info.getValue()).toLocaleString()}</>,
        },
    ];

    return (
        <Radix.SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }>
            <Dashboard.AppSidebar variant="inset" />

            <Radix.SidebarInset>
                <Dashboard.SiteHeader title="工单系统 - 工单列表" />

                <div className="flex flex-1 flex-col">
                    <div className="flex flex-1 flex-col gap-4 p-6">
                        <h2 className="text-2xl font-bold">工单管理</h2>

                        {loading ? (
                            <div className="flex h-64 items-center justify-center">
                                <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                        ) : (
                            // @ts-expect-error  忽略类型检查错误，因为数据类型与列配置匹配
                            <DataTable hideSearch data={tickets} columns={columns} onRefresh={fetchData} />
                        )}
                    </div>
                </div>
            </Radix.SidebarInset>
        </Radix.SidebarProvider>
    );
}
