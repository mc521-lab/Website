import { wiki_navigation } from "@/.velite";
import { SectionLayout } from "@/components/experimental/components/section-layout";

const wikiNav = wiki_navigation.map((group) => ({
    ...group,
    items: group.items.map((item) => ({
        ...item,
        href: "/wiki" + item.href,
    })),
}));

export default function WikiLayout({ children }: { children: React.ReactNode }) {
    return (
        <SectionLayout
            generalProps={{
                navigation: wikiNav,
                header: {
                    label: "WIKI",
                    title: "君庭阁百科",
                    description: "服务器玩法、规则与指令文档",
                },
                layoutClassName: "wiki-island-layout",
            }}>
            {children}
        </SectionLayout>
    );
}


