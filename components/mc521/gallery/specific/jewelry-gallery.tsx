"use client";

import { useMemo, useState } from "react";
import { JOB_LABEL, JOB_ORDER, JOB_THEME, POSITION_LABEL, POSITION_ORDER, POSITION_THEME } from "../constant";
import type { JewelryItem, JewelryJob, JewelryPosition, JewelrySetGroup, JewelryStatEntry } from "../types";
import { EffectLabel } from "../reusable/effect-label";
import { GalleryFilterPanel } from "../reusable/gallery-filter-panel";
import { GalleryGroupSection } from "../reusable/gallery-group-section";
import { GalleryItemImage } from "../reusable/gallery-item-image";
import { formatPercent, formatRange } from "../reusable/utils";

function isJewelryJob(v: string): v is JewelryJob {
    return (JOB_ORDER as string[]).includes(v);
}

function isJewelryPosition(v: string): v is JewelryPosition {
    return (POSITION_ORDER as string[]).includes(v);
}

function resolveJob(item: JewelryItem): JewelryJob | "UNKNOWN" {
    if (item.job && isJewelryJob(item.job)) return item.job;
    const lower = item.id.toLowerCase();
    for (const j of JOB_ORDER) {
        if (lower === j || lower.startsWith(`${j}-`) || lower.startsWith(`${j}_`)) {
            return j;
        }
    }
    return "UNKNOWN";
}

function resolvePosition(item: JewelryItem): JewelryPosition | "UNKNOWN" {
    if (item.position && isJewelryPosition(item.position)) return item.position;
    const lower = item.id.toLowerCase();
    for (const p of POSITION_ORDER) {
        if (lower.endsWith(`-${p}`) || lower.endsWith(`_${p}`) || lower === p) {
            return p;
        }
    }
    return "UNKNOWN";
}

function groupByJob(items: JewelryItem[]): JewelrySetGroup[] {
    const map = new Map<string, JewelryItem[]>();
    for (const item of items) {
        const jobCode = resolveJob(item);
        const key = jobCode === "UNKNOWN" ? "unknown" : jobCode;
        const list = map.get(key);
        if (list) list.push(item);
        else map.set(key, [item]);
    }

    const groups: JewelrySetGroup[] = [];
    for (const [job, pieces] of map) {
        pieces.sort((a, b) => {
            const posA = resolvePosition(a);
            const posB = resolvePosition(b);
            const idxA = posA === "UNKNOWN" ? 99 : POSITION_ORDER.indexOf(posA);
            const idxB = posB === "UNKNOWN" ? 99 : POSITION_ORDER.indexOf(posB);
            return idxA - idxB;
        });
        const j = job as JewelryJob | "unknown";
        const theme = j === "unknown" ? JOB_THEME.zhanshi : JOB_THEME[j as JewelryJob];
        groups.push({
            key: job,
            title: j === "unknown" ? "未知职业" : `${JOB_LABEL[j as JewelryJob]}饰品`,
            subtitle: `共${pieces.length}件`,
            pieces,
            theme,
        });
    }

    groups.sort((a, b) => {
        const idxA = JOB_ORDER.indexOf(a.key as JewelryJob);
        const idxB = JOB_ORDER.indexOf(b.key as JewelryJob);
        if (idxA === -1 && idxB === -1) return a.key.localeCompare(b.key);
        if (idxA === -1) return 1;
        if (idxB === -1) return -1;
        return idxA - idxB;
    });
    return groups;
}

function groupByPosition(items: JewelryItem[]): JewelrySetGroup[] {
    const map = new Map<string, JewelryItem[]>();
    for (const item of items) {
        const posCode = resolvePosition(item);
        const key = posCode === "UNKNOWN" ? "unknown" : posCode;
        const list = map.get(key);
        if (list) list.push(item);
        else map.set(key, [item]);
    }

    const groups: JewelrySetGroup[] = [];
    for (const [position, pieces] of map) {
        pieces.sort((a, b) => {
            const jobA = resolveJob(a);
            const jobB = resolveJob(b);
            const idxA = jobA === "UNKNOWN" ? 99 : JOB_ORDER.indexOf(jobA);
            const idxB = jobB === "UNKNOWN" ? 99 : JOB_ORDER.indexOf(jobB);
            return idxA - idxB;
        });
        const p = position as JewelryPosition | "unknown";
        const theme = p === "unknown" ? POSITION_THEME.xianglian : POSITION_THEME[p as JewelryPosition];
        groups.push({
            key: position,
            title: p === "unknown" ? "未知部位" : POSITION_LABEL[p as JewelryPosition],
            subtitle: `共${pieces.length}件`,
            pieces,
            theme,
        });
    }

    groups.sort((a, b) => {
        const idxA = POSITION_ORDER.indexOf(a.key as JewelryPosition);
        const idxB = POSITION_ORDER.indexOf(b.key as JewelryPosition);
        if (idxA === -1 && idxB === -1) return a.key.localeCompare(b.key);
        if (idxA === -1) return 1;
        if (idxB === -1) return -1;
        return idxA - idxB;
    });
    return groups;
}

function SpecialBadge({ special }: { special: boolean }) {
    if (!special) return null;
    return (
        <span className="inline-flex items-center justify-center rounded bg-amber-500/15 px-2 py-0.5 text-xs font-semibold tracking-wide text-amber-600 dark:text-amber-400">
            推荐
        </span>
    );
}

function ModifierStatLines({ stats }: { stats: JewelryStatEntry[] }) {
    return (
        <div className="mt-1 space-y-1">
            {stats.map((s) => (
                <div key={s.effect} className="text-muted-foreground flex items-center justify-between gap-2 text-xs">
                    <EffectLabel effect={s.effect} className="translate-y-[1.5px]" />
                    <span className="text-foreground font-medium tabular-nums">{formatRange(s.min, s.max)}</span>
                </div>
            ))}
        </div>
    );
}

function ModifierEntryRow({ entry }: { entry: { probability: number; stats: JewelryStatEntry[] } }) {
    return (
        <div className="border-border/50 bg-muted/60 rounded-md border px-2.5 py-1.5">
            <div className="mb-0.5 flex items-center justify-between gap-2">
                <span className="text-muted-foreground text-xs">
                    生效概率 <span className="text-foreground font-medium">{formatPercent(entry.probability)}</span>
                </span>
            </div>
            <ModifierStatLines stats={entry.stats ?? []} />
        </div>
    );
}

function JewelryCard({ item, accent }: { item: JewelryItem; accent?: string }) {
    const jobCode = resolveJob(item);
    const posCode = resolvePosition(item);
    const jobLabel = jobCode === "UNKNOWN" ? "未知职业" : JOB_LABEL[jobCode];
    const posLabel = posCode === "UNKNOWN" ? "未知部位" : POSITION_LABEL[posCode];
    const entries = item.modifiers?.entries ? Object.entries(item.modifiers.entries) : [];

    return (
        <article className="gallery-item-card gallery-jewelry-card border-border bg-card relative flex flex-col overflow-hidden rounded-xl border p-4 shadow-sm">
            <div
                className="pointer-events-none absolute inset-x-0 top-0 h-0.5 opacity-80"
                style={{
                    background: `linear-gradient(90deg, transparent, color-mix(in srgb, ${accent ?? "var(--primary)"} 55%, transparent), transparent)`,
                }}
            />
            <div className="gallery-card-header mb-3 flex items-start gap-2">
                <GalleryItemImage src={`/gallery/${item.basic.name}.png`} alt={item.basic.name} />
                <div className="mt-1 min-w-0 flex-1">
                    <h3 className="flex items-center gap-2 truncate text-base leading-tight font-semibold">
                        {item.basic.name} <SpecialBadge special={item.basic.special} />
                    </h3>
                    <p className="text-muted-foreground mt-0.5 text-xs">
                        {jobLabel} · {posLabel}
                    </p>
                </div>
            </div>

            <div>
                <h4 className="text-muted-foreground mb-1.5 text-xs font-semibold tracking-wider uppercase">
                    属性组{entries.length > 0 ? `（${entries.length}）` : ""}
                </h4>
                {entries.length === 0 ? (
                    <div className="bg-muted/40 rounded-lg p-2.5">
                        <p className="text-muted-foreground text-sm">无随机属性</p>
                    </div>
                ) : (
                    <div className="space-y-1.5">
                        {entries.map(([id, entry]) => (
                            <ModifierEntryRow key={id} entry={entry} />
                        ))}
                    </div>
                )}
            </div>
        </article>
    );
}

function JewelrySetSection({ group, icon }: { group: JewelrySetGroup; icon: string }) {
    const accent = group.theme.accent;
    return (
        <GalleryGroupSection
            title={group.title}
            description={group.subtitle}
            icon={icon}
            accent={accent}
            contentClassName="gallery-group-grid gallery-group-grid-jewelry">
            {group.pieces.map((item) => (
                <JewelryCard key={item.id} item={item} accent={accent} />
            ))}
        </GalleryGroupSection>
    );
}

export function JewelryGalleryPage({ items }: { items: JewelryItem[] }) {
    const [jobFilter, setJobFilter] = useState<JewelryJob | "all">("all");
    const [positionFilter, setPositionFilter] = useState<JewelryPosition | "all">("all");

    const filtered = useMemo(() => {
        return items.filter((item) => {
            const jobCode = resolveJob(item);
            const posCode = resolvePosition(item);
            if (jobFilter !== "all" && jobCode !== jobFilter) return false;
            if (positionFilter !== "all" && posCode !== positionFilter) return false;
            return true;
        });
    }, [items, jobFilter, positionFilter]);

    const sets = useMemo(() => {
        return positionFilter === "all" ? groupByJob(filtered) : groupByPosition(filtered);
    }, [filtered, positionFilter]);

    const icon = positionFilter === "all" ? "lucide:sparkles" : "lucide:gem";

    return (
        <div className="w-full">
            <header className="gallery-page-header">
                <h1 className="text-3xl font-bold tracking-tight">饰品图鉴</h1>
                <p className="text-muted-foreground mt-1">
                    {positionFilter === "all"
                        ? "按职业浏览全部饰品数据（同一职业各部位归为一组）"
                        : `按部位浏览 ${POSITION_LABEL[positionFilter]}饰品`}
                </p>
            </header>

            <GalleryFilterPanel
                total={items.length}
                filtered={filtered.length}
                unit="件"
                groups={[
                    {
                        key: "job",
                        label: "职业",
                        icon: "lucide:users",
                        value: jobFilter,
                        onChange: (value) => setJobFilter(value as JewelryJob | "all"),
                        options: [
                            { value: "all", label: "全部" },
                            ...JOB_ORDER.map((value) => ({ value, label: JOB_LABEL[value] })),
                        ],
                    },
                    {
                        key: "position",
                        label: "部位",
                        icon: "lucide:scan",
                        value: positionFilter,
                        onChange: (value) => setPositionFilter(value as JewelryPosition | "all"),
                        options: [
                            { value: "all", label: "全部" },
                            ...POSITION_ORDER.map((value) => ({ value, label: POSITION_LABEL[value] })),
                        ],
                    },
                ]}
            />

            {sets.length === 0 ? (
                <div className="gallery-empty-state">
                    <p className="text-lg">暂无符合条件的饰品</p>
                    <p className="mt-1 text-sm">请调整筛选条件后重试</p>
                </div>
            ) : (
                <div className="flex flex-col gap-6">
                    {sets.map((group) => (
                        <JewelrySetSection key={group.key} group={group} icon={icon} />
                    ))}
                </div>
            )}
        </div>
    );
}
