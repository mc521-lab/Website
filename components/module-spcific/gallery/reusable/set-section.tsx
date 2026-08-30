"use client";

import type { ReactNode } from "react";
import type { GroupTheme } from "../../../../types/gallery";
import { GalleryIcon } from "./gallery-icon";

export interface SetSectionProps {
    title: ReactNode;
    subtitle: ReactNode;
    theme: GroupTheme;
    icon: string;
    children: ReactNode;
    headerExtra?: ReactNode;
}

export function SetSection({ title, subtitle, theme, icon, children, headerExtra }: SetSectionProps) {
    return (
        <section
            className={`relative overflow-hidden rounded-2xl border p-4 shadow-sm sm:p-5 ${theme.frame}`}
            style={{
                boxShadow: `0 12px 40px rgba(0,0,0,.18), 0 0 0 1px color-mix(in srgb, ${theme.accent} 22%, transparent)`,
                backgroundImage: `radial-gradient(circle at 8% 0%, ${theme.glow}, transparent 42%)`,
            }}>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                    <div
                        className="flex size-10 shrink-0 items-center justify-center rounded-lg border"
                        style={{
                            borderColor: `color-mix(in srgb, ${theme.accent} 45%, transparent)`,
                            background: `linear-gradient(180deg, color-mix(in srgb, ${theme.accent} 28%, transparent), color-mix(in srgb, ${theme.accent} 10%, transparent))`,
                            boxShadow: `0 0 16px ${theme.glow}`,
                        }}>
                        <GalleryIcon icon={icon} width={22} height={22} style={{ color: theme.accent2 }} />
                    </div>
                    <div className="min-w-0">
                        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
                        <p className="text-muted-foreground text-sm">{subtitle}</p>
                    </div>
                </div>
                {headerExtra}
            </div>

            {children}
        </section>
    );
}
