"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { IconifyIcon } from "@/components/iconify-icon";

export function FeedbackSidebar({ pathname }: { pathname?: string }) {
    const _currentPath = usePathname();
    const currentPath = pathname ?? _currentPath;

    const navItems = [
        {
            key: "/feedback" as const,
            title: "反馈看板",
            iconIfe: "lucide:clipboard-list",
            href: "/feedback",
        },
        {
            key: "/feedback/submit" as const,
            title: "提交反馈",
            iconIfe: "lucide:plus",
            href: "/feedback/submit",
        },
    ];

    const isActive = (href: string) => currentPath === href;

    return (
        <aside className="island-sidebar feedback-sidebar">
            <div className="island-sidebar-header">
                <span className="island-sidebar-label">FEEDBACK</span>
                <h2>反馈中心</h2>
                <p>提交 Bug、建议新功能，或查看其他玩家的反馈与回复</p>
            </div>

            <nav className="island-sidebar-nav">
                {navItems.map((item) => {
                    const active = isActive(item.href);
                    return (
                        <Link
                            key={item.key}
                            href={item.href}
                            className={cn("island-nav-item feedback-nav-item", active && "is-active")}>
                            <span className="island-nav-icon">
                                <IconifyIcon icon={item.iconIfe} />
                            </span>
                            <span className="island-nav-title">{item.title}</span>
                        </Link>
                    );
                })}

                {currentPath.startsWith("/feedback/") && currentPath !== "/feedback" && currentPath !== "/feedback/submit" && (
                    <div className="feedback-nav-group is-detail w-full">
                        <div className={cn("island-nav-item feedback-nav-item is-active w-full")}>
                            <span className="island-nav-icon">
                                <IconifyIcon icon="lucide:eye" />
                            </span>
                            <span className="island-nav-title">反馈详情</span>
                        </div>
                    </div>
                )}
            </nav>
        </aside>
    );
}
