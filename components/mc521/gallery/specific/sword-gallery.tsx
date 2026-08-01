"use client";

import { useMemo, useState } from "react";
import { JOB_LABEL, JOB_ORDER, JOB_THEME, QUALITY_LABEL, QUALITY_ORDER, QUALITY_THEME, QUALITY_TIER } from "../constant";
import type { SwordItem, SwordJob, SwordQuality, SwordSetGroup } from "../types";
import { GalleryFilterPanel } from "../reusable/gallery-filter-panel";
import { GalleryGroupSection } from "../reusable/gallery-group-section";
import { GalleryItemImage } from "../reusable/gallery-item-image";
import { QualityBadge } from "../reusable/quality-badge";
import { StatRow } from "../reusable/stat-row";
import { formatNumber } from "../reusable/utils";

function getStats(item: SwordItem) {
    const v = item.value ?? {};
    return {
        durable: v.durable,
        attackDamage: v["attack-damage"],
        attackSpeed: v["attack-speed"],
        critPower: v["critical-strike-power"],
        critChance: v["critical-strike-chance"],
        lifesteal: v.lifesteal,
    };
}

function qualityIndex(q: SwordQuality): number {
    return QUALITY_ORDER.indexOf(q);
}

function groupByJob(items: SwordItem[]): SwordSetGroup[] {
    const map = new Map<string, SwordItem[]>();
    for (const item of items) {
        const key = item.basic.job;
        const list = map.get(key);
        if (list) list.push(item);
        else map.set(key, [item]);
    }

    const groups: SwordSetGroup[] = [];
    for (const [job, pieces] of map) {
        pieces.sort((a, b) => qualityIndex(a.basic.quality) - qualityIndex(b.basic.quality));
        const j = job as SwordJob;
        groups.push({
            key: job,
            title: `${JOB_LABEL[j]}武器`,
            subtitle: `共${pieces.length}件`,
            pieces,
            theme: JOB_THEME[j],
        });
    }

    groups.sort((a, b) => JOB_ORDER.indexOf(a.key as SwordJob) - JOB_ORDER.indexOf(b.key as SwordJob));
    return groups;
}

function groupByQuality(items: SwordItem[]): SwordSetGroup[] {
    const map = new Map<string, SwordItem[]>();
    for (const item of items) {
        const key = item.basic.quality;
        const list = map.get(key);
        if (list) list.push(item);
        else map.set(key, [item]);
    }

    const groups: SwordSetGroup[] = [];
    for (const [quality, pieces] of map) {
        pieces.sort((a, b) => JOB_ORDER.indexOf(a.basic.job) - JOB_ORDER.indexOf(b.basic.job));
        const q = quality as SwordQuality;
        groups.push({
            key: quality,
            title: `${QUALITY_LABEL[q]} 级武器`,
            subtitle: `${QUALITY_TIER[q]}品质 · 共${pieces.length}件`,
            pieces,
            theme: QUALITY_THEME[q],
        });
    }

    groups.sort((a, b) => qualityIndex(a.key as SwordQuality) - qualityIndex(b.key as SwordQuality));
    return groups;
}

function SwordCard({ item }: { item: SwordItem }) {
    const stats = getStats(item);
    const hasGem = item.gem?.count !== undefined || item.gem?.volume !== undefined || item.gem?.lock !== undefined;

    return (
        <article className="gallery-item-card border-border bg-card relative flex flex-col overflow-hidden rounded-xl border p-4 shadow-sm">
            <div className="gallery-card-header mb-3 flex items-start gap-2">
                <GalleryItemImage src={`/gallery/${item.basic.name}.png`} alt={item.basic.name} />
                <div className="mt-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        <h3 className="truncate text-base leading-tight font-semibold">{item.basic.name}</h3>
                        <QualityBadge quality={item.basic.quality} />
                    </div>
                    <p className="text-muted-foreground mt-0.5 text-xs">{JOB_LABEL[item.basic.job]}武器</p>
                </div>
            </div>

            <div className="space-y-3">
                <div>
                    <h4 className="gallery-card-section-title">基础属性</h4>
                    <div className="bg-muted/40 space-y-1 rounded-lg p-2.5">
                        <StatRow
                            label="耐久度"
                            icon="lucide:rectangle-ellipsis|#f0bd00"
                            value={formatNumber(stats.durable, 0)}
                        />
                        <StatRow label="攻击力" icon="lucide:sword|#ef4444" value={formatNumber(stats.attackDamage)} />
                        <StatRow label="攻击速度" icon="lucide:gauge|#3b82f6" value={formatNumber(stats.attackSpeed)} />
                    </div>
                </div>

                {(stats.critPower !== undefined || stats.critChance !== undefined || stats.lifesteal !== undefined) && (
                    <div>
                        <h4 className="gallery-card-section-title">战斗属性</h4>
                        <div className="bg-muted/40 space-y-1 rounded-lg p-2.5">
                            <StatRow label="暴击伤害" icon="lucide:crosshair|#f97316" value={formatNumber(stats.critPower)} />
                            <StatRow label="暴击几率" icon="lucide:target|#eab308" value={formatNumber(stats.critChance)} />
                            <StatRow label="生命偷取" icon="lucide:heart-pulse|#ef4444" value={formatNumber(stats.lifesteal)} />
                        </div>
                    </div>
                )}

                {hasGem && (
                    <div>
                        <h4 className="text-muted-foreground mb-1.5 text-xs font-semibold tracking-wider uppercase">宝石</h4>
                        <div className="bg-muted/40 space-y-1 rounded-lg p-2.5">
                            <StatRow label="槽位" icon="lucide:wallet-cards" value={formatNumber(item.gem?.count, 0)} />
                            <StatRow
                                label="锁定"
                                icon="lucide:lock|#a1a1aa"
                                value={formatNumber(item.gem?.lock, 0) === "—" ? "0" : formatNumber(item.gem?.lock, 0)}
                            />
                            <StatRow label="容量" icon="lucide:package-open" value={formatNumber(item.gem?.volume, 0)} />
                        </div>
                    </div>
                )}
            </div>
        </article>
    );
}

function SwordSetSection({ group }: { group: SwordSetGroup }) {
    return (
        <GalleryGroupSection
            title={group.title}
            description={group.subtitle}
            icon="lucide:sword"
            accent={group.theme.accent}
            contentClassName="gallery-group-grid gallery-group-grid-sword">
            {group.pieces.map((item) => (
                <SwordCard key={item.id} item={item} />
            ))}
        </GalleryGroupSection>
    );
}

export function SwordGalleryPage({ items }: { items: SwordItem[] }) {
    const [jobFilter, setJobFilter] = useState<SwordJob | "all">("all");
    const [qualityFilter, setQualityFilter] = useState<SwordQuality | "all">("all");

    const filtered = useMemo(() => {
        return items.filter((item) => {
            if (jobFilter !== "all" && item.basic.job !== jobFilter) return false;
            if (qualityFilter !== "all" && item.basic.quality !== qualityFilter) return false;
            return true;
        });
    }, [items, jobFilter, qualityFilter]);

    const sets = useMemo(() => {
        return qualityFilter === "all" ? groupByJob(filtered) : groupByQuality(filtered);
    }, [filtered, qualityFilter]);

    return (
        <div className="w-full">
            <header className="gallery-page-header">
                <h1 className="text-3xl font-bold tracking-tight">武器图鉴</h1>
                <p className="text-muted-foreground mt-1">
                    {qualityFilter === "all"
                        ? "按职业浏览全部武器数据"
                        : `按品质浏览所有的 ${QUALITY_LABEL[qualityFilter]} 级武器`}
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
                        icon: "lucide:user-round",
                        value: jobFilter,
                        onChange: (value) => setJobFilter(value as SwordJob | "all"),
                        options: [
                            { value: "all", label: "全部" },
                            ...JOB_ORDER.map((value) => ({ value, label: JOB_LABEL[value] })),
                        ],
                    },
                    {
                        key: "quality",
                        label: "品质",
                        icon: "lucide:sparkles",
                        value: qualityFilter,
                        onChange: (value) => setQualityFilter(value as SwordQuality | "all"),
                        options: [
                            { value: "all", label: "全部" },
                            ...QUALITY_ORDER.map((value) => ({
                                value,
                                label: `${value} · ${QUALITY_TIER[value]}`,
                            })),
                        ],
                    },
                ]}
            />

            {sets.length === 0 ? (
                <div className="gallery-empty-state">
                    <p className="text-lg">暂无符合条件的武器</p>
                    <p className="mt-1 text-sm">请调整筛选条件后重试</p>
                </div>
            ) : (
                <div className="flex flex-col gap-6">
                    {sets.map((group) => (
                        <SwordSetSection key={group.key} group={group} />
                    ))}
                </div>
            )}
        </div>
    );
}
