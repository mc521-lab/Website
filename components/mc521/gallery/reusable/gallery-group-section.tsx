"use client";

import type { CSSProperties, ReactNode } from "react";
import { IconifyIcon } from "@/components/iconify-icon";
import { cn } from "@/lib/utils";

interface GalleryGroupSectionProps {
    title: string;
    description: string;
    icon: string;
    accent?: string;
    meta?: ReactNode;
    aside?: ReactNode;
    className?: string;
    contentClassName?: string;
    children: ReactNode;
}

export function GalleryGroupSection({
    title,
    description,
    icon,
    accent = "#d7ad4f",
    meta,
    aside,
    className,
    contentClassName,
    children,
}: GalleryGroupSectionProps) {
    return (
        <section
            className={cn("gallery-group-section", className)}
            style={{ "--gallery-group-accent": accent } as CSSProperties}>
            <header className="gallery-group-header">
                <div className="gallery-group-heading-wrap">
                    <span className="gallery-group-icon" aria-hidden="true">
                        <IconifyIcon icon={icon} width={22} height={22} />
                    </span>
                    <div className="min-w-0">
                        <div className="gallery-group-title-row">
                            <h2 className="gallery-group-title">{title}</h2>
                            {meta ? <div className="gallery-group-meta">{meta}</div> : null}
                        </div>
                        <p className="gallery-group-description">{description}</p>
                    </div>
                </div>

                {aside ? <div className="gallery-group-aside">{aside}</div> : null}
            </header>

            <div className={cn("gallery-group-content", contentClassName)}>{children}</div>
        </section>
    );
}
