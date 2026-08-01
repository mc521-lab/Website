"use client";

import { GalleryIcon } from "./gallery-icon";

export interface StatRowProps {
    label: string;
    icon?: string;
    value: string;
    suffix?: string;
}

export function StatRow({ label, icon, value, suffix = "" }: StatRowProps) {
    if (value === "—") return null;
    return (
        <div className="flex justify-between gap-2 text-sm">
            <span className="text-muted-foreground flex shrink-0 items-center gap-2">
                <GalleryIcon icon={icon} width={16} height={16} />
                {label}
            </span>
            <span className="text-right font-medium tabular-nums">
                {value}
                {suffix}
            </span>
        </div>
    );
}
