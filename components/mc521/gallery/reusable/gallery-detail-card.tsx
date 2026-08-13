"use client";

import { type ReactNode } from "react";
import { ItemCardShell } from "./item-card-shell";
import { GalleryContentSection } from "./gallery-content-section";

export interface GalleryDetailCardProps {
    name: string;
    imageSrc: string;
    subtitle?: ReactNode;
    accent?: string;
    usage?: string[];
    source?: string[];
    limit?: string[];
    sourceItemClassName?: string;
    renderSourceItem?: (value: string, index: number) => ReactNode;
    children?: ReactNode;
}

export function GalleryDetailCard({
    name,
    imageSrc,
    subtitle,
    accent,
    usage = [],
    source = [],
    limit = [],
    sourceItemClassName,
    renderSourceItem,
    children,
}: GalleryDetailCardProps) {
    return (
        <ItemCardShell name={name} imageSrc={imageSrc} subtitle={subtitle} accent={accent}>
            <div className="space-y-2.5">
                <GalleryContentSection title="用途" icon="lucide:wand-2" items={usage} />

                {source.length > 0 && (
                    <GalleryContentSection
                        title="来源"
                        icon="lucide:map-pin"
                        items={source}
                        listClassName="grid grid-cols-1 gap-2 sm:grid-cols-2"
                        itemClassName={sourceItemClassName ?? "border-border/70 bg-background/80 flex items-center gap-1.5 rounded-md border px-2 py-1 text-sm shadow-sm"}
                        renderItem={renderSourceItem}
                    />
                )}

                <GalleryContentSection title="限制" icon="lucide:alert-triangle" items={limit} />

                {children}
            </div>
        </ItemCardShell>
    );
}
