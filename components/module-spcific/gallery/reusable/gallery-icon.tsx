"use client";

import { IconifyIcon } from "@/components/iconify-icon";

export interface GalleryIconProps {
    icon: string | undefined;
    width?: number;
    height?: number;
    className?: string;
    style?: React.CSSProperties;
}

export function GalleryIcon({ icon, width = 16, height = 16, className, style }: GalleryIconProps) {
    if (!icon) return null;
    const [name, color] = icon.includes("|") ? icon.split("|") : [icon, undefined];
    return (
        <IconifyIcon
            icon={name}
            width={width}
            height={height}
            className={className}
            style={color ? { color, ...style } : style}
        />
    );
}
