import { tools_navigation } from "@/.velite";
import { IslandSidebar } from "@/components/mc521/layout/island-sidebar";
import type { IslandNavItem } from "@/components/mc521/layout/island-sidebar";

const toolsNav = tools_navigation as unknown as IslandNavItem[];

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="island-page">
            <div className="island-layout">
                {/* 左侧边栏 */}
                <IslandSidebar
                    navigation={toolsNav}
                    header={{
                        label: "TOOLS",
                        title: "君庭阁工具箱",
                        description: "服务器实用工具与辅助功能",
                    }}
                />

                {/* 右侧主内容 */}
                <main className="island-content better-scroll-bar">
                    <div className="island-content-inner flex flex-col">{children}</div>
                </main>
            </div>
        </div>
    );
}
