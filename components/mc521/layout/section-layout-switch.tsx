"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";

import { IconifyIcon } from "@/components/iconify-icon";
import { IslandSidebar, type IslandNavEntry, type IslandSidebarHeader } from "@/components/mc521/layout/island-sidebar";
import { cn } from "@/lib/utils";
import { EXPERIMENTAL_NEW_UI_FLAG, useExperimentalFlags } from "@/hooks/use-experimental-flags";
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

function useExperimentalSectionUi() {
    const { isEnabled } = useExperimentalFlags();
    return isEnabled(EXPERIMENTAL_NEW_UI_FLAG);
}

function LegacySectionLayout({
    navigation,
    header,
    children,
    layoutClassName,
    sidebarClassName,
    contentClassName,
    contentInnerClassName,
    mobileToolbar,
    sidebarFooter,
}: SectionLayoutSwitchProps) {
    return (
        <div className="island-page">
            <div className={cn("island-layout", layoutClassName)}>
                <IslandSidebar navigation={navigation} header={header} className={sidebarClassName} footer={sidebarFooter} />
                <main className={cn("island-content better-scroll-bar", contentClassName)}>
                    <div className={cn("island-content-inner", contentInnerClassName)}>
                        {mobileToolbar}
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
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
    const [isExpanded, setIsExpanded] = useState(group.defaultExpanded ?? false);
    const isActiveGroup = useMemo(
        () => group.items.some((item) => pathname === item.href || pathname.startsWith(`${item.href}/`)),
        [pathname, group.items]
    );
    const sortedItems = sortByOrder(group.items);

    useEffect(() => {
        setIsExpanded(isActiveGroup);
    }, [isActiveGroup]);

    if (sortedItems.length === 0 && group.href) {
        return <ExperimentalNavItem item={{ title: group.title, href: group.href, icon: group.icon, order: group.order }} />;
    }

    return (
        <SidebarGroup className="gap-2 px-2 py-1">
            <button
                type="button"
                onClick={() => setIsExpanded((prev) => !prev)}
                aria-expanded={isExpanded}
                className={cn(
                    "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-xs font-semibold tracking-[0.12em] transition-colors",
                    isExpanded && "text-sidebar-foreground"
                )}>
                {group.icon && (
                    <span className="border-sidebar-border/70 bg-sidebar-accent/50 grid size-5 shrink-0 place-items-center rounded-md border text-[15px]">
                        <IconifyIcon icon={group.icon} />
                    </span>
                )}
                <span className="flex-1">{group.title}</span>
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

function ExperimentalSectionLayout({
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
        <SidebarProvider defaultOpen>
            <div className="flex h-full min-h-0 max-w-[1920px] flex-col gap-4 md:flex-row md:gap-0">
                <Sidebar
                    collapsible="none"
                    className={cn(
                        "better-scroll-bar border-border/10 relative h-full w-full overflow-hidden bg-transparent md:w-71.5 md:shrink-0 md:rounded-e-none md:border-e-0",
                        sidebarClassName
                    )}>
                    <SidebarChromeHeader className="gap-0 p-0">
                        <div className="border-sidebar-border/70 bg-sidebar/95 rounded-none border-b px-4 py-4">
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
                    <SidebarContent className="gap-2 px-2 py-3">
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
                <main
                    className={cn(
                        "island-content better-scroll-bar min-w-0 flex-1 rounded-none! w-full",
                        contentClassName
                    )}>
                    <div className={cn("island-content-inner", contentInnerClassName)}>
                        {mobileToolbar}
                        {children}
                    </div>
                </main>
            </div>
        </SidebarProvider>
    );
}

export function SectionLayoutSwitch(props: SectionLayoutSwitchProps) {
    const useExperimental = useExperimentalSectionUi();

    if (useExperimental) {
        return <ExperimentalSectionLayout {...props} />;
    }

    return <LegacySectionLayout {...props} />;
}

