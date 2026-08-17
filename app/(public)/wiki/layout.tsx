import { wiki_navigation } from "@/.velite";
import { SectionLayoutSwitch } from "@/components/mc521/layout/section-layout-switch";

const wikiNav = wiki_navigation.map((group) => ({
    ...group,
    items: group.items.map((item) => ({
        ...item,
        href: "/wiki" + item.href,
    })),
}));

export default function WikiLayout({ children }: { children: React.ReactNode }) {
    return (
        <SectionLayoutSwitch
            navigation={wikiNav}
            header={{
                label: "WIKI",
                title: "君庭阁百科",
                description: "服务器玩法、规则与指令文档",
            }}
            sidebarClassName="md:w-[272px]"
            layoutClassName="wiki-island-layout"
        >
            {children}
        </SectionLayoutSwitch>
    );
}
