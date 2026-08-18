import { tools_navigation } from "@/.velite";
import type { IslandNavItem } from "@/components/mc521/layout/island-sidebar";
import { SectionLayoutSwitch } from "@/components/mc521/layout/experimental/section-layout-switch";

const toolsNav = tools_navigation as unknown as IslandNavItem[];

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
    return (
        <SectionLayoutSwitch
            navigation={toolsNav}
            header={{
                label: "TOOLS",
                title: "君庭阁工具箱",
                description: "服务器实用工具与辅助功能",
            }}
            sidebarClassName="md:w-[286px]"
            contentInnerClassName="flex flex-col"
        >
            {children}
        </SectionLayoutSwitch>
    );
}
