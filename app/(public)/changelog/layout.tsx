import { changelog_navigation } from "@/.velite";
import { SectionLayout } from "@/components/experimental/components/section-layout";

const changelogNav = changelog_navigation.map((group) => ({
    ...group,
    items: group.items.map((item) => ({
        ...item,
        href: "/changelog" + item.href,
    })),
}));

export default function ChangelogLayout({ children }: { children: React.ReactNode }) {
    return (
        <SectionLayout
            generalProps={{
                navigation: changelogNav,
                header: {
                    label: "CHANGELOG",
                    title: "更新日志",
                    description: "服务器版本更新、补丁说明与历史版本记录",
                },
            }}>
            {children}
        </SectionLayout>
    );
}

