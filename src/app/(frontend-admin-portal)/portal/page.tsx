"use client";

import { Dashboard, Radix } from "@/components";
import { Button } from "@/components/@radix-ui/button";
import Link from "next/link";

const Entries = [
    {
        name: "正版验证系统",
        items: [
            {
                name: "验证提交记录",
                description: "查看所有 Minecraft 验证提交的详细记录，包括成功和失败的尝试。",
                url: "/portal/mc-genuine/attempts",
            },
            { name: "验证通过记录", description: "查看所有 Minecraft 验证通过的详细记录", url: "/portal/mc-genuine/results" },
        ],
    },
    {
        name: "工单系统",
        items: [{ name: "工单列表", description: "查看所有服务器工单的详细记录", url: "/portal/jira" }],
    },
];

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
                <Dashboard.SiteHeader title="主页" />
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                            {Entries.map((entry) => (
                                <div className="px-4 lg:px-6" key={entry.name}>
                                    <h2 className="mb-4 text-2xl font-bold">{entry.name}</h2>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        {entry.items.map((item) => (
                                            <div className="rounded-lg border p-6 shadow-sm" key={item.name}>
                                                <h3 className="mb-4 text-xl font-semibold">{item.name}</h3>
                                                <p className="text-muted-foreground mb-6">{item.description}</p>
                                                <Button asChild>
                                                    <Link href={item.url}>访问</Link>
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Radix.SidebarInset>
        </Radix.SidebarProvider>
    );
}
