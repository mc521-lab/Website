import type { Metadata } from "next";
import { Figtree } from "next/font/google";

import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/mc521/layout/nav-bar";
import { MyVideo } from "@/components/mc521/markdown/my";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

import "@/assets/globals.css";

const figtree = Figtree({
    subsets: ["latin"],
    variable: "--font-sans",
    display: "swap",
});

export const metadata: Metadata = {
    metadataBase: new URL("https://mc521.cc"),
    title: {
        default: "君庭阁 | Minecraft 1.21.11 生存服务器",
        template: "%s | 君庭阁",
    },
    description: "君庭阁 Minecraft 1.21.11 生存服务器官网。查看服务器介绍、百科、图鉴、伤害计算、更新日志与玩家社区入口。",
    keywords: ["君庭阁", "Minecraft", "MC服务器", "生存服务器", "mc521.cc", "1.21.11"],
    openGraph: {
        title: "君庭阁 | Minecraft 1.21.11 生存服务器",
        description: "纯净生存、友好社区、长期稳定运营。",
        url: "https://mc521.cc",
        siteName: "君庭阁",
        locale: "zh_CN",
        type: "website",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="zh-CN" suppressHydrationWarning className={cn("scroll-smooth", "antialiased", "font-sans", figtree.variable)}>
            <body className="min-h-dvh overflow-x-hidden bg-[#0b1017] text-white">
                <div aria-hidden className="fixed inset-0 -z-30 overflow-hidden bg-[#0b0f15]">
                    <div className="absolute inset-0 scale-[1.05] saturate-[1.12] brightness-[0.98] contrast-[1.03] blur-[0.6px]">
                        <MyVideo src="/images/mc-background-video.webm" raw />
                    </div>

                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_26%,rgba(251,146,60,0.18),transparent_24%),radial-gradient(circle_at_50%_34%,rgba(255,244,214,0.16),transparent_18%),radial-gradient(circle_at_84%_18%,rgba(168,85,247,0.18),transparent_24%),radial-gradient(circle_at_68%_82%,rgba(244,114,182,0.10),transparent_24%),radial-gradient(circle_at_42%_88%,rgba(253,186,116,0.08),transparent_20%)]" />

                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,8,16,0.14)_0%,rgba(10,8,16,0.06)_22%,rgba(10,8,16,0.05)_44%,rgba(8,6,12,0.16)_72%,rgba(5,4,8,0.32)_100%)]" />

                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_44%,transparent_0%,transparent_42%,rgba(8,6,10,0.08)_70%,rgba(5,4,8,0.16)_100%)]" />

                    <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#06070b]/56 via-[#06070b]/18 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#040407]/52 via-[#040407]/15 to-transparent" />
                    <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#040407]/18 to-transparent" />
                    <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#040407]/18 to-transparent" />
                </div>

                <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-0 h-44 bg-gradient-to-b from-orange-300/10 via-fuchsia-300/6 to-transparent blur-3xl" />

                <ThemeProvider>
                    <div className="relative z-10 flex min-h-dvh flex-col">
                        <div className="sticky top-0 z-40 border-b border-orange-300/10 bg-[#070b10]/66 shadow-[0_10px_34px_rgba(0,0,0,0.28)] backdrop-blur-xl supports-[backdrop-filter]:bg-[#070b10]/42">
                            <Navbar />
                        </div>

                        <main className="relative flex-1">
                            <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/8 to-transparent" />
                            {children}
                        </main>
                    </div>

                    <Toaster
                        toastOptions={{
                            classNames: {
                                toast: "border border-orange-300/20 bg-[#0d1622]/90 text-white shadow-2xl backdrop-blur-xl",
                                description: "text-white/75",
                                actionButton: "bg-amber-400 text-black hover:bg-amber-300",
                                cancelButton: "bg-white/10 text-white hover:bg-white/15",
                            },
                        }}
                    />
                </ThemeProvider>
            </body>
        </html>
    );
}
