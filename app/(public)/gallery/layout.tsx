import { gallery_navigation } from "@/.velite";
import { IslandSidebar } from "@/components/mc521/layout/island-sidebar";

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="island-page">
            <div className="island-layout">
                {/* 左侧边栏 */}
                <IslandSidebar
                    navigation={gallery_navigation}
                    header={{
                        label: "GALLERY",
                        title: "君庭阁图鉴",
                        description: "服务器物品、装备与图鉴展示",
                    }}
                />

                {/* 右侧主内容 */}
                <main className="island-content better-scroll-bar">
                    <div className="island-content-inner">{children}</div>
                </main>
            </div>
        </div>
    );
}
