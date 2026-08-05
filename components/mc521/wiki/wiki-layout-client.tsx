"use client";

import * as React from "react";
import { TocProvider, useTocActiveSpy } from "./toc-context";
import { WikiTocSidebar } from "./wiki-toc-sidebar";
import { IslandSidebar, type IslandNavEntry, type IslandSidebarHeader } from "@/components/mc521/layout/island-sidebar";

function ContentSpy({ children }: { children: React.ReactNode }) {
    const ref = React.useRef<HTMLElement>(null);
    useTocActiveSpy(ref);

    React.useEffect(() => {
        const hash = window.location.hash.slice(1);
        if (hash) {
            setTimeout(() => {
                const el = document.getElementById(hash);
                if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 100);
        }
    }, []);

    return (
        <main ref={ref} className="island-content better-scroll-bar">
            <div className="island-content-inner">{children}</div>
        </main>
    );
}

export function WikiLayoutClient({
    navigation,
    header,
    children,
}: {
    navigation: IslandNavEntry[];
    header: IslandSidebarHeader;
    children: React.ReactNode;
}) {
    return (
        <TocProvider>
            <div className="island-layout">
                <IslandSidebar navigation={navigation} header={header} />
                <ContentSpy>{children}</ContentSpy>
                <WikiTocSidebar />
            </div>
        </TocProvider>
    );
}
