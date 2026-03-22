"use client";

import { DataTable } from "@/components/@dashboard-ui";
import { Dashboard, Radix } from "@/components";
import { useState, useEffect } from "react";
import { CircleCheckIcon, CircleXIcon } from "lucide-react";

type MinecraftEligibilityVerificationAttempt = {
    id: string;
    created_at: string;
    PlayerName: string;
    Successful: boolean;
    SuccessRecord: string | null;
    FailureReason: string | null;
};

export default function Page() {
    const [attempts, setAttempts] = useState<MinecraftEligibilityVerificationAttempt[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            // 从后端 API 获取验证尝试数据
            const response = await fetch("/api/mc-genuine/list/attempts");
            const data = await response.json();

            if (data.success) {
                setAttempts(data.data || []);
            } else {
                console.error("Error fetching attempts:", data.error);
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

    // 尝试表格列配置
    const attemptColumns = [
        { header: "记录 ID", accessorKey: "id" },
        {
            header: "创建时间",
            accessorKey: "created_at",
            cell: (info: { getValue: () => string }) => <>{new Date(info.getValue()).toLocaleString()}</>,
        },
        { header: "玩家名称", accessorKey: "PlayerName" },
        {
            header: "成功状态",
            accessorKey: "Successful",
            cell: (info: { getValue: () => boolean }) => (
                <Radix.Badge variant="outline" className="text-muted-foreground px-1.5">
                    {info.getValue() ? (
                        <CircleCheckIcon className="fill-green-500 dark:fill-green-400" />
                    ) : (
                        <CircleXIcon className="fill-red-500 dark:fill-red-400" />
                    )}
                    {info.getValue() ? "成功" : "失败"}
                </Radix.Badge>
            ),
        },
        { header: "成功记录 ID", accessorKey: "SuccessRecord" },
        { header: "失败原因", accessorKey: "FailureReason" },
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
                <Dashboard.SiteHeader title="君庭阁 官网数据后台 - 验证尝试记录" />
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                            <div className="px-4 lg:px-6">
                                <h2 className="mb-4 text-2xl font-bold">验证尝试记录</h2>
                                {loading ? (
                                    <div className="flex h-64 items-center justify-center">
                                        <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-blue-500"></div>
                                    </div>
                                ) : (
                                    // @ts-expect-error 忽略类型检查错误，因为数据类型与列配置匹配
                                    <DataTable onRefresh={fetchData} data={attempts} columns={attemptColumns} />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Radix.SidebarInset>
        </Radix.SidebarProvider>
    );
}
