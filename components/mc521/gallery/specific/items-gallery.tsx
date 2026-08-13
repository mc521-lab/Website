"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { QualityBadge } from "../reusable/quality-badge";
import { GalleryContentSection } from "../reusable/gallery-content-section";
import { GalleryItemImage } from "../reusable/gallery-item-image";
import { GalleryShell } from "../reusable/gallery-shell";

interface GalleryItem {
    id: string;
    basic: { name: string; quality?: string };
    usage: string[];
    source: string[];
    limit: string[];
    variants?: string[];
    variant?: string[];
}

export interface GallerySourceRule {
    pattern: RegExp;
    icon: ReactNode;
}

export interface ItemsGalleryPageProps {
    items: GalleryItem[];
    title: string;
    description: string;
    isGif?: boolean;
    sourceRules?: GallerySourceRule[];
    variantStyles?: string[];
    filterBar?: ReactNode;
    empty?: ReactNode;
}

function getSourceIcon(source: string, rules?: GallerySourceRule[]) {
    return rules?.find((rule) => rule.pattern.test(source))?.icon;
}

function getVariantImageSrc(variant: string, isGif?: boolean) {
    return `/gallery/${variant}.${isGif ? "gif" : "png"}`;
}

function CardHeading({ item, isGif, variantStyles }: { item: GalleryItem; isGif?: boolean; variantStyles?: string[] }) {
    const variants = useMemo(() => item.variants ?? item.variant ?? [], [item.variant, item.variants]);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        if (variants.length <= 1) return;

        const timer = window.setInterval(() => {
            setActiveIndex((current) => (current + 1) % variants.length);
        }, 2200);

        return () => window.clearInterval(timer);
    }, [variants.length]);

    const activeVariant = variants[activeIndex] ?? item.basic.name;

    return (
        <div className="flex items-center gap-2">
            <GalleryItemImage key={item.id} src={getVariantImageSrc(activeVariant, isGif)} alt={activeVariant} />
            <div className="ml-1 flex h-full min-w-0 flex-1 flex-col justify-center">
                <h3 className="truncate text-base leading-tight font-semibold">
                    {item.basic.name} {item.basic.quality && <QualityBadge quality={item.basic.quality} />}
                </h3>
                {variantStyles && variantStyles.length > 0 && (
                    <div className="mt-2 flex gap-2">
                        {variants.map((variant, index) => {
                            const isActive = index === activeIndex;
                            const color = variantStyles[index % variantStyles.length];
                            return (
                                <span
                                    key={`${variant}-${index}`}
                                    className={cn(
                                        "block size-2 rounded-full transition-[width] duration-150 ease-in-out",
                                        isActive ? "w-4" : "w-2"
                                    )}
                                    style={{ backgroundColor: color }}
                                />
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export function ItemCard({
    item,
    isGif,
    sourceRules,
    variantStyles,
}: {
    item: GalleryItem;
    isGif?: boolean;
    sourceRules?: GallerySourceRule[];
    variantStyles?: string[];
}) {
    const header = <CardHeading item={item} isGif={isGif} variantStyles={variantStyles} />;

    return (
        <article className="gallery-item-card border-border bg-card relative flex flex-col overflow-hidden rounded-xl border p-4 shadow-sm">
            <div className="gallery-card-header mb-3 flex items-start gap-2">{header}</div>
            <div className="space-y-2.5">
                <GalleryContentSection title="用途" icon="lucide:wand-2" items={item.usage} />

                {item.source.length > 0 && (
                    <GalleryContentSection
                        title="来源"
                        icon="lucide:map-pin"
                        items={item.source}
                        listClassName="grid grid-cols-1 gap-2 sm:grid-cols-2"
                        itemClassName="border-border/70 bg-background/80 flex items-center gap-1.5 rounded-md border px-2 py-1 text-sm shadow-sm"
                        renderItem={(source) => {
                            const icon = getSourceIcon(source, sourceRules);
                            return (
                                <>
                                    {icon}
                                    <span className="text-foreground/80 min-w-0 truncate">{source}</span>
                                </>
                            );
                        }}
                    />
                )}

                <GalleryContentSection title="限制" icon="lucide:alert-triangle" items={item.limit} />
            </div>
        </article>
    );
}

export function ItemsGalleryPage({
    items,
    title,
    description,
    isGif = false,
    sourceRules,
    variantStyles,
    filterBar,
    empty,
}: ItemsGalleryPageProps) {
    return (
        <GalleryShell
            title={title}
            subtitle={description}
            filterBar={filterBar}
            isEmpty={items.length === 0}
            empty={empty}
        >
            <div className={cn("grid grid-cols-1 gap-4", "sm:grid-cols-2", "lg:grid-cols-3 xl:grid-cols-4")}>
                {items.map((item) => (
                    <ItemCard
                        key={item.id}
                        item={item}
                        isGif={isGif}
                        sourceRules={sourceRules}
                        variantStyles={variantStyles}
                    />
                ))}
            </div>
        </GalleryShell>
    );
}
