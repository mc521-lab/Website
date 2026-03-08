import { Layout } from "nextra-theme-docs";
import { Banner } from "nextra/components";
import { getPageMap } from "nextra/page-map";
import { PageMapItem } from "nextra";
import "nextra-theme-docs/style.css";
import "./wiki.css";
import { Mc521 } from "@/components";

export const metadata = {
    title: {
        absolute: "君庭阁 Wiki",
        template: "%s - 君庭阁 Wiki",
    },
};

const banner = <Banner>🚧 重要通知 | 本 Wiki 仍在建设中，如有问题请及时反馈 🚧</Banner>;

const overridePageMap = {
    0: { title: "🔙 返回主页" },
    1: { title: "📑 规章制度" },
    2: { title: "⭐ 纯新手必看教程" },
    3: { title: "🏠 公会系统" },
};
function mergePageMap(pageMap: PageMapItem[], overridePageMap: Record<number, Record<string, string>>) {
    return pageMap.map((item, idx) => {
        if (idx in overridePageMap) {
            return { ...item, ...overridePageMap[idx] };
        }
        return item;
    });
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const pageMap = await getPageMap("/wiki");
    const mergedPageMap = mergePageMap(pageMap, overridePageMap);
    console.debug({ pageMap, mergedPageMap });

    return (
        <Layout
            banner={banner}
            navbar={<Mc521.NavBarWiki />}
            footer={null}
            pageMap={mergedPageMap}
            docsRepositoryBase="https://github.com/mc521-lab/Website/tree/v4/content/wiki">
            {children}
        </Layout>
    );
}
