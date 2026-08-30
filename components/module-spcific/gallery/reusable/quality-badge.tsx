"use client";

import { cn } from "@/lib/utils";
import { QUALITY_COLOR, QUALITY_LABEL } from "../../../../lib/constant";

export interface QualityBadgeProps {
    quality: string;
    className?: string;
}

export function QualityBadge({ quality, className }: QualityBadgeProps) {
    return (
        <span
            className={cn(
                "inline-flex items-center justify-center rounded px-2 py-0.5 text-xs font-semibold tracking-wide",
                QUALITY_COLOR[quality as keyof typeof QUALITY_COLOR],
                className
            )}>
            {QUALITY_LABEL[quality as keyof typeof QUALITY_LABEL] ?? quality}
        </span>
    );
}
