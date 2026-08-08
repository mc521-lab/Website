"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { GalleryItemImage } from "@/components/mc521/gallery/reusable/gallery-item-image";
import { IconifyIcon as Iconify } from "@/components/iconify-icon";
import { cn } from "@/lib/utils";
import { QualityBadge } from "../reusable/quality-badge";

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

function SourceCell({ label, icon }: { label: string; icon?: ReactNode }) {
    const Icon = icon;
    return (
        <li className="border-border/70 bg-background/80 flex items-center gap-1.5 rounded-md border px-2 py-1 text-sm shadow-sm">
            {Icon}
            <span className="text-foreground/80 min-w-0 truncate">{label}</span>
        </li>
    );
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
                <div className="flex flex-col items-start gap-2">
                    <h3 className="truncate text-base leading-tight font-semibold">
                        {item.basic.name} {item.basic.quality && <QualityBadge quality={item.basic.quality} />}
                    </h3>
                    {variantStyles && variantStyles.length > 0 && (
                        <div className="flex gap-2">
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
    return (
        <article className="gallery-item-card border-border bg-card relative flex flex-col overflow-hidden rounded-xl border p-4 shadow-sm">
            <div className="gallery-card-header mb-3 flex items-start gap-2">
                <CardHeading item={item} isGif={isGif} variantStyles={variantStyles} />
            </div>

            <div className="space-y-2.5">
                {item.usage.length > 0 && (
                    <div>
                        <h4 className="text-muted-foreground mb-1 flex items-center gap-1 text-xs font-medium">
                            <Iconify icon="lucide:wand-2" width={12} height={12} />
                            用途
                        </h4>
                        <ul className="bg-muted space-y-0.5 rounded-md p-2">
                            {item.usage.map((u, i) => (
                                <li key={i} className="text-foreground/80 text-sm">
                                    {u}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {item.source.length > 0 && (
                    <div>
                        <h4 className="text-muted-foreground mb-1 flex items-center gap-1 text-xs font-medium">
                            <Iconify icon="lucide:map-pin" width={12} height={12} />
                            来源
                        </h4>
                        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            {item.source.map((s, i) => (
                                <SourceCell key={`${s}-${i}`} label={s} icon={getSourceIcon(s, sourceRules)} />
                            ))}
                        </ul>
                    </div>
                )}

                {item.limit.length > 0 && (
                    <div>
                        <h4 className="text-muted-foreground mb-1 flex items-center gap-1 text-xs font-medium">
                            <Iconify icon="lucide:alert-triangle" width={12} height={12} />
                            限制
                        </h4>
                        <ul className="bg-muted space-y-0.5 rounded-md p-2">
                            {item.limit.map((l, i) => (
                                <li key={i} className="text-foreground/80 text-sm">
                                    {l}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
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
        <div className="w-full">
            <header className="gallery-page-header">
                <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                <p className="text-muted-foreground mt-1">{description}</p>
            </header>

            <div className="mb-6">{filterBar}</div>

            {items.length === 0 ? (
                (empty ?? (
                    <div className="border-border text-muted-foreground flex flex-col items-center justify-center rounded-xl border border-dashed py-16">
                        <p className="text-lg">暂无符合条件的数据</p>
                        <p className="mt-1 text-sm">请调整筛选条件后重试</p>
                    </div>
                ))
            ) : (
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
            )}
        </div>
    );
}
