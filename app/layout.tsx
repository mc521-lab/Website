import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/mc521/layout/nav-bar";
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
