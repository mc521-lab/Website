import { ThemeProvider } from "@/components/theme-provider";
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
                <ThemeProvider>
                    <video
                        muted
                        controls={false}
                        autoPlay
                        loop
                        playsInline
                        className="fixed inset-0 -z-10 h-full w-full object-cover">
                        <source src="/images/background.webm" type="video/webm" />
                    </video>
                    <div className="z-10 flex min-h-screen flex-col backdrop-blur-[2px]">{children}</div>
                    <Toaster />
                </ThemeProvider>
            </body>
        </html>
    );
}
