import { changelog_navigation } from "@/.velite";
import { IslandSidebar } from "@/components/mc521/layout/island-sidebar";

const changelogNav = changelog_navigation.map((group) => ({
    ...group,
    items: group.items.map((item) => ({
        ...item,
        href: "/changelog" + item.href,
    })),
}));

export default function ChangelogLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="island-page">
            <div className="island-layout">
                <IslandSidebar
                    navigation={changelogNav}
                    header={{
                        label: "CHANGELOG",
                        title: "更新日志",
                        description: "服务器版本更新、补丁说明与历史版本记录",
                    }}
                />

                <main className="island-content better-scroll-bar">
                    <div className="island-content-inner">{children}</div>
                </main>
            </div>
        </div>
    );
}