"use client";

import Image from "next/image";
import type { ReactNode } from "react";

export interface ItemCardShellProps {
    name: string;
    imageSrc: string;
    subtitle?: ReactNode;
    badge?: ReactNode;
    children: ReactNode;
    accent?: string;
    className?: string;
}

export function ItemCardShell({ name, imageSrc, subtitle, badge, children, accent, className }: ItemCardShellProps) {
    return (
        <article
            className={`border-border bg-card relative flex flex-col overflow-hidden rounded-xl border p-4 shadow-sm ${className ?? ""}`.trim()}>
            <div
                className="pointer-events-none absolute inset-x-0 top-0 h-0.5 opacity-80"
                style={{
                    background: `linear-gradient(90deg, transparent, color-mix(in srgb, ${accent ?? "var(--primary)"} 55%, transparent), transparent)`,
                }}
            />

            <div className="mb-3 flex items-start gap-2">
                <Image src={imageSrc} alt={name} width={32} height={32} className="size-8 shrink-0 drop-shadow-sm" />
                <div className="min-w-0 flex-1">
                    <h3 className="truncate text-base leading-tight font-semibold">{name}</h3>
                    {subtitle ? <div className="text-muted-foreground mt-0.5 text-xs">{subtitle}</div> : null}
                </div>
                {badge}
            </div>

            {children}
        </article>
    );
}
