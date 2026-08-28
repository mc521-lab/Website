"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

import "@/assets/globals.css";
import { Figtree } from "next/font/google";
import { useExperimentalFlags } from "@/hooks/use-experimental-flags";

const figtree = Figtree({ subsets: ["latin"], variable: "--font-sans" });

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { enabledFlags } = useExperimentalFlags();
    return (
        <html lang="en" suppressHydrationWarning className={cn("antialiased", "font-sans", figtree.variable)}>
            <body>
                <ThemeProvider>
                    <video
                        controls={false}
                        muted
                        autoPlay
                        loop
                        playsInline
                        className="fixed inset-0 -z-10 h-full w-full object-cover">
                        <source src="/images/background.webm" type="video/webm" />
                    </video>
                    <div
                        suppressHydrationWarning
                        className={cn(
                            "z-10 flex min-h-screen flex-col",
                            enabledFlags.includes("experimental-new-ui-style") && "backdrop-blur-[2px]"
                        )}>
                        {children}
                    </div>
                    <Toaster />
                </ThemeProvider>
            </body>
        </html>
    );
}
