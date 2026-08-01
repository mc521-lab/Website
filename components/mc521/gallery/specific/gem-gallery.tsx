"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { GEM_QUALITY_ORDER, QUALITY_LABEL, QUALITY_THEME, QUALITY_TIER, TYPE_LABEL, TYPE_ORDER, TYPE_THEME } from "../constant";
import type { GemItem, GemQuality, GemSetGroup, GemType } from "../types";
import { EffectLabel } from "../reusable/effect-label";
import { GalleryFilterPanel } from "../reusable/gallery-filter-panel";
import { GalleryGroupSection } from "../reusable/gallery-group-section";
import { GalleryItemImage } from "../reusable/gallery-item-image";
import { QualityBadge } from "../reusable/quality-badge";
import { StatRow } from "../reusable/stat-row";
import { formatNumber, formatPercent, formatRange } from "../reusable/utils";

function isGemType(v: string): v is GemType {
    return (TYPE_ORDER as string[]).includes(v);
}

function resolveType(item: GemItem): GemType | "UNKNOWN" {
    if (item.type && isGemType(item.type)) return item.type;
    const lower = item.id.toLowerCase();
    for (const t of TYPE_ORDER) {
        if (
            lower === t ||
            lower.startsWith(`${t}-`) ||
            lower.startsWith(`${t}_`) ||
            lower.includes(`-${t}-`) ||
            lower.includes(`_${t}_`)
        ) {
            return t;
        }
    }
    const m = item.id.toUpperCase().match(/^BS_([A-Z]+)_/);
    if (m) {
        const code = m[1].toLowerCase();
        if (isGemType(code)) return code;
    }
    return "UNKNOWN";
}

function qualityIndex(q: GemQuality): number {
    return GEM_QUALITY_ORDER.indexOf(q);
}

function groupByType(items: GemItem[]): GemSetGroup[] {
    const map = new Map<string, GemItem[]>();
    for (const item of items) {
        const typeCode = resolveType(item);
        const key = typeCode === "UNKNOWN" ? "unknown" : typeCode;
        const list = map.get(key);
        if (list) list.push(item);
        else map.set(key, [item]);
    }

    const groups: GemSetGroup[] = [];
    for (const [type, pieces] of map) {
        pieces.sort((a, b) => qualityIndex(a.basic.quality) - qualityIndex(b.basic.quality));
        const t = type as GemType | "unknown";
        const theme = t === "unknown" ? QUALITY_THEME.S : TYPE_THEME[t as GemType];
        groups.push({
            key: type,
            title: t === "unknown" ? "未知类型" : TYPE_LABEL[t as GemType],
            subtitle: `共${pieces.length}颗`,
            pieces,
            theme,
        });
    }

    groups.sort((a, b) => {
        const idxA = a.key === "unknown" ? 99 : TYPE_ORDER.indexOf(a.key as GemType);
        const idxB = b.key === "unknown" ? 99 : TYPE_ORDER.indexOf(b.key as GemType);
        return idxA - idxB;
    });
    return groups;
}

function groupByQuality(items: GemItem[]): GemSetGroup[] {
    const map = new Map<string, GemItem[]>();
    for (const item of items) {
        const key = item.basic.quality;
        const list = map.get(key);
        if (list) list.push(item);
        else map.set(key, [item]);
    }

    const groups: GemSetGroup[] = [];
    for (const [quality, pieces] of map) {
        pieces.sort((a, b) => {
            const typeA = resolveType(a);
            const typeB = resolveType(b);
            const idxA = typeA === "UNKNOWN" ? 99 : TYPE_ORDER.indexOf(typeA);
            const idxB = typeB === "UNKNOWN" ? 99 : TYPE_ORDER.indexOf(typeB);
            return idxA - idxB;
        });
        const q = quality as GemQuality;
        groups.push({
            key: quality,
            title: `${QUALITY_LABEL[q]}级宝石`,
            subtitle: `${QUALITY_TIER[q]}品质 · 共${pieces.length}颗`,
            pieces,
            theme: QUALITY_THEME[q],
        });
    }

    groups.sort((a, b) => qualityIndex(a.key as GemQuality) - qualityIndex(b.key as GemQuality));
    return groups;
}

function ModifierEntryRow({ entry }: { entry: { probability: number; effect: string; min: number; max: number } }) {
    return (
        <div className="gallery-jewelry-entry">
            <div className="mb-0.5 flex items-center justify-between gap-2">
                <EffectLabel effect={entry.effect} className="text-sm font-medium" />
            </div>
            <div className="text-muted-foreground flex flex-wrap gap-x-3 gap-y-0.5 text-xs">
                <span>
                    概率 <span className="text-foreground font-medium">{formatPercent(entry.probability)}</span>
                </span>
                <span>
                    数值 <span className="text-foreground font-medium tabular-nums">{formatRange(entry.min, entry.max)}</span>
                </span>
            </div>
        </div>
    );
}

function GemCard({ item, accent }: { item: GemItem; accent?: string }) {
    const typeCode = resolveType(item);
    const typeLabel = typeCode === "UNKNOWN" ? item.basic.name : TYPE_LABEL[typeCode];
    const entries = item.modifiers?.entries ? Object.entries(item.modifiers.entries) : [];

    return (
        <article className="gallery-item-card border-border bg-card relative flex flex-col overflow-hidden rounded-xl border p-4 shadow-sm">
            <div
                className="pointer-events-none absolute inset-x-0 top-0 h-0.5 opacity-80"
                style={{
                    background: `linear-gradient(90deg, transparent, color-mix(in srgb, ${accent ?? "var(--primary)"} 55%, transparent), transparent)`,
                }}
            />
            <div className="gallery-card-header mb-3 flex items-start gap-2">
                <GalleryItemImage src={`/gallery/${item.basic.name}-${item.basic.quality}级.png`} alt={item.basic.name} />
                <div className="mt-1 min-w-0 flex-1">
                    <h3 className="flex items-center gap-2 truncate text-base leading-tight font-semibold">
                        {item.basic.name}
                        <QualityBadge quality={item.basic.quality} />
                    </h3>
                    <p className="text-muted-foreground mt-0.5 text-xs">{typeLabel}</p>
                </div>
            </div>

            <div className="space-y-3">
                <div>
                    <h4 className="gallery-card-section-title">镶嵌信息</h4>
                    <div className="bg-muted/40 space-y-1 rounded-lg p-2.5">
                        <StatRow
                            label="安装成功率"
                            icon="lucide:percent|#22c55e"
                            value={item.gem?.["success-rate"] !== undefined ? formatPercent(item.gem["success-rate"]) : "—"}
                        />
                        <StatRow
                            label="消耗容量"
                            icon="lucide:package-minus|#a1a1aa"
                            value={formatNumber(item.gem?.consume, 0)}
                        />
                        <StatRow
                            label="属性生效"
                            icon="lucide:layers|#6366f1"
                            value={formatRange(item.modifiers?.min, item.modifiers?.max) + "组"}
                        />
                    </div>
                </div>

                <div>
                    <h4 className="gallery-card-section-title">属性组{entries.length > 0 ? `（${entries.length}）` : ""}</h4>
                    {entries.length === 0 ? (
                        <div className="bg-muted/40 rounded-lg p-2.5">
                            <p className="text-muted-foreground text-sm">无修饰符条目</p>
                        </div>
                    ) : (
                        <div className="space-y-1.5">
                            {entries.map(([id, entry]) => (
                                <ModifierEntryRow key={id} entry={entry} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </article>
    );
}

function GemSetSection({ group, compact }: { group: GemSetGroup; compact?: boolean }) {
    const gridClass = cn("grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3", compact ? "xl:grid-cols-3" : "xl:grid-cols-4");

    return (
        <GalleryGroupSection
            title={group.title}
            description={group.subtitle}
            icon="lucide:gem"
            accent={group.theme.accent}
            contentClassName={gridClass}>
            {group.pieces.map((item) => (
                <GemCard key={item.id} item={item} accent={group.theme.accent} />
            ))}
        </GalleryGroupSection>
    );
}

export function GemGalleryPage({ items }: { items: GemItem[] }) {
    const [typeFilter, setTypeFilter] = useState<GemType | "all">("all");
    const [qualityFilter, setQualityFilter] = useState<GemQuality | "all">("all");

    const filtered = useMemo(() => {
        return items.filter((item) => {
            const typeCode = resolveType(item);
            if (typeFilter !== "all" && typeCode !== typeFilter) return false;
            if (qualityFilter !== "all" && item.basic.quality !== qualityFilter) return false;
            return true;
        });
    }, [items, typeFilter, qualityFilter]);

    const sets = useMemo(() => {
        return qualityFilter === "all" ? groupByType(filtered) : groupByQuality(filtered);
    }, [filtered, qualityFilter]);

    return (
        <div className="w-full">
            <header className="gallery-page-header">
                <h1 className="text-3xl font-bold tracking-tight">宝石图鉴</h1>
                <p className="text-muted-foreground mt-1">
                    {qualityFilter === "all"
                        ? "按类型浏览全部宝石数据（同一类型 C~S 归为一组）"
                        : `按品质浏览 ${QUALITY_TIER[qualityFilter]}${QUALITY_LABEL[qualityFilter]}级宝石`}
                </p>
            </header>

            <GalleryFilterPanel
                total={items.length}
                filtered={filtered.length}
                unit="颗"
                groups={[
                    {
                        key: "type",
                        label: "类型",
                        icon: "lucide:layout-grid",
                        value: typeFilter,
                        onChange: (value) => setTypeFilter(value as GemType | "all"),
                        options: [
                            { value: "all", label: "全部" },
                            ...TYPE_ORDER.map((t) => ({ value: t, label: TYPE_LABEL[t].slice(0, 2) })),
                        ],
                    },
                    {
                        key: "quality",
                        label: "品质",
                        icon: "lucide:gem",
                        value: qualityFilter,
                        onChange: (value) => setQualityFilter(value as GemQuality | "all"),
                        options: [
                            { value: "all", label: "全部" },
                            ...GEM_QUALITY_ORDER.map((q) => ({ value: q, label: `${q} · ${QUALITY_TIER[q]}` })),
                        ],
                    },
                ]}
            />

            {sets.length === 0 ? (
                <div className="gallery-empty-state">
                    <p className="text-lg">暂无符合条件的宝石</p>
                    <p className="mt-1 text-sm">请调整筛选条件后重试</p>
                </div>
            ) : (
                <div className="flex flex-col gap-6">
                    {sets.map((group) => (
                        <GemSetSection key={group.key} group={group} compact={qualityFilter !== "all"} />
                    ))}
                </div>
            )}
        </div>
    );
}
