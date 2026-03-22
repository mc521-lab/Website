"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/@radix-ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/@radix-ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/@radix-ui/sidebar";
import { EllipsisVerticalIcon, LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function NavUser() {
    const router = useRouter();
    const { isMobile } = useSidebar();
    const [currentUser, setCurrentUser] = useState<{ username: string; email: string } | null>(null);

    async function onLogout() {
        await fetch("/api/portal/logout", {
            method: "POST",
        });
        router.refresh();
    }

    useEffect(() => {
        async function getUser() {
            try {
                const res = await fetch("/api/portal/me", {
                    method: "GET",
                    credentials: "include", // 确保 cookie 会被发送
                });
                const json = await res.json();
                if (json.success) {
                    setCurrentUser(json.user);
                } else {
                    setCurrentUser(null);
                    console.warn("获取用户失败:", json.error);
                }
            } catch (err) {
                console.error("请求 /api/portal/me 出错:", err);
            }
        }
        getUser();
    }, []);

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                            <Avatar className="h-8 w-8 rounded-none!">
                                <AvatarImage
                                    className="rounded-none!"
                                    src={`https://minotar.net/helm/${currentUser?.username || ""}/32`}
                                    alt={currentUser?.username}
                                />
                                <AvatarFallback className="rounded-none!">{currentUser?.username?.slice?.(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-start text-sm leading-tight">
                                <span className="truncate font-medium">{currentUser?.username}</span>
                                <span className="text-muted-foreground truncate text-xs">{currentUser?.email}</span>
                            </div>
                            <EllipsisVerticalIcon className="ms-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}>
                        <DropdownMenuItem onClick={onLogout}>
                            <LogOutIcon />
                            注销登录
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
