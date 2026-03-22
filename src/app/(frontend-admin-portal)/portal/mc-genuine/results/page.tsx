"use client";

import { DataTable } from "@/components/@dashboard-ui";
import { Dashboard, Radix } from "@/components";
import { useState, useEffect } from "react";
import { CircleCheckIcon, CopyCheckIcon, CopyIcon, LoaderIcon } from "lucide-react";
import { copyToClipboard } from "@/lib/utils";

type MinecraftEligibilityVerificationResult = {
    id: string;
    created_at: string;
    PlayerName: string;
    PlayerUuid: string;
    Proceeded: boolean;
};

function CommandCopyButton({
    PlayerName,
    results,
    setResults,
}: {
    PlayerName: string;
    results: MinecraftEligibilityVerificationResult[];
    setResults: (results: MinecraftEligibilityVerificationResult[]) => void;
}) {
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        try {
            setLoading(true);

            // 1. 复制指令
            await copyToClipboard(`/lp user ${PlayerName} permission set ch.zhengban`);

            // 2. 调用你的后端 API
            try {
                const res = await fetch("/api/mc-genuine/mark-proceeded", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ playerName: PlayerName }),
                });

                const result = await res.json();

                if (!res.ok || !result.success) {
                    throw new Error(result.error || "标记失败");
                }
            } catch (err) {
                console.warn("mark-proceeded error:", err);
            }

            // 3. 更新本地数据
            setResults(results.map((result) => (result.PlayerName === PlayerName ? { ...result, Proceeded: true } : result)));

            // 3. UI 成功反馈
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("copy + mark error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Radix.Button variant="link" onClick={handleClick} disabled={loading}>
            {copied ? <CopyCheckIcon /> : <CopyIcon />}
        </Radix.Button>
    );
}

export default function Page() {
    const [results, setResults] = useState<MinecraftEligibilityVerificationResult[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            // 从后端 API 获取验证结果数据
            const response = await fetch("/api/mc-genuine/list/results");
            const data = await response.json();

            if (data.success) {
                setResults(data.data || []);
            } else {
                console.error("Error fetching results:", data.error);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // 结果表格列配置
    const resultColumns = [
        { header: "记录 ID", accessorKey: "id" },
        {
            header: "创建时间",
            accessorKey: "created_at",
            cell: (info: { getValue: () => string }) => <>{new Date(info.getValue()).toLocaleString()}</>,
        },
        {
            header: "玩家名称",
            accessorKey: "PlayerName",
            cell: (info: { getValue: () => string }) => (
                <div className="flex items-center">
                    {info.getValue()}
                    <CommandCopyButton PlayerName={info.getValue()} results={results} setResults={setResults} />
                </div>
            ),
        },
        { header: "玩家 UUID", accessorKey: "PlayerUuid" },
        {
            header: "处理状态",
            accessorKey: "Proceeded",
            cell: (info: { getValue: () => boolean }) => (
                <Radix.Badge variant="outline" className="text-muted-foreground px-1.5">
                    {info.getValue() ? <CircleCheckIcon className="fill-green-500 dark:fill-green-400" /> : <LoaderIcon />}
                    {info.getValue() ? "已处理" : "未处理"}
                </Radix.Badge>
            ),
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
                <Dashboard.SiteHeader title="君庭阁 官网数据后台 - 验证结果记录" />
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                            <div className="px-4 lg:px-6">
                                <h2 className="mb-4 text-2xl font-bold">验证结果记录</h2>
                                {loading ? (
                                    <div className="flex h-64 items-center justify-center">
                                        <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-blue-500"></div>
                                    </div>
                                ) : (
                                    // @ts-expect-error 忽略类型检查错误，因为数据类型与列配置匹配
                                    <DataTable onRefresh={fetchData} data={results} columns={resultColumns} />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Radix.SidebarInset>
        </Radix.SidebarProvider>
    );
}
