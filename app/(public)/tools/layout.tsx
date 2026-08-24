import { tools_navigation } from "@/.velite";
import { SectionLayout } from "@/components/experimental/components/section-layout";

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
    return (
        <SectionLayout
            generalProps={{
                navigation: tools_navigation,
                header: {
                    label: "TOOLS",
                    title: "君庭阁工具箱",
                    description: "服务器实用工具与辅助功能",
                },
                sidebarClassName: "md:w-[286px]",
                contentInnerClassName: "flex flex-col",
            }}>
            {children}
        </SectionLayout>
    );
}


