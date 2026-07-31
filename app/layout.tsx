import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/mc521/layout/nav-bar";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

import "@/assets/globals.css";
import { Figtree } from "next/font/google";
import { MyVideo } from "@/components/mc521/markdown/my";

const figtree = Figtree({ subsets: ["latin"], variable: "--font-sans" });

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning className={cn("antialiased", "font-sans", figtree.variable)}>
            <body>
                <div className="fixed top-0 left-0 -z-2 h-screen w-screen scale-125">
                    <MyVideo src="/images/mc-background-video.webm" raw />
                </div>
                <div className="bg-background/50 fixed top-0 left-0 h-screen w-screen -z-1"></div>
                <ThemeProvider>
                    <div className="flex min-h-screen flex-col">
                        <Navbar />
                        {children}
                    </div>
                    <Toaster />
                </ThemeProvider>
            </body>
        </html>
    );
}
