"use client";

import { Radix } from "@/components";
import {
    AngryIcon,
    AnnoyedIcon,
    CirclePlusIcon,
    FrownIcon,
    GitPullRequestArrowIcon,
    GitPullRequestClosedIcon,
    GitPullRequestCreateIcon,
    GitPullRequestDraftIcon,
    GitPullRequestIcon,
    MehIcon,
} from "lucide-react";
import { DataTable } from "@/components/@dashboard-ui";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type JiraTicket = {
    id: string;
    created_at: string;
    title: string;
    description: string | null;
    status: string;
    priority: string | null;
    assignee: string | null;
};

function CreateJiraTicketMenu({ onCreated }: { onCreated: () => void }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        ReporterId: "",
        Title: "",
        Description: "",
        Priority: "Medium",
    });

    const handleChange = (key: string, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async () => {
        if (!form.Title || !form.ReporterId || !form.Priority) {
            alert("请填写完整信息");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/jira/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (data.success) {
                setOpen(false);
                setForm({
                    ReporterId: "",
                    Title: "",
                    Description: "",
                    Priority: "Medium",
                });

                onCreated(); // 🔥 刷新列表
            } else {
                alert("创建失败: " + data.error);
            }
        } catch (err) {
            console.error(err);
            alert("请求失败");
        } finally {
            setLoading(false);
        }
    };

    const colorMap: Record<string, string> = {
        Critical: "text-destructive/80",
        High: "text-orange-500/80 dark:text-orange-400/80",
        Medium: "text-yellow-500/80 dark:text-yellow-400/80",
        Low: "text-cyan-500/80 dark:text-cyan-400/80",
    };

    return (
        <Radix.Dialog open={open} onOpenChange={setOpen}>
            <Radix.DialogTrigger asChild>
                <Radix.Button variant="outline">
                    <CirclePlusIcon />
                    新建工单
                </Radix.Button>
            </Radix.DialogTrigger>

            <Radix.DialogContent className="sm:max-w-4xl">
                <Radix.DialogHeader>
                    <Radix.DialogTitle>Jira 工单系统 · 创建新的工单</Radix.DialogTitle>
                    <Radix.DialogDescription>向我们反馈问题或建议。</Radix.DialogDescription>
                </Radix.DialogHeader>

                <div className="grid grid-cols-2 gap-x-2">
                    <Radix.FieldGroup>
                        <Radix.Field>
                            <Radix.Label>玩家名</Radix.Label>
                            <Radix.Input
                                value={form.ReporterId}
                                onChange={(e) => handleChange("ReporterId", e.target.value)}
                                placeholder="Steve"
                            />
                        </Radix.Field>

                        <Radix.Field>
                            <Radix.Label>工单标题</Radix.Label>
                            <Radix.Input value={form.Title} onChange={(e) => handleChange("Title", e.target.value)} />
                        </Radix.Field>

                        <Radix.Field>
                            <Radix.Label>工单优先级</Radix.Label>
                            <Radix.Select value={form.Priority} onValueChange={(v) => handleChange("Priority", v)}>
                                <Radix.SelectTrigger className={cn("w-full", colorMap[form.Priority])}>
                                    <Radix.SelectValue placeholder="请选择优先级" />
                                </Radix.SelectTrigger>
                                <Radix.SelectContent>
                                    <Radix.SelectItem value="Critical" className="text-destructive/80">
                                        <AngryIcon />
                                        严重
                                    </Radix.SelectItem>
                                    <Radix.SelectItem value="High" className="text-orange-500/80 dark:text-orange-400/80">
                                        <FrownIcon />高
                                    </Radix.SelectItem>
                                    <Radix.SelectItem value="Medium" className="text-yellow-500/80 dark:text-yellow-400/80">
                                        <AnnoyedIcon />中
                                    </Radix.SelectItem>
                                    <Radix.SelectItem value="Low" className="text-cyan-500/80 dark:text-cyan-400/80">
                                        <MehIcon />低
                                    </Radix.SelectItem>
                                </Radix.SelectContent>
                            </Radix.Select>
                        </Radix.Field>
                    </Radix.FieldGroup>

                    <Radix.FieldGroup className="h-full w-full">
                        <Radix.Field className="h-full w-full">
                            <Radix.Label>描述</Radix.Label>
                            <Radix.Textarea
                                className="h-full w-full resize-none"
                                value={form.Description}
                                onChange={(e) => handleChange("Description", e.target.value)}
                            />
                        </Radix.Field>
                    </Radix.FieldGroup>
                </div>

                <Radix.DialogFooter>
                    <Radix.Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                        取消
                    </Radix.Button>

                    <Radix.Button
                        onClick={handleSubmit}
                        disabled={
                            loading ||
                            !form.Title ||
                            form.Priority === "" ||
                            !form.ReporterId ||
                            form.ReporterId.length < 3 ||
                            form.ReporterId.length > 16
                        }>
                        {loading ? "提交中..." : "提交工单"}
                    </Radix.Button>
                </Radix.DialogFooter>
            </Radix.DialogContent>
        </Radix.Dialog>
    );
}

export default function JiraHome() {
    const [tickets, setTickets] = useState<JiraTicket[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/jira/list"); // 你刚写的接口
            const data = await res.json();

            if (data.success) {
                setTickets(data.data || []);
            } else {
                console.error("Error fetching tickets:", data.error);
            }
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchData();
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    // 表格列
    const columns = [
        { header: "工单 ID", accessorKey: "id" },
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
        { header: "标题", accessorKey: "Title" },
        {
            header: "状态",
            accessorKey: "Status",
            cell: (info: { getValue: () => string }) => {
                const status = info.getValue();

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
                    <Radix.Badge variant="outline" className={colorMap[status]}>
                        {iconMap[status]}
                        {stringMap[status]}
                    </Radix.Badge>
                );
            },
        },
        {
            header: "优先级",
            accessorKey: "Priority",
            cell: (info: { getValue: () => string }) => {
                const status = info.getValue();

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
                    <Radix.Badge variant="outline" className={colorMap[status]}>
                        {iconMap[status]}
                        {stringMap[status]}
                    </Radix.Badge>
                );
            },
        },
        { header: "反馈人", accessorKey: "ReporterId" },
        {
            header: "处理人",
            accessorKey: "AssigneeId",
            cell: (info: { getValue: () => string }) => (info.getValue() !== "null" ? info.getValue() : "(未分配)"),
        },
    ];

    return (
        <main className="pixel-font flex h-[calc(100vh-61px)] w-full translate-y-15.25 flex-col pt-8">
            {/* 顶部 */}
            <nav className="flex w-full items-center justify-between px-16">
                <h1 className="text-3xl font-bold">工单系统</h1>

                <CreateJiraTicketMenu onCreated={fetchData} />
                {/* <Radix.DropdownMenu>
                    <Radix.DropdownMenuTrigger asChild>
                        <Radix.Button variant="outline" className="cursor-pointer">
                            更多操作
                            <ChevronDownIcon className="translate-y-px" />
                        </Radix.Button>
                    </Radix.DropdownMenuTrigger>

                    <Radix.DropdownMenuContent align="end">
                        <Radix.DropdownMenuItem disabled>
                            <SearchIcon />
                            查找工单
                        </Radix.DropdownMenuItem>
                    </Radix.DropdownMenuContent>
                </Radix.DropdownMenu> */}
            </nav>

            {/* 内容 */}
            <div className="flex flex-1 flex-col px-16 py-6">
                {loading ? (
                    <div className="flex h-64 items-center justify-center">
                        <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    // @ts-expect-error 忽略类型检查错误，因为数据类型与列配置匹配
                    <DataTable data={tickets} columns={columns} onRefresh={fetchData} hideSearch={true} />
                )}
            </div>
        </main>
    );
}
