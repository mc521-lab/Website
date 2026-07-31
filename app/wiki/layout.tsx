import { WikiSidebar } from "@/components/mc521/layout/wiki-sidebar";

export default function WikiLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="wiki-page">
            <div className="wiki-layout">
                {/* 左侧边栏 */}
                <WikiSidebar />

                {/* 右侧主内容 */}
                <main className="wiki-content better-scroll-bar">
                    <div className="wiki-content-inner">{children}</div>
                </main>
            </div>
        </div>
    );
}
