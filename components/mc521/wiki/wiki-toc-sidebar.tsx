"use client";

import * as React from "react";
import { useToc, type TocItem } from "./toc-context";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { IconifyIcon } from "@/components/iconify-icon";

const FLASH_DURATION = 600;

function scrollToHeading(id: string) {
    const el = document.getElementById(id);
    if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        history.replaceState(null, "", `#${id}`);
        el.classList.remove("toc-heading-flash");
        void el.offsetWidth;
        el.classList.add("toc-heading-flash");
        setTimeout(() => el.classList.remove("toc-heading-flash"), FLASH_DURATION * 2);
    }
}

interface TocNode {
    item: TocItem;
    children: TocNode[];
}

function buildTocTree(items: TocItem[]): TocNode[] {
    const roots: TocNode[] = [];
    const stack: TocNode[] = [];

    for (const item of items) {
        const node: TocNode = { item, children: [] };

        while (stack.length > 0 && stack[stack.length - 1].item.level >= item.level) {
            stack.pop();
        }

        if (stack.length === 0) {
            roots.push(node);
        } else {
            stack[stack.length - 1].children.push(node);
        }

        stack.push(node);
    }

    return roots;
}

function TocNodeView({
    node,
    depth,
    activeId,
    collapsed,
    expandedMap,
    onToggle,
}: {
    node: TocNode;
    depth: number;
    activeId: string | null;
    collapsed: boolean;
    expandedMap: Record<string, boolean>;
    onToggle: (id: string) => void;
}) {
    const hasChildren = node.children.length > 0;
    const isOpen = expandedMap[node.item.id] !== false;
    const level = node.item.level;

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        scrollToHeading(node.item.id);
    };

    const indentPx = 8 + depth * 14;

    return (
        <li className={cn("wiki-toc-item", `wiki-toc-l${level}`, collapsed && "is-collapsed")}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <a
                        href={`#${node.item.id}`}
                        className="wiki-toc-link"
                        onClick={handleClick}
                        style={{ paddingLeft: `${indentPx}px` }}>
                        {hasChildren && (
                            <span
                                className={cn("wiki-toc-chevron -translate-x-0.5", isOpen && "is-open")}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onToggle(node.item.id);
                                }}>
                                <IconifyIcon icon="lucide:chevron-right" />
                            </span>
                        )}
                        {!hasChildren && <span className="wiki-toc-indent" />}
                        {collapsed ? (
                            <span className="wiki-toc-dashes">{"—".repeat(level)}</span>
                        ) : (
                            <span className="wiki-toc-text">{node.item.text}</span>
                        )}
                    </a>
                </TooltipTrigger>
                {collapsed && (
                    <TooltipContent side="left" className="wiki-toc-tooltip">
                        <span className={`wiki-toc-tooltip-l${level}`}>{node.item.text}</span>
                    </TooltipContent>
                )}
            </Tooltip>

            {hasChildren && isOpen && !collapsed && (
                <ul>
                    {node.children.map((child) => (
                        <TocNodeView
                            key={child.item.id}
                            node={child}
                            depth={depth + 1}
                            activeId={activeId}
                            collapsed={collapsed}
                            expandedMap={expandedMap}
                            onToggle={onToggle}
                        />
                    ))}
                </ul>
            )}
        </li>
    );
}

export function WikiTocSidebar() {
    const { items, activeId, collapsed, setCollapsed } = useToc();
    const [expandedMap, setExpandedMap] = React.useState<Record<string, boolean>>({});

    const toggleItem = React.useCallback((id: string) => {
        setExpandedMap((prev) => ({ ...prev, [id]: prev[id] === false ? true : false }));
    }, []);

    const tree = React.useMemo(() => buildTocTree(items), [items]);

    if (items.length === 0) return null;

    return (
        <aside className={cn("wiki-toc-sidebar better-scroll-bar", collapsed && "is-collapsed")}>
            <div className="wiki-toc-header">
                {!collapsed && <span className="wiki-toc-label text-foreground! text-base!">目录</span>}
                <button
                    type="button"
                    className="wiki-toc-toggle"
                    onClick={() => setCollapsed(!collapsed)}
                    aria-label={collapsed ? "展开目录" : "收起目录"}>
                    <IconifyIcon icon={collapsed ? "lucide:chevron-left" : "lucide:chevron-right"} />
                </button>
            </div>
            <TooltipProvider delayDuration={180}>
                <nav className="wiki-toc-nav">
                    <ul>
                        {tree.map((node) => (
                            <TocNodeView
                                key={node.item.id}
                                node={node}
                                depth={0}
                                activeId={activeId}
                                collapsed={collapsed}
                                expandedMap={expandedMap}
                                onToggle={toggleItem}
                            />
                        ))}
                    </ul>
                </nav>
            </TooltipProvider>
        </aside>
    );
}
