"use client";

import type { ReactNode } from "react";

export interface GalleryShellProps {
    title: string;
    subtitle: string;
    filterBar: ReactNode;
    children: ReactNode;
    isEmpty?: boolean;
    empty?: ReactNode;
}

export function GalleryShell({ title, subtitle, filterBar, children, isEmpty, empty }: GalleryShellProps) {
    return (
        <div className="w-full">
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                <p className="text-muted-foreground mt-1">{subtitle}</p>
            </header>

            <div className="mb-6">{filterBar}</div>

            {isEmpty ? (
                (empty ?? (
                    <div className="border-border text-muted-foreground flex flex-col items-center justify-center rounded-xl border border-dashed py-16">
                        <p className="text-lg">暂无符合条件的数据</p>
                        <p className="mt-1 text-sm">请调整筛选条件后重试</p>
                    </div>
                ))
            ) : (
                <div className="flex flex-col gap-6">{children}</div>
            )}
        </div>
    );
}
