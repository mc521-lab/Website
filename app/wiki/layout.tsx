import { wiki_navigation } from "@/.velite";
import { IslandSidebar } from "@/components/mc521/layout/island-sidebar";

const wikiNav = wiki_navigation.map((group) => ({
    ...group,
    items: group.items.map((item) => ({
        ...item,
        href: "/wiki" + item.href,
    })),
}));

export default function WikiLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="island-page">
            <div className="island-layout">
                {/* 左侧边栏 */}
                <IslandSidebar
                    navigation={wikiNav}
                    header={{
                        label: "WIKI",
                        title: "君庭阁百科",
                        description: "服务器玩法、规则与指令文档",
                    }}
                />

                {/* 右侧主内容 */}
                <main className="island-content better-scroll-bar">
                    <div className="island-content-inner">{children}</div>
                </main>
            </div>
        </div>
    );
}
