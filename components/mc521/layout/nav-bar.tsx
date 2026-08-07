"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
    Home,
    BookOpen,
    ClipboardList,
    Users,
    Menu,
    X,
    GalleryVerticalEnd,
    Toolbox,
    MessageSquare,
    KeyRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PlayerIdDialog } from "@/components/mc521/feedback/player-id-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// 导航配置，直接传入 Lucide 图标组件
const navItems = [
    { text: "首页", link: "/", icon: Home },
    { text: "百科", link: "/wiki/beginner/common-commands", icon: BookOpen, activePattern: "/wiki" },
    { text: "图鉴", link: "/gallery/equipment/armor", icon: GalleryVerticalEnd, activePattern: "/gallery" },
    { text: "工具箱", link: "/tools/skindrop", icon: Toolbox, activePattern: "/tools" },
    { text: "反馈", link: "/feedback", icon: MessageSquare, activePattern: "/feedback" },
    { text: "更新日志", link: "/changelog", icon: ClipboardList, activePattern: "/changelog" },
];

const qqGroupLink = "https://qm.qq.com/q/cA73mE5jR6";

export function Navbar() {
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);
    const isFeedbackRoute = pathname.startsWith("/feedback");

    // 判断链接是否激活
    const isActive = (item: { link: string; activePattern?: string }) => {
        if (item.link === "#") return false;
        if (item.link === "/") return pathname === "/";
        if (item.activePattern) return pathname.startsWith(item.activePattern);
        return pathname.startsWith(item.link);
    };

    return (
        <header className="border-foreground/10 sticky top-0 right-0 left-0 z-50 flex h-16 items-center justify-between border-b bg-black/30 px-6 backdrop-blur-md">
            {/* 品牌 Logo 区 */}
            <Link href="/" className="text-foreground flex items-center gap-3 transition-opacity hover:opacity-90">
                <Image width={32} height={32} src="/images/logo.png" alt="君庭阁" className="h-11 w-auto" />
                <div className="flex flex-col leading-tight">
                    <span className="font-heading text-foreground text-lg font-bold">君庭阁</span>
                    <span className="text-foreground/80 text-xs">纯净生存服务器</span>
                </div>
            </Link>

            {/* 桌面端导航 */}
            <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 lg:flex">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item);
                    return (
                        <Link
                            key={item.text}
                            href={item.link}
                            className={cn(
                                "group inline-flex items-center gap-1.5 border-b-2 py-1 text-sm transition-colors",
                                active
                                    ? "border-primary text-primary"
                                    : "text-foreground/85 hover:text-foreground border-transparent"
                            )}>
                            <Icon size={18} className="translate-y-px" />
                            <span className="text-base">{item.text}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* 右侧动作区 (桌面端 CTA) */}
            <TooltipProvider>
                <div className="hidden items-center gap-2 lg:flex">
                    {isFeedbackRoute && (
                        <div className="min-w-0">
                            <PlayerIdDialog />
                        </div>
                    )}
                    {isFeedbackRoute ? (
                        <Tooltip>
                            <TooltipTrigger>
                                <Button
                                    asChild
                                    variant={isFeedbackRoute ? "outline" : "default"}
                                    size={isFeedbackRoute ? "icon" : "default"}
                                    className={cn("rounded-full", isFeedbackRoute ? "h-9 w-9 px-0" : "h-9 gap-1.5 px-4")}>
                                    <Link href={qqGroupLink} target="_blank" rel="noopener noreferrer" aria-label="加入QQ群">
                                        <Users size={18} data-icon="inline-start ml-1" />
                                    </Link>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>加入QQ群</TooltipContent>
                        </Tooltip>
                    ) : (
                        <Button
                            asChild
                            variant={isFeedbackRoute ? "outline" : "default"}
                            size={isFeedbackRoute ? "icon" : "default"}
                            className={cn("rounded-full", isFeedbackRoute ? "h-9 w-9 px-0" : "h-9 gap-1.5 px-4")}>
                            <Link href={qqGroupLink} target="_blank" rel="noopener noreferrer" aria-label="加入QQ群">
                                <Users size={18} data-icon="inline-start ml-1" />
                                <span>加入QQ群</span>
                            </Link>
                        </Button>
                    )}
                </div>
            </TooltipProvider>

            {/* 移动端菜单切换按钮 */}
            <div className="flex items-center gap-2 lg:hidden">
                {isFeedbackRoute && <PlayerIdDialog />}
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-foreground hover:bg-foreground/10"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="打开菜单">
                    {menuOpen ? <X size={22} /> : <Menu size={22} />}
                </Button>
            </div>

            {/* 移动端下拉菜单 */}
            {menuOpen && (
                <div className="border-foreground/10 absolute top-16 right-0 left-0 flex flex-col gap-2 border-b bg-black/90 p-5 backdrop-blur-md lg:hidden">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item);
                        return (
                            <Link
                                key={item.text}
                                href={item.link}
                                onClick={() => setMenuOpen(false)}
                                className={cn(
                                    "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                                    active
                                        ? "bg-primary/10 text-primary"
                                        : "text-foreground/85 hover:bg-foreground/5 hover:text-foreground"
                                )}>
                                <Icon size={20} />
                                <span>{item.text}</span>
                            </Link>
                        );
                    })}

                    <Button asChild className="mt-3 w-full gap-1.5 rounded-full" onClick={() => setMenuOpen(false)}>
                        <a href={qqGroupLink} target="_blank" rel="noopener noreferrer">
                            <Users size={18} />
                            <span>加入QQ群</span>
                        </a>
                    </Button>
                </div>
            )}
        </header>
    );
}
