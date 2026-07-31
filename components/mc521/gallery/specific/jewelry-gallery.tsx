"use client";

import { useMemo, useState } from "react";
import { JOB_LABEL, JOB_ORDER, JOB_THEME, POSITION_LABEL, POSITION_ORDER, POSITION_THEME } from "../constant";
import type { JewelryItem, JewelryJob, JewelryPosition, JewelrySetGroup, JewelryStatEntry } from "../types";
import { EffectLabel } from "../reusable/effect-label";
import { FilterBarShell } from "../reusable/filter-bar-shell";
import { FilterSelect } from "../reusable/filter-select";
import { GalleryShell } from "../reusable/gallery-shell";
import { ItemCardShell } from "../reusable/item-card-shell";
import { SetSection } from "../reusable/set-section";
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
        <ItemCardShell
            name={item.basic.name}
            imageSrc={`/gallery/${item.basic.name}.png`}
            subtitle={`${jobLabel} · ${posLabel}`}
            badge={<SpecialBadge special={item.basic.special} />}
            accent={accent}>
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
        </ItemCardShell>
    );
}

function JewelrySetSection({ group, icon }: { group: JewelrySetGroup; icon: string }) {
    return (
        <SetSection title={group.title} subtitle={group.subtitle} theme={group.theme} icon={icon}>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {group.pieces.map((item) => (
                    <JewelryCard key={item.id} item={item} accent={group.theme.accent} />
                ))}
            </div>
        </SetSection>
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

    return (
        <GalleryShell
            title="饰品图鉴"
            subtitle={
                positionFilter === "all"
                    ? "按职业浏览全部饰品数据（同一职业各部位归为一组）"
                    : `按部位浏览 ${POSITION_LABEL[positionFilter]}饰品`
            }
            filterBar={
                <FilterBarShell
                    extra={
                        <>
                            正在展示 <span className="text-foreground font-medium">{filtered.length}</span> / {items.length} 件
                        </>
                    }>
                    <FilterSelect
                        label="职业"
                        icon="lucide:users"
                        value={jobFilter}
                        options={JOB_ORDER.map((j) => ({ value: j, label: JOB_LABEL[j] }))}
                        onChange={(v) => setJobFilter(v)}
                    />
                    <FilterSelect
                        label="部位"
                        icon="lucide:scan"
                        value={positionFilter}
                        options={POSITION_ORDER.map((p) => ({ value: p, label: POSITION_LABEL[p] }))}
                        onChange={(v) => setPositionFilter(v)}
                    />
                </FilterBarShell>
            }
            isEmpty={sets.length === 0}
            empty={
                <div className="border-border text-muted-foreground flex flex-col items-center justify-center rounded-xl border border-dashed py-16">
                    <p className="text-lg">暂无符合条件的饰品</p>
                    <p className="mt-1 text-sm">请调整筛选条件后重试</p>
                </div>
            }>
            {sets.map((group) => (
                <JewelrySetSection
                    key={group.key}
                    group={group}
                    icon={positionFilter === "all" ? "lucide:sparkles" : "lucide:gem"}
                />
            ))}
        </GalleryShell>
    );
}

