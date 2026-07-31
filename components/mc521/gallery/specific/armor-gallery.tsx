"use client";

import { useMemo, useState } from "react";
import { IconifyIcon } from "@/components/iconify-icon";
import {
    JOB_LABEL,
    JOB_ORDER,
    PART_LABEL,
    PART_ORDER,
    QUALITY_ORDER,
    QUALITY_THEME,
    QUALITY_TIER,
    SET_BONUS,
} from "../constant";
import type { ArmorItem, ArmorJob, ArmorPart, ArmorQuality, ArmorSetGroup } from "../types";
import { FilterBarShell } from "../reusable/filter-bar-shell";
import { FilterSelect } from "../reusable/filter-select";
import { GalleryShell } from "../reusable/gallery-shell";
import { ItemCardShell } from "../reusable/item-card-shell";
import { QualityBadge } from "../reusable/quality-badge";
import { SetSection } from "../reusable/set-section";
import { StatRow } from "../reusable/stat-row";
import { formatNumber } from "../reusable/utils";

function parsePartFromId(id: string): ArmorPart | "UNKNOWN" {
    const upper = id.toUpperCase();
    for (const p of PART_ORDER) {
        if (upper.endsWith(`-${p}`)) return p as ArmorPart;
    }
    return "UNKNOWN";
}

function getStats(item: ArmorItem) {
    const v = item.value ?? {};
    const e = item.effect ?? {};
    const durable = v.durable ?? (e as Record<string, number>)["durable"];
    const armor = v.armor ?? (e as Record<string, number>)["armor"];
    const toughness = v["armor-toughness"] ?? (e as Record<string, number>)["armor-toughness"];
    return {
        durable,
        armor,
        toughness,
        maxHealth: e["max-health"],
        defense: e.defense,
        maxMana: e["max-mana"],
        maxStamina: e["max-stamina"],
        parry: e["parry-rating"],
        moveSpeed: e["movement-speed"],
        dodge: e["dodge-rating"],
    };
}

function deriveSetName(pieces: ArmorItem[]): string {
    if (pieces.length === 0) return "未知套装";
    const names = pieces.map((p) => p.basic.name);
    const withZhi = names.map((n) => {
        const idx = n.indexOf("之");
        return idx > 0 ? n.slice(0, idx) : n;
    });
    const first = withZhi[0];
    if (withZhi.every((n) => n === first)) return first;
    let prefix = names[0];
    for (const n of names.slice(1)) {
        let i = 0;
        while (i < prefix.length && i < n.length && prefix[i] === n[i]) i++;
        prefix = prefix.slice(0, i);
    }
    return prefix.replace(/之$/, "") || names[0];
}

function groupIntoSets(items: ArmorItem[]): ArmorSetGroup[] {
    const map = new Map<string, ArmorItem[]>();
    for (const item of items) {
        const key = `${item.basic.job}__${item.basic.quality}`;
        const list = map.get(key);
        if (list) list.push(item);
        else map.set(key, [item]);
    }

    const groups: ArmorSetGroup[] = [];
    for (const [key, pieces] of map) {
        const [job, quality] = key.split("__") as [ArmorJob, ArmorQuality];
        pieces.sort((a, b) => {
            const pA = PART_ORDER.indexOf(parsePartFromId(a.id));
            const pB = PART_ORDER.indexOf(parsePartFromId(b.id));
            return pA - pB;
        });
        groups.push({
            key,
            job,
            quality,
            setName: deriveSetName(pieces),
            title: "",
            subtitle: "",
            pieces,
            theme: QUALITY_THEME[quality],
        });
    }

    groups.sort((a, b) => {
        const jobA = JOB_ORDER.indexOf(a.job);
        const jobB = JOB_ORDER.indexOf(b.job);
        if (jobA !== jobB) return jobA - jobB;
        return QUALITY_ORDER.indexOf(a.quality) - QUALITY_ORDER.indexOf(b.quality);
    });

    return groups;
}

function ArmorPieceCard({ item, accent }: { item: ArmorItem; accent?: string }) {
    const part = parsePartFromId(item.id);
    const stats = getStats(item);
    const jobLabel = JOB_LABEL[item.basic.job] ?? item.basic.job;
    const partLabel = part === "UNKNOWN" ? "—" : PART_LABEL[part];
    const hasGem = item.gem?.count !== undefined || item.gem?.volume !== undefined;

    return (
        <ItemCardShell
            name={item.basic.name}
            imageSrc={`/gallery/${item.basic.name}.png`}
            subtitle={`${jobLabel} · ${partLabel}`}
            accent={accent}>
            <div className="space-y-3">
                <div>
                    <h4 className="text-muted-foreground mb-1.5 text-xs font-semibold tracking-wider uppercase">基础属性</h4>
                    <div className="bg-muted/40 space-y-1 rounded-lg p-2.5">
                        <StatRow
                            label="耐久度"
                            icon="lucide:rectangle-ellipsis|#f0bd00"
                            value={formatNumber(stats.durable, 0)}
                        />
                        <StatRow label="护甲值" icon="lucide:shield|#3c91ff" value={formatNumber(stats.armor)} />
                        <StatRow label="护甲韧性" icon="lucide:shield-plus|#14d681" value={formatNumber(stats.toughness)} />
                        <StatRow label="最大生命" icon="lucide:heart-plus|#ff5257" value={formatNumber(stats.maxHealth)} />
                        <StatRow label="防御减伤" icon="lucide:shield-minus|#ff7a00" value={formatNumber(stats.defense)} />
                        <StatRow label="最大法力" icon="lucide:wand-sparkles|#60a5fa" value={formatNumber(stats.maxMana)} />
                        <StatRow label="最大耐力" icon="lucide:gauge|#b76bff" value={formatNumber(stats.maxStamina)} />
                        <StatRow label="招架几率" icon="lucide:swords|#ec5bd8" value={formatNumber(stats.parry)} />
                        <StatRow label="移动速度" icon="lucide:footprints|#e8d525" value={formatNumber(stats.moveSpeed)} />
                        <StatRow label="闪避率" icon="lucide:wind|#14b8a6" value={formatNumber(stats.dodge)} />
                    </div>
                </div>

                {hasGem && (
                    <div className="border-border/50 bg-muted/30 text-muted-foreground grid grid-cols-[1fr_auto_auto] items-center gap-3 rounded-lg border-t px-2.5 py-2 text-xs">
                        <span className="text-foreground/90 inline-flex items-center gap-1.5 font-medium">
                            <IconifyIcon icon="lucide:gem" width={14} height={14} className="text-primary" />
                            宝石
                        </span>
                        <span>
                            槽位{" "}
                            <strong className="text-foreground ml-0.5 tabular-nums">{formatNumber(item.gem?.count, 0)}</strong>
                        </span>
                        <span>
                            容量{" "}
                            <strong className="text-foreground ml-0.5 tabular-nums">{formatNumber(item.gem?.volume, 0)}</strong>
                        </span>
                    </div>
                )}
            </div>
        </ItemCardShell>
    );
}

function SetBonusPanel({ quality, pieceCount }: { quality: ArmorQuality; pieceCount: number }) {
    const theme = QUALITY_THEME[quality];
    const cd = SET_BONUS.cooldown[quality];
    const rr = SET_BONUS.rangedReduce[quality];
    return (
        <div
            className="flex items-center gap-1 rounded-lg border p-2 text-sm"
            style={{
                borderColor: `color-mix(in srgb, ${theme.accent} 35%, transparent)`,
                background: `linear-gradient(180deg, color-mix(in srgb, ${theme.accent} 12%, transparent), color-mix(in srgb, ${theme.accent} 6%, transparent))`,
                boxShadow: `inset 0 1px color-mix(in srgb, ${theme.accent2} 12%, transparent)`,
            }}>
            <p className="text-muted-foreground translate-y-[1.5px] text-xs font-semibold tracking-wider uppercase">
                套装效果（{pieceCount}件）
            </p>
            <div className="bg-muted/40 flex flex-wrap gap-x-4 gap-y-1 rounded-md px-2 py-1">
                <span className="inline-flex items-center gap-1.5">
                    <IconifyIcon icon="lucide:hourglass" style={{ color: theme.accent2 }} width={14} height={14} />
                    <span className="text-muted-foreground">技能冷却</span>
                    <span className="font-medium tabular-nums" style={{ color: theme.accent2 }}>
                        -{cd}%
                    </span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                    <IconifyIcon icon="lucide:circle-arrow-down" style={{ color: theme.accent2 }} width={14} height={14} />
                    <span className="text-muted-foreground">远程减免</span>
                    <span className="font-medium tabular-nums" style={{ color: theme.accent2 }}>
                        -{rr}%
                    </span>
                </span>
            </div>
        </div>
    );
}

function ArmorSetSection({ group }: { group: ArmorSetGroup }) {
    const jobLabel = JOB_LABEL[group.job];
    const tier = QUALITY_TIER[group.quality];

    return (
        <SetSection
            title={
                <span className="flex flex-wrap items-center gap-2">
                    {group.setName}套装
                    <QualityBadge quality={group.quality} />
                </span>
            }
            subtitle={`${tier}${jobLabel}防具 · 共${group.pieces.length}件`}
            theme={group.theme}
            icon="lucide:shield"
            headerExtra={<SetBonusPanel quality={group.quality} pieceCount={group.pieces.length} />}>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {group.pieces.map((item) => (
                    <ArmorPieceCard key={item.id} item={item} accent={group.theme.accent} />
                ))}
            </div>
        </SetSection>
    );
}

export function ArmorGalleryPage({ items }: { items: ArmorItem[] }) {
    const [jobFilter, setJobFilter] = useState<ArmorJob | "all">("all");
    const [qualityFilter, setQualityFilter] = useState<ArmorQuality | "all">("all");

    const filtered = useMemo(() => {
        return items.filter((item) => {
            if (jobFilter !== "all" && item.basic.job !== jobFilter) return false;
            if (qualityFilter !== "all" && item.basic.quality !== qualityFilter) return false;
            return true;
        });
    }, [items, jobFilter, qualityFilter]);

    const sets = useMemo(() => groupIntoSets(filtered), [filtered]);

    return (
        <GalleryShell
            title="护甲图鉴"
            subtitle="按职业、品质与部位浏览全部护甲数据（按套装分组）"
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
                        label="品质"
                        icon="lucide:gem"
                        value={qualityFilter}
                        options={QUALITY_ORDER.map((q) => ({ value: q, label: q }))}
                        onChange={(v) => setQualityFilter(v)}
                    />
                </FilterBarShell>
            }
            isEmpty={sets.length === 0}
            empty={
                <div className="border-border text-muted-foreground flex flex-col items-center justify-center rounded-xl border border-dashed py-16">
                    <p className="text-lg">暂无符合条件的护甲</p>
                    <p className="mt-1 text-sm">请调整筛选条件后重试</p>
                </div>
            }>
            {sets.map((group) => (
                <ArmorSetSection key={group.key} group={group} />
            ))}
        </GalleryShell>
    );
}

