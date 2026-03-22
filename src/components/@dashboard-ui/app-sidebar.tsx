"use client";

import * as React from "react";

import { NavFeatured } from "@/components/@dashboard-ui/nav-featured";
import { NavMain } from "@/components/@dashboard-ui/nav-main";
// import { NavSecondary } from "@/components/@dashboard-ui/nav-secondary";
import { NavUser } from "@/components/@dashboard-ui/nav-user";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/@radix-ui/sidebar";
import { BadgeCheckIcon, CircleArrowLeft, FormIcon, HomeIcon } from "lucide-react";
import Link from "next/link";

const data = {
    sidebar: [
        {
            name: "正版验证系统",
            items: [
                { name: "验证提交记录", url: "/portal/mc-genuine/attempts", icon: <FormIcon /> },
                { name: "验证通过记录", url: "/portal/mc-genuine/results", icon: <BadgeCheckIcon /> },
            ],
        },
        {
            name: "工单系统",
            items: [{ name: "工单列表", url: "/portal/jira", icon: <FormIcon /> }],
        },
    ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:p-1.5!">
                            <Link href="/">
                                <CircleArrowLeft className="size-5!" />
                                <span className="text-base font-semibold">返回主站</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain
                    items={[
                        {
                            title: "主页",
                            url: "/portal",
                            icon: <HomeIcon />,
                        },
                    ]}
                />
                {data.sidebar.map((item) => (
                    <NavFeatured key={item.name} {...item} />
                ))}
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
