"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { IconifyIcon } from "@/components/iconify-icon";

export type IslandNavItem = {
    title: string;
    href: string;
    icon?: string;
    order?: number;
};

export type IslandNavGroup = {
    title: string;
    href?: string;
    icon?: string;
    order?: number;
    defaultExpanded?: boolean;
    items: IslandNavItem[];
};

export type IslandNavEntry = IslandNavGroup | IslandNavItem;

export type IslandSidebarHeader = {
    label: string;
    title: string;
    description?: string;
};

function isGroup(entry: IslandNavEntry): entry is IslandNavGroup {
    return "items" in entry && Array.isArray(entry.items);
}

function sortByOrder<T extends { order?: number }>(items: T[]): T[] {
    return [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

function Wrapper({ children, wrapAsSingleItem }: { children: React.ReactNode; wrapAsSingleItem: boolean }) {
    switch (wrapAsSingleItem) {
        case true:
            return <div className="island-nav-group">{children}</div>;
        case false:
            return children;
    }
}

function IslandNavItemLink({ item, wrapAsSingleItem = false }: { item: IslandNavItem; wrapAsSingleItem?: boolean }) {
    const pathname = usePathname();
    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

    return (
        <Wrapper wrapAsSingleItem={wrapAsSingleItem}>
            <Link href={item.href} className={cn("island-nav-item", isActive && "is-active")}>
                {item.icon && (
                    <span className="island-nav-icon">
                        <IconifyIcon icon={item.icon} />
                    </span>
                )}
                <span className="island-nav-title">{item.title}</span>
            </Link>
        </Wrapper>
    );
}

function IslandNavGroupView({ group }: { group: IslandNavGroup }) {
    const pathname = usePathname();
    const [isExpanded, setIsExpanded] = useState(group.defaultExpanded ?? false);
    const isActiveGroup = useMemo(() => group.items.some((item) => pathname === item.href), [pathname, group.items]);
    const sortedItems = sortByOrder(group.items);

    if (sortedItems.length === 0 && group.href) {
        return <IslandNavItemLink item={{ title: group.title, href: group.href, icon: group.icon, order: group.order }} />;
    }

    useEffect(() => {
        if (isActiveGroup) {
            setIsExpanded(true);
        } else {
            setIsExpanded(false);
        }
    }, [isActiveGroup]);

    return (
        <div className={cn("island-nav-group", !isExpanded && "is-collapsed")}>
            <button
                type="button"
                className="island-nav-group-header"
                onClick={() => setIsExpanded((prev) => !prev)}
                aria-expanded={isExpanded}>
                <span className="flex w-full translate-y-0.5 items-center gap-2">
                    {group.icon && (
                        <span className="island-nav-group-icon" aria-hidden="true">
                            <IconifyIcon icon={group.icon} />
                        </span>
                    )}
                    <span className="text-sm">{group.title}</span>
                    <IconifyIcon icon="lucide:chevron-down" className="island-nav-chevron ml-auto size-4!" />
                </span>
            </button>
            <div className="island-nav-group-body">
                <ul>
                    {sortedItems.map((item, index) => {
                        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                        return (
                            <li key={item.href} className={cn(index === 0 && "mt-2")}>
                                <Link href={item.href} className={cn("island-nav-item", isActive && "is-active")}>
                                    {item.icon && (
                                        <span className="island-nav-icon">
                                            <IconifyIcon icon={item.icon} />
                                        </span>
                                    )}
                                    <span className="island-nav-title">{item.title}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}

export function IslandSidebar({ navigation, header }: { navigation: IslandNavEntry[]; header: IslandSidebarHeader }) {
    const sortedNav = sortByOrder(navigation);

    return (
        <aside className="island-sidebar better-scroll-bar">
            <div className="island-sidebar-header">
                <span className="island-sidebar-label">{header.label}</span>
                <h2>{header.title}</h2>
                {header.description && <p>{header.description}</p>}
            </div>

            <nav className="island-sidebar-nav">
                {sortedNav.map((entry) =>
                    isGroup(entry) ? (
                        <IslandNavGroupView key={entry.title} group={entry} />
                    ) : (
                        <IslandNavItemLink key={entry.href} item={entry} wrapAsSingleItem={true} />
                    )
                )}
            </nav>
        </aside>
    );
}
