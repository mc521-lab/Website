import { WikiSidebar } from "@/components/mc521/layout/wiki-sidebar";

export default function WikiLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-background/90 h-[calc(100vh-64px)]">
            <div className="flex h-full">
                {/* 左侧边栏 */}
                <WikiSidebar />

                {/* 右侧主内容 */}
                <main className="min-h-0 min-w-0 flex-1 overflow-y-auto px-8 py-10 lg:px-12">
                    <div className="max-w-5xl">{children}</div>
                </main>
            </div>
        </div>
    );
}

