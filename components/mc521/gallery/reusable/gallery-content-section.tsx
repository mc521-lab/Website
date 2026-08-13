"use client";

import type { ReactNode } from "react";
import { IconifyIcon } from "@/components/iconify-icon";
import { cn } from "@/lib/utils";

export interface GalleryContentSectionProps {
    title: ReactNode;
    icon: string;
    children?: ReactNode;
    items?: string[];
    emptyLabel?: ReactNode;
    listClassName?: string;
    itemClassName?: string;
    renderItem?: (item: string, index: number) => ReactNode;
}

export function GalleryContentSection({
    title,
    icon,
    children,
    items,
    emptyLabel = "暂无内容",
    listClassName = "bg-muted space-y-0.5 rounded-md p-2",
    itemClassName = "text-foreground/80 text-sm",
    renderItem,
}: GalleryContentSectionProps) {
    const hasItems = items !== undefined ? items.length > 0 : true;

    if (!hasItems && !children) return null;

    return (
        <div>
            <h4 className="text-muted-foreground mb-1 flex items-center gap-1 text-xs font-medium">
                <IconifyIcon icon={icon} width={12} height={12} />
                {title}
            </h4>
            {children ??
                (hasItems ? (
                    <ul className={cn(listClassName)}>
                        {(items ?? []).map((item, index) =>
                            renderItem ? (
                                <li key={`${item}-${index}`} className={itemClassName}>
                                    {renderItem(item, index)}
                                </li>
                            ) : (
                                <li key={`${item}-${index}`} className={itemClassName}>
                                    {item}
                                </li>
                            )
                        )}
                    </ul>
                ) : (
                    <div className={cn(listClassName)}>
                        <p className="text-muted-foreground text-sm">{emptyLabel}</p>
                    </div>
                ))}
        </div>
    );
}
