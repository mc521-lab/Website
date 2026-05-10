"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
    return (
        <NextThemesProvider
            {...props}
            // 禁用 nonce 来避免 script 标签警告
            nonce="">
            {children}
        </NextThemesProvider>
    );
}
