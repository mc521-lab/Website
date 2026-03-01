"use client";

import React from "react";

type HomeButtonProps = {
    text: string;
    theme?: "light" | "dark";
    children: React.ReactNode;
    onClick?: () => void;
};
export function HomeButton({ text, theme = "dark", children, onClick }: HomeButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`group hover:border-primary relative cursor-pointer border-2 px-8 py-4 text-lg font-bold shadow-[4px_4px_0_#000] transition-all active:translate-y-1 ${theme === "dark" ? "text-foreground border-neutral-600 bg-neutral-800" : "text-background border-neutral-800 bg-neutral-300"}`}>
            <span className="flex items-center gap-3">
                <div className="translate-y-px">{children}</div>
                {text}
            </span>
            <div className="absolute inset-0 bg-yellow-500/10 opacity-0 transition-opacity group-hover:opacity-100"></div>
        </button>
    );
}
