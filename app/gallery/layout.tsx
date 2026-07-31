import { GallerySidebar } from "@/components/mc521/layout/gallery-sidebar";

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-background/90 h-[calc(100vh-64px)]">
            <div className="flex h-full">
                {/* 左侧边栏 */}
                <GallerySidebar />

                {/* 右侧主内容 */}
                <main className="min-h-0 min-w-0 flex-1 overflow-y-auto">{children}</main>
            </div>
        </div>
    );
}

