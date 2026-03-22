"use client";

import { Dashboard, Radix } from "@/components";
import { Button } from "@/components/@radix-ui/button";

export default function Page() {
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
                <Dashboard.SiteHeader title="君庭阁 官网数据后台" />
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                            <div className="px-4 lg:px-6">
                                <h2 className="mb-4 text-2xl font-bold">正版验证数据管理</h2>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div className="rounded-lg border p-6 shadow-sm">
                                        <h3 className="mb-4 text-xl font-semibold">验证提交记录</h3>
                                        <p className="text-muted-foreground mb-6">
                                            查看所有 Minecraft 验证提交的详细记录，包括成功和失败的尝试。
                                        </p>
                                        <Button asChild>
                                            <a href="/portal/mc-genuine/attempts">查看记录</a>
                                        </Button>
                                    </div>
                                    <div className="rounded-lg border p-6 shadow-sm">
                                        <h3 className="mb-4 text-xl font-semibold">验证通过记录</h3>
                                        <p className="text-muted-foreground mb-6">
                                            查看所有 Minecraft 验证通过的详细记录，包括已处理和未处理的结果。
                                        </p>
                                        <Button asChild>
                                            <a href="/portal/mc-genuine/results">查看记录</a>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Radix.SidebarInset>
        </Radix.SidebarProvider>
    );
}
