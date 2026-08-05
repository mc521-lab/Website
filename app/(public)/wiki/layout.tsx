import { wiki_navigation } from "@/.velite";
import { WikiLayoutClient } from "@/components/mc521/wiki/wiki-layout-client";
import type { IslandNavEntry } from "@/components/mc521/layout/island-sidebar";

const wikiNav: IslandNavEntry[] = wiki_navigation.map((group) => ({
    ...group,
    items: group.items.map((item) => ({
        ...item,
        href: "/wiki" + item.href,
    })),
}));

export default function WikiLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="island-page">
            <WikiLayoutClient
                navigation={wikiNav}
                header={{
                    label: "WIKI",
                    title: "君庭阁百科",
                    description: "服务器玩法、规则与指令文档",
                }}>
                {children}
            </WikiLayoutClient>
        </div>
    );
}
