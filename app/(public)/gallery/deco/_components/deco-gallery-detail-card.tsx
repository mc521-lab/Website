"use client";

import { type ReactNode } from "react";
import Image from "next/image";
import { type ItemCardShellProps } from "@/app/(public)/gallery/_components/reusable//item-card-shell";
import { GalleryContentSection } from "@/app/(public)/gallery/_components/reusable//gallery-content-section";
import { cn } from "@/lib/utils";

export interface GalleryDetailCardProps {
    name: string;
    imageSrc: string;
    imageExtraClassName?: string;
    subtitle?: ReactNode;
    accent?: string;
    usage?: string[];
    source?: string[];
    limit?: string[];
    sourceItemClassName?: string;
    renderSourceItem?: (value: string, index: number) => ReactNode;
    children?: ReactNode;
}

function DecoItemCardShell({
    name,
    imageSrc,
    imageExtraClassName,
    subtitle,
    badge,
    children,
    accent,
    className,
}: ItemCardShellProps & { imageExtraClassName?: string }) {
    return (
        <article
            className={cn(
                "border-border bg-card relative flex flex-col overflow-hidden rounded-xl border p-4 shadow-sm",
                className
            )}>
            <div
                className="pointer-events-none absolute inset-x-0 top-0 h-0.5 opacity-80"
                style={{
                    background: `linear-gradient(90deg, transparent, color-mix(in srgb, ${accent ?? "var(--primary)"} 55%, transparent), transparent)`,
                }}
            />

            <div className="grid grid-cols-2 items-center justify-center gap-2">
                <Image
                    src={imageSrc}
                    alt={name}
                    width={32}
                    height={32}
                    className={cn("mx-auto size-16 drop-shadow-sm", imageExtraClassName)}
                />
                <section className="flex flex-col gap-2">
                    <div>
                        <div className="min-w-0 flex-1">
                            <h3 className="truncate text-base leading-tight font-semibold">{name}</h3>
                            {subtitle ? <div className="text-muted-foreground mt-0.5 text-xs">{subtitle}</div> : null}
                        </div>
                        {badge}
                    </div>
                    {children}
                </section>
            </div>
        </article>
    );
}

export function DecoGalleryDetailCard({
    name,
    imageSrc,
    subtitle,
    accent,
    source = [],
    sourceItemClassName,
    imageExtraClassName,
    renderSourceItem,
}: GalleryDetailCardProps) {
    return (
        <DecoItemCardShell
            name={name}
            imageSrc={imageSrc}
            subtitle={subtitle}
            accent={accent}
            imageExtraClassName={imageExtraClassName}>
            <div className="space-y-2.5">
                {source.length > 0 && (
                    <GalleryContentSection
                        title="来源"
                        icon="lucide:map-pin"
                        items={source}
                        listClassName={cn("grid grid-cols-1 gap-2", source.length > 1 && "sm:grid-cols-2")}
                        itemClassName={
                            sourceItemClassName ??
                            "border-border/70 bg-background/80 flex items-center gap-1.5 rounded-md border px-2 py-1 text-sm shadow-sm"
                        }
                        renderItem={renderSourceItem}
                    />
                )}
            </div>
        </DecoItemCardShell>
    );
}
