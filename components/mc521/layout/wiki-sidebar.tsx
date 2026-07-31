"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { wiki_navigation } from "@/.velite";
import { cn } from "@/lib/utils";
import { IconifyIcon } from "@/components/iconify-icon";

export function WikiSidebar() {
    const pathname = usePathname();
    const [expanded, setExpanded] = useState<Set<string>>(() => new Set(["新手必看教程"]));

    const toggleGroup = (title: string) => {
        setExpanded((prev) => {
            const next = new Set(prev);
            if (next.has(title)) {
                next.delete(title);
            } else {
                next.add(title);
            }
            return next;
        });
    };

    // 按 order 排序
    const sortedNav = [...wiki_navigation].sort((a, b) => a.order - b.order);

    return (
        <aside className="wiki-sidebar">
            <div className="wiki-sidebar-header">
                <span className="wiki-sidebar-label">WIKI</span>
                <h2>君庭阁百科</h2>
                <p>服务器玩法、规则与指令文档</p>
            </div>

            <nav className="wiki-sidebar-nav">
                {sortedNav.map((group) => {
                    const sortedItems = [...group.items].sort((a, b) => a.order - b.order);
                    const isExpanded = expanded.has(group.title);

                    return (
                        <div key={group.title} className={cn("wiki-nav-group", !isExpanded && "is-collapsed")}>
                            <button
                                type="button"
                                className="wiki-nav-group-header"
                                onClick={() => toggleGroup(group.title)}
                                aria-expanded={isExpanded}>
                                <span className="translate-y-0.5">{group.title}</span>
                                <IconifyIcon icon="lucide:chevron-down" className="wiki-nav-chevron translate-y-0.5" />
                            </button>
                            <div className="wiki-nav-group-body">
                                <ul>
                                    {sortedItems.map((item) => {
                                        const isActive = pathname === "/wiki" + item.href;
                                        const isFirstItem = item.order === 1;
                                        return (
                                            <li key={item.href} className={cn(isFirstItem && "mt-2")}>
                                                <Link
                                                    href={"/wiki" + item.href}
                                                    className={cn("wiki-nav-item", isActive && "is-active")}>
                                                    {item.icon && (
                                                        <span className="wiki-nav-icon">
                                                            <IconifyIcon icon={item.icon} />
                                                        </span>
                                                    )}
                                                    <span className="wiki-nav-title">{item.title}</span>
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>
                    );
                })}
            </nav>
        </aside>
    );
}

