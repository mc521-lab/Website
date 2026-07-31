import { GallerySidebar } from "@/components/mc521/layout/gallery-sidebar";

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="h-[calc(100vh-64px)] p-4">
            <div className="flex h-full gap-4">
                {/* 左侧边栏 */}
                <GallerySidebar />

                {/* 右侧主内容 */}
                <main className="bg-background/50 better-scroll-bar min-h-0 min-w-0 flex-1 overflow-y-auto rounded-lg px-8 py-10 backdrop-blur-lg lg:px-12">
                    {children}
                </main>
            </div>
        </div>
    );
}

