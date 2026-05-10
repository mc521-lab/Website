import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Noto_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const notoSans = Noto_Sans({
    variable: "--font-sans",
    subsets: ["latin"],
    display: "swap",
    preload: true,
});

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
    display: "swap",
    preload: true,
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
    display: "swap",
    preload: true,
});

export const metadata: Metadata = {
    title: "君庭阁 · 1.21.11",
    description: "君庭阁我的世界服务器 - 二十余年，同在一片方块天。重度 RPG 体验与生存乐趣并存，纯粹公益、优化极致。",
    keywords: ["Minecraft", "我的世界", "MC521", "君庭阁", "服务器", "RPG", "生存"],
    authors: [{ name: "MC521 Team" }],
    openGraph: {
        title: "君庭阁 · 1.21.11",
        description: "二十余年，同在一片方块天",
        type: "website",
    },
};

export const viewport: Viewport = {
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "white" },
        { media: "(prefers-color-scheme: dark)", color: "#1a1a1a" },
    ],
    width: "device-width",
    initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="zh-CN" suppressHydrationWarning>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
                {/* eslint-disable-next-line @next/next/google-font-preconnect */}
                <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
            </head>
            <body className={`${notoSans.variable} ${geistSans.variable} ${geistMono.variable} overflow-x-hidden antialiased`}>
                <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
                    {children}
                </ThemeProvider>
                <SpeedInsights />
            </body>
        </html>
    );
}
