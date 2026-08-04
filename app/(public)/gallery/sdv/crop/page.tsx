"use client";

import { useEffect, useRef, useState } from "react";
import { gallery_sdv_crop_data } from "@/.velite";
import { GalleryShell } from "@/components/mc521/gallery/reusable/gallery-shell";
import { GalleryItemImage } from "@/components/mc521/gallery/reusable/gallery-item-image";
import { IconifyIcon } from "@/components/iconify-icon";
import { cn } from "@/lib/utils";

interface CropItem {
    id: string;
    basic: { name: string; type: string };
    usage: string[];
    source: string[];
    limit: string[];
    variants: string[];
}

const INTERVAL_MS = 3000;

function CropCard({ item }: { item: CropItem }) {
    const [index, setIndex] = useState(0);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const variants = item.variants.length > 0 ? item.variants : [item.basic.name];

    useEffect(() => {
        if (variants.length <= 1) return;

        timerRef.current = setInterval(() => {
            setIndex((prev) => (prev + 1) % variants.length);
        }, INTERVAL_MS);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [variants.length]);

    const currentVariant = variants[index];

    return (
        <article className="gallery-item-card border-border bg-card relative flex flex-col overflow-hidden rounded-xl border p-4 shadow-sm">
            <div className="gallery-card-header mb-3 flex items-start gap-2">
                <div className="relative">
                    {variants.map((v) => (
                        <div
                            key={v}
                            className={cn(
                                "absolute top-0 left-0 h-full w-full",
                                v === currentVariant ? "opacity-100" : "opacity-0"
                            )}>
                            <GalleryItemImage src={`/gallery/${v}.png`} alt={v} />
                        </div>
                    ))}
                </div>
                <div className="ml-12 flex h-full min-w-0 flex-1 flex-col justify-center">
                    <h3 className="truncate text-base leading-tight font-semibold">{currentVariant}</h3>
                    <p className="text-muted-foreground mt-0.5 text-xs">作物</p>
                </div>
            </div>

            {/* 星级指示器 */}
            {variants.length > 1 && (
                <div className="mb-2.5 flex items-center gap-1.5">
                    {variants.map((v, i) => {
                        const isActive = i === index;
                        const vStar = v.includes("(金星)") ? "gold" : v.includes("(银星)") ? "silver" : "none";
                        const dotColor =
                            vStar === "gold" ? "bg-amber-400" : vStar === "silver" ? "bg-slate-400" : "bg-green-500";
                        return (
                            <div
                                key={v}
                                className={`h-2 rounded-full transition-all duration-300 ${
                                    isActive ? "w-5" : "w-2 opacity-40 hover:opacity-70"
                                } ${dotColor}`}
                                title={v}
                            />
                        );
                    })}
                </div>
            )}

            <div className="space-y-2.5">
                {item.usage.length > 0 && (
                    <div>
                        <h4 className="text-muted-foreground mb-1 flex items-center gap-1 text-xs font-medium">
                            <IconifyIcon icon="lucide:wand-2" width={12} height={12} />
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
                            <IconifyIcon icon="lucide:map-pin" width={12} height={12} />
                            来源
                        </h4>
                        <ul className="bg-muted space-y-0.5 rounded-md p-2">
                            {item.source.map((s, i) => (
                                <li key={i} className="text-foreground/80 text-sm">
                                    {s}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </article>
    );
}

export default function SdvCropPage() {
    const allItems = gallery_sdv_crop_data as unknown as CropItem[];

    return (
        <GalleryShell title="作物图鉴" subtitle="浏览星露谷中的各类作物，图片将自动轮换展示不同品质">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {allItems.map((item) => (
                    <CropCard key={item.id} item={item} />
                ))}
            </div>
        </GalleryShell>
    );
}
