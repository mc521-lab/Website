"use client";

import { IslandSidebar, type IslandNavEntry, type IslandSidebarHeader } from "@/components/layout/island-sidebar";
import { cn } from "@/lib/utils";

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

export function LegacySectionLayout({
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
                <main className={cn("island-content better-scroll-bar backdrop-blur-lg", contentClassName)}>
                    <div className={cn("island-content-inner", contentInnerClassName)}>
                        {mobileToolbar}
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
