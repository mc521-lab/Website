"use client";

import { useMemo, useState } from "react";
import {
    JOB_LABEL,
    JOB_ORDER,
    JOB_THEME,
    QUALITY_LABEL,
    QUALITY_ORDER,
    QUALITY_THEME,
    QUALITY_TIER,
} from "../constant";
import type { SwordItem, SwordJob, SwordQuality, SwordSetGroup } from "../types";
import { FilterSelect } from "../reusable/filter-select";
import { GalleryShell } from "../reusable/gallery-shell";
import { ItemCardShell } from "../reusable/item-card-shell";
import { QualityBadge } from "../reusable/quality-badge";
import { SetSection } from "../reusable/set-section";
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

function SwordCard({ item, accent }: { item: SwordItem; accent?: string }) {
    const stats = getStats(item);
    const hasGem = item.gem?.count !== undefined || item.gem?.volume !== undefined || item.gem?.lock !== undefined;

    return (
        <ItemCardShell
            name={item.basic.name}
            imageSrc={`/gallery/${item.basic.name}.png`}
            subtitle={`${JOB_LABEL[item.basic.job]}武器`}
            badge={<QualityBadge quality={item.basic.quality} />}
            accent={accent}>
            <div className="space-y-3">
                <div>
                    <h4 className="text-muted-foreground mb-1.5 text-xs font-semibold tracking-wider uppercase">
                        基础属性
                    </h4>
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
                        <h4 className="text-muted-foreground mb-1.5 text-xs font-semibold tracking-wider uppercase">
                            战斗属性
                        </h4>
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
        </ItemCardShell>
    );
}

function SwordSetSection({ group }: { group: SwordSetGroup }) {
    return (
        <SetSection title={group.title} subtitle={group.subtitle} theme={group.theme} icon="lucide:sword">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {group.pieces.map((item) => (
                    <SwordCard key={item.id} item={item} accent={group.theme.accent} />
                ))}
            </div>
        </SetSection>
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
        <GalleryShell
            title="武器图鉴"
            subtitle={
                qualityFilter === "all"
                    ? "按职业浏览全部武器数据（同一职业 D~S 归为一组）"
                    : `按品质浏览 ${QUALITY_TIER[qualityFilter]}${QUALITY_LABEL[qualityFilter]}级武器`
            }
            filterBar={
                <div className="flex flex-wrap items-end gap-3">
                    <FilterSelect
                        label="职业"
                        icon="lucide:users"
                        value={jobFilter}
                        options={JOB_ORDER.map((j) => ({ value: j, label: JOB_LABEL[j] }))}
                        onChange={(v) => setJobFilter(v)}
                    />
                    <FilterSelect
                        label="品质"
                        icon="lucide:gem"
                        value={qualityFilter}
                        options={QUALITY_ORDER.map((q) => ({ value: q, label: q }))}
                        onChange={(v) => setQualityFilter(v)}
                    />
                    <p className="text-muted-foreground ml-auto self-center text-right text-sm">
                        正在展示 <span className="text-foreground font-medium">{filtered.length}</span> / {items.length}{" "}
                        件
                    </p>
                </div>
            }
            isEmpty={sets.length === 0}
            empty={
                <div className="border-border text-muted-foreground flex flex-col items-center justify-center rounded-xl border border-dashed py-16">
                    <p className="text-lg">暂无符合条件的武器</p>
                    <p className="mt-1 text-sm">请调整筛选条件后重试</p>
                </div>
            }>
            {sets.map((group) => (
                <SwordSetSection key={group.key} group={group} />
            ))}
        </GalleryShell>
    );
}
