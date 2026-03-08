"use client";

import { cva } from "class-variance-authority";
import React from "react";

type HomeButtonProps = {
    text: string;
    theme?: "light" | "dark" | "primary";
    children?: React.ReactNode;
    onClick?: () => void;
    className?: string;
    extraClassName?: string;
};

export const buttonVariants = cva(
    "group hover:border-primary relative cursor-pointer border-2 px-8 py-4 text-lg font-bold shadow-[4px_4px_0_#000] transition-all active:translate-y-1",
    {
        variants: {
            theme: {
                dark: "text-foreground border-neutral-600 bg-neutral-800",
                light: "text-background border-neutral-800 bg-neutral-300",
                primary: "text-primary-foreground border-primary bg-primary",
            },
        },
        defaultVariants: {
            theme: "dark",
        },
    }
);

export const buttonInnerVariants = cva("absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100", {
    variants: {
        theme: {
            dark: "bg-primary/10",
            light: "bg-primary/10",
            primary: "bg-muted/15",
        },
    },
    defaultVariants: {
        theme: "dark",
    },
});

export function HomeButton({ text, theme = "dark", children, onClick, className, extraClassName }: HomeButtonProps) {
    return (
        <button onClick={onClick} className={buttonVariants({ theme, className })}>
            {children ? (
                <span className="flex items-center gap-3">
                    <div className="translate-y-px">{children}</div>
                    {text}
                </span>
            ) : (
                <span className={extraClassName}>{text}</span>
            )}
            <div className={buttonInnerVariants({ theme })}></div>
        </button>
    );
}
