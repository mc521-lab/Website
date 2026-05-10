"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";

interface WikiItem {
    slug: string;
    title: string;
    order: number;
}

interface WikiCategory {
    folderName: string;
    title: string;
    order: number;
    expanded: boolean;
    items: WikiItem[];
}

interface WikiSidebarProps {
    currentSlug?: string;
    categories: WikiCategory[];
}

export function WikiSidebar({ currentSlug, categories }: WikiSidebarProps) {
    // 初始化展开状态：优先使用 config.yml 中的配置，其次展开包含当前文档的分类
    const getDefaultExpanded = () => {
        const defaultExpanded: Record<string, boolean> = {};

        // 首先根据 config.yml 的 expanded 配置设置
        categories.forEach((cat) => {
            defaultExpanded[cat.folderName] = cat.expanded;
        });

        // 如果有当前文档，确保其所在分类展开
        if (currentSlug) {
            const currentCategory = currentSlug.split("/")[0];
            defaultExpanded[currentCategory] = true;
        }

        return defaultExpanded;
    };

    const [expanded, setExpanded] = useState<Record<string, boolean>>(getDefaultExpanded);

    const toggleCategory = (folderName: string) => {
        setExpanded((prev) => ({
            ...prev,
            [folderName]: !prev[folderName],
        }));
    };

    return (
        <aside className="w-64 shrink-0 border-r border-neutral-800 bg-neutral-900/50">
            <div className="sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto px-4 py-6">
                <Link
                    href="/wiki"
                    className={cn(
                        "mb-6 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        !currentSlug ? "bg-primary/10 text-primary" : "text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200"
                    )}>
                    <span>🏠</span>
                    Wiki 首页
                </Link>

                <nav className="space-y-2">
                    {categories.map((category) => {
                        const isExpanded = expanded[category.folderName];
                        const hasActiveChild = category.items.some((w) => w.slug === currentSlug);

                        return (
                            <div key={category.folderName} className="rounded-lg bg-neutral-800/30">
                                <button
                                    onClick={() => toggleCategory(category.folderName)}
                                    className={cn(
                                        "flex w-full items-center justify-between px-3 py-2.5 text-sm font-medium transition-colors",
                                        hasActiveChild ? "text-primary" : "text-neutral-300 hover:text-neutral-100"
                                    )}>
                                    <span className="flex items-center gap-2">{category.title}</span>
                                    <ChevronDownIcon
                                        className={cn("h-4 w-4 text-neutral-500 transition-transform duration-200", isExpanded && "rotate-180")}
                                    />
                                </button>

                                <div
                                    className={cn(
                                        "overflow-hidden transition-all duration-200",
                                        isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                                    )}>
                                    <ul className="space-y-0.5 px-2 pb-2">
                                        {category.items.map((item) => (
                                            <li key={item.slug}>
                                                <Link
                                                    href={`/wiki/${item.slug}`}
                                                    className={cn(
                                                        "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                                                        currentSlug === item.slug
                                                            ? "bg-primary/10 text-primary"
                                                            : "text-neutral-400 hover:bg-neutral-700/50 hover:text-neutral-200"
                                                    )}>
                                                    <ChevronRightIcon className="h-3 w-3 text-neutral-600" />
                                                    {item.title}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        );
                    })}
                </nav>
            </div>
        </aside>
    );
}
