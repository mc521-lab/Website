"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";

import { IconifyIcon } from "@/components/iconify-icon";
import type { IslandNavEntry, IslandSidebarHeader } from "@/components/layout/island-sidebar";
import { cn } from "@/lib/utils";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader as SidebarChromeHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarSeparator,
} from "@/components/ui/sidebar";

type SectionLayoutSwitchProps = {
    navigation: IslandNavEntry[];
    header: IslandSidebarHeader;
    children: React.ReactNode;
    layoutClassName?: string;
    sidebarClassName?: string;
    contentClassName?: string;
    contentInnerClassName?: string;
    mobileToolbar?: React.ReactNode;
    sidebarFooter?: React.ReactNode;
};

function sortByOrder<T extends { order?: number }>(items: T[]): T[] {
    return [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

function isGroup(entry: IslandNavEntry): entry is Extract<IslandNavEntry, { items: IslandNavEntry[] }> {
    return "items" in entry && Array.isArray(entry.items);
}

function ExperimentalNavItem({ item }: { item: Extract<IslandNavEntry, { href: string; title: string }> }) {
    const pathname = usePathname();
    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

    return (
        <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive} className="h-10 px-3">
                <Link href={item.href}>
                    {item.icon && (
                        <span className="grid size-5 shrink-0 place-items-center text-[15px] opacity-85">
                            <IconifyIcon icon={item.icon} />
                        </span>
                    )}
                    <span>{item.title}</span>
                </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
    );
}

function ExperimentalNavGroup({ group }: { group: Extract<IslandNavEntry, { items: IslandNavEntry[] }> }) {
    const pathname = usePathname();
    const [manualExpanded, setManualExpanded] = useState(group.defaultExpanded ?? false);
    const isActiveGroup = useMemo(
        () => group.items.some((item) => pathname === item.href || pathname.startsWith(`${item.href}/`)),
        [pathname, group.items]
    );
    const sortedItems = sortByOrder(group.items);
    const isExpanded = isActiveGroup || manualExpanded;

    if (sortedItems.length === 0 && group.href) {
        return <ExperimentalNavItem item={{ title: group.title, href: group.href, icon: group.icon, order: group.order }} />;
    }

    return (
        <SidebarGroup className="gap-2 px-2 py-1">
            <button
                type="button"
                onClick={() => setManualExpanded((prev) => !prev)}
                aria-expanded={isExpanded}
                className={cn(
                    "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-xs font-semibold tracking-[0.12em] transition-colors",
                    isExpanded && "text-sidebar-foreground"
                )}>
                {group.icon && (
                    <span className="border-primary/70 bg-primary/25 scale-90 rounded-xs border p-1">
                        <IconifyIcon icon={group.icon} fontSize={16} />
                    </span>
                )}
                <span className="flex-1 text-sm">{group.title}</span>
                <ChevronDown className={cn("size-4 transition-transform", isExpanded && "rotate-180")} />
            </button>
            <div
                className={cn(
                    "grid transition-[grid-template-rows] duration-200 ease-out",
                    isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                )}>
                <SidebarGroupContent className="overflow-hidden">
                    <SidebarMenu className="gap-1 px-1 pb-1">
                        {sortedItems.map((item) => (
                            <ExperimentalNavItem key={item.href} item={item} />
                        ))}
                    </SidebarMenu>
                </SidebarGroupContent>
            </div>
        </SidebarGroup>
    );
}

export function ExperimentalSectionLayout({
    navigation,
    header,
    children,
    sidebarClassName,
    contentClassName,
    contentInnerClassName,
    mobileToolbar,
    sidebarFooter,
}: SectionLayoutSwitchProps) {
    const sortedNav = sortByOrder(navigation);

    return (
        <SidebarProvider defaultOpen className="grid min-h-0! flex-1! grid-cols-1 md:grid-cols-[calc(72*var(--spacing))_1fr]">
            <div className="flex flex-1 flex-col">
                <Sidebar
                    collapsible="none"
                    className={cn(
                        "better-scroll-bar border-border/10 bg-sidebar! relative h-full w-full overflow-hidden md:shrink-0 md:rounded-e-none md:border-e-0",
                        sidebarClassName
                    )}
                    suppressHydrationWarning>
                    <SidebarChromeHeader className="gap-0 p-0">
                        <div className="border-sidebar-border/70 rounded-none border-b px-4 py-4">
                            <span className="border-sidebar-primary/20 bg-sidebar-primary/10 text-sidebar-primary inline-flex min-h-6.25 items-center rounded-full border px-3 py-1 text-[11px] font-bold tracking-[0.12em]">
                                {header.label}
                            </span>
                            <h2 className="text-sidebar-foreground mt-3 text-[1.85rem] leading-tight font-bold">
                                {header.title}
                            </h2>
                            {header.description && (
                                <p className="text-sidebar-foreground/65 mt-2 text-sm leading-7">{header.description}</p>
                            )}
                        </div>
                    </SidebarChromeHeader>
                    <SidebarSeparator className="mx-0" />
                    <SidebarContent className="gap-0! px-2 py-3">
                        {sortedNav.map((entry) =>
                            isGroup(entry) ? (
                                <ExperimentalNavGroup key={entry.title} group={entry} />
                            ) : (
                                <SidebarGroup key={entry.href} className="px-2 py-1">
                                    <SidebarMenu className="gap-1">
                                        <ExperimentalNavItem item={entry} />
                                    </SidebarMenu>
                                </SidebarGroup>
                            )
                        )}
                        {sidebarFooter && <div className="px-2 pt-2">{sidebarFooter}</div>}
                    </SidebarContent>
                </Sidebar>
            </div>
            <div className="flex flex-1 flex-col">
                <main
                    className={cn(
                        "island-content better-scroll-bar h-full! w-full min-w-0 rounded-none! border-none!",
                        contentClassName
                    )}>
                    <div className={cn("island-content-inner h-full! border-none!", contentInnerClassName)}>
                        {mobileToolbar}
                        {children}
                    </div>
                </main>
            </div>
        </SidebarProvider>
    );
}
