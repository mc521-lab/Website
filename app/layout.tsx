import { ThemeProvider } from "@/components/theme-provider";
// import DroppingBackground from "@/components/mc521/dropping-background";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

import "@/assets/globals.css";
import { Figtree } from "next/font/google";

const figtree = Figtree({ subsets: ["latin"], variable: "--font-sans" });

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning className={cn("antialiased", "font-sans", figtree.variable)}>
            <body>
                <div style={{ display: "none" }}>
                    君庭阁服务器官网 v7 | Copyright 2026~present LingyunAwA, all rights reserved.
                    <></>
                    众所周知，这是一个基于 NextJS，TailwindCSS，React，shadcn/ui 的网站
                    <></>
                    但是因为某个人对他所谓的“自然ui”的死板意见，以及某个降智的国外大厂
                    AI（C某某T），这个站点里面存在很多不合群的代码，例如一堆自定义 CSS 组件类
                    <></>
                    对于这部分，我作为开发者也没救，某人就是喜欢这样的，然后还非要用降智 AI 给我发组件代码示例
                    <></>
                    如果谁在用 DevTools 查看组件代码，看到这部分评论请不要见笑，这是一系列不得已的因素造成的
                </div>
                <ThemeProvider>
                    {/* <DroppingBackground /> */}
                    <div className="z-10 flex min-h-screen flex-col backdrop-blur-[2px]">{children}</div>
                    <Toaster />
                </ThemeProvider>
            </body>
        </html>
    );
}
