import { WikiSidebar } from "@/components/mc521/layout/wiki-sidebar";

export default function WikiLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="h-[calc(100vh-64px)] p-4">
            <div className="flex h-full gap-4">
                {/* 左侧边栏 */}
                <WikiSidebar />

                {/* 右侧主内容 */}
                <main className="bg-[color-mix(in_oklch,color-mix(in_oklch,var(--color-background)_75%,var(--color-muted)),transparent_10%)] better-scroll-bar min-h-0 min-w-0 flex-1 overflow-y-auto rounded-lg px-8 py-10 backdrop-blur-lg lg:px-12">
                    {/* <div className="bg-muted/50 h-full w-full "> */}
                    <div className="max-w-5xl">{children}</div>
                    {/* </div> */}
                </main>
            </div>
        </div>
    );
}

