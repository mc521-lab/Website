import { Layout, Navbar } from "nextra-theme-docs";
import { Banner } from "nextra/components";
import { getPageMap } from "nextra/page-map";
import "nextra-theme-docs/style.css";
import { PageMapItem } from "nextra";

export const metadata = {
    // Define your metadata here
    // For more information on metadata API, see: https://nextjs.org/docs/app/building-your-application/optimizing/metadata
};

const banner = <Banner>🚧 重要通知 | 本 Wiki 仍在建设中，如有问题请及时反馈 🚧</Banner>;
const navbar = <Navbar logo={<b>君庭阁 Wiki</b>} />;

const overridePageMap = { 0: { title: "⭐ 纯新手必看教程" } };
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

    console.debug(mergePageMap(pageMap, overridePageMap));

    return (
        <Layout
            banner={banner}
            navbar={navbar}
            footer={null}
            pageMap={mergePageMap(pageMap, overridePageMap)}
            docsRepositoryBase="https://github.com/mc521-lab/Website/tree/v4/content/wiki">
            {children}
        </Layout>
    );
}
