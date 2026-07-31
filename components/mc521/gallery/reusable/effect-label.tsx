"use client";

import { EFFECT_ICON, EFFECT_LABEL } from "../constant";
import { GalleryIcon } from "./gallery-icon";

export interface EffectLabelProps {
    effect: string;
    className?: string;
    iconSize?: number;
}

export function EffectLabel({ effect, className, iconSize = 14 }: EffectLabelProps) {
    return (
        <span className={`flex items-center gap-1.5 ${className}`}>
            <GalleryIcon icon={EFFECT_ICON[effect]} width={iconSize} height={iconSize} />
            {EFFECT_LABEL[effect] ?? effect}
        </span>
    );
}
