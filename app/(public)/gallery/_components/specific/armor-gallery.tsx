"use client";

import { useMemo, useState } from "react";
import { IconifyIcon } from "@/components/iconify-icon";
import {
    JOB_LABEL,
    JOB_ORDER,
    PART_LABEL,
    PART_ORDER,
    QUALITY_LABEL,
    QUALITY_ORDER,
    QUALITY_THEME,
    QUALITY_TIER,
    SET_BONUS,
} from "../constant";
import type { ArmorItem, ArmorJob, ArmorPart, ArmorQuality, ArmorSetGroup } from "../types";
import { GalleryContentSection } from "../reusable/gallery-content-section";
import { GalleryFilterPanel } from "../reusable/gallery-filter-panel";
import { GalleryGroupSection } from "../reusable/gallery-group-section";
import { ItemCardShell } from "../reusable/item-card-shell";
import { StatRow } from "../reusable/stat-row";
import { formatNumber, formatPercent } from "../reusable/utils";

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

function ArmorPieceCard({ item }: { item: ArmorItem }) {
    const part = parsePartFromId(item.id);
    const stats = getStats(item);
    const jobLabel = JOB_LABEL[item.basic.job] ?? item.basic.job;
    const partLabel = part === "UNKNOWN" ? "—" : PART_LABEL[part];
    const hasGem = item.gem?.count !== undefined || item.gem?.volume !== undefined;
    const subtitle = (
        <>
            {jobLabel} · {partLabel}
        </>
    );

    function getGemCountString(item: ArmorItem) {
        const hasLock = ["A", "S"].includes(item.basic.quality);
        const count = formatNumber(item.gem?.count! + (hasLock ? 1 : 0), "", 0);
        const lock = hasLock ? ` (1 待打孔)` : "";
        return `${count}${lock}`;
    }

    return (
        <ItemCardShell name={item.basic.name} imageSrc={`/gallery/${item.basic.name}.png`} subtitle={subtitle}>
            <div className="space-y-3">
                <GalleryContentSection title="基础属性" icon="lucide:shield">
                    <div className="bg-muted/40 space-y-1 rounded-lg p-2.5">
                        <StatRow
                            label="耐久度"
                            icon="lucide:rectangle-ellipsis|#f0bd00"
                            value={formatNumber(stats.durable, "", 0)}
                        />
                        <StatRow label="最大生命" icon="lucide:heart-plus|#ff5257" value={formatNumber(stats.maxHealth, "+")} />
                        <StatRow label="护甲值" icon="lucide:shield|#3c91ff" value={formatNumber(stats.armor)} />
                        <StatRow label="护甲韧性" icon="lucide:shield-plus|#14d681" value={formatNumber(stats.toughness)} />
                        <StatRow label="防御减伤" icon="lucide:shield-minus|#ff7a00" value={formatNumber(stats.defense, "-")} />
                        <StatRow
                            label="最大法力"
                            icon="lucide:wand-sparkles|#60a5fa"
                            value={formatNumber(stats.maxMana, "+")}
                        />
                        <StatRow label="最大耐力" icon="lucide:gauge|#b76bff" value={formatNumber(stats.maxStamina, "+")} />
                        <StatRow label="招架几率" icon="lucide:swords|#ec5bd8" value={formatPercent(stats.parry, "+")} />
                        <StatRow
                            label="移动速度"
                            icon="lucide:footprints|#e8d525"
                            value={formatNumber(stats.moveSpeed) === "0" ? "—" : formatNumber(stats.moveSpeed)}
                        />
                        <StatRow label="闪避率" icon="lucide:wind|#14b8a6" value={formatPercent(stats.dodge, "+")} />
                    </div>
                </GalleryContentSection>

                {hasGem && (
                    <GalleryContentSection title="宝石" icon="lucide:gem">
                        {/* <div className="border-border/50 bg-muted/30 text-muted-foreground grid grid-cols-[1fr_auto_auto] items-center gap-3 rounded-lg border-t px-2.5 py-2 text-xs">
                            <span className="text-foreground/90 inline-flex items-center gap-1.5 font-medium">
                                <IconifyIcon icon="lucide:gem" width={14} height={14} className="text-primary" />
                                宝石
                            </span>
                            <span>
                                槽位{" "}
                                <strong className="text-foreground ml-0.5 tabular-nums">
                                    {formatNumber(item.gem?.count! + (["A", "S"].includes(item.basic.quality) ? 1 : 0), "", 0)}
                                    {["A", "S"].includes(item.basic.quality) && " (1 待打孔)"}
                                </strong>
                            </span>
                            <span>
                                容量{" "}
                                <strong className="text-foreground ml-0.5 tabular-nums">
                                    {formatNumber(item.gem?.volume, "", 0)}
                                </strong>
                            </span>
                        </div> */}
                        <div className="bg-muted/40 space-y-1 rounded-lg p-2.5">
                            <StatRow label="槽位" icon="lucide:wallet-cards" value={getGemCountString(item)} />
                            <StatRow label="容量" icon="lucide:package-open" value={formatNumber(item.gem?.volume, "", 0)} />
                        </div>
                    </GalleryContentSection>
                )}
            </div>
        </ItemCardShell>
    );
}

function ArmorSetSection({ group }: { group: ArmorSetGroup }) {
    const jobLabel = JOB_LABEL[group.job];
    const tier = QUALITY_TIER[group.quality];
    const pieceCount = group.pieces.length;
    const cd = SET_BONUS.cooldown[group.quality];
    const rr = SET_BONUS.rangedReduce[group.quality];
    const accent = group.theme.accent;

    const setEffect = (
        <div className="gallery-set-effect">
            <p className="gallery-set-effect-title">套装效果（{pieceCount}件）</p>
            <div className="gallery-set-effect-items">
                <span className="gallery-set-effect-item">
                    <IconifyIcon icon="lucide:hourglass" width={14} height={14} />
                    技能冷却 <strong>-{cd}%</strong>
                </span>
                <span className="gallery-set-effect-item">
                    <IconifyIcon icon="lucide:circle-arrow-down" width={14} height={14} />
                    远程减免 <strong>-{rr}%</strong>
                </span>
            </div>
        </div>
    );

    return (
        <GalleryGroupSection
            title={`${group.setName}套装`}
            description={`${tier}${jobLabel}防具 · 共${pieceCount}件`}
            icon="lucide:shield"
            accent={accent}
            aside={setEffect}
            contentClassName="gallery-group-grid gallery-group-grid-armor">
            {group.pieces.map((item) => (
                <ArmorPieceCard key={item.id} item={item} />
            ))}
        </GalleryGroupSection>
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
        <div className="w-full">
            <header className="gallery-page-header">
                <h1 className="text-3xl font-bold tracking-tight">护甲图鉴</h1>
                <p className="text-muted-foreground mt-1">
                    {qualityFilter === "all"
                        ? "按职业浏览全部护甲数据"
                        : `按品质浏览所有的 ${QUALITY_LABEL[qualityFilter]} 级护甲`}
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
                        onChange: (value) => setJobFilter(value as ArmorJob | "all"),
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
                        onChange: (value) => setQualityFilter(value as ArmorQuality | "all"),
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
                    <p className="text-lg">暂无符合条件的护甲</p>
                    <p className="mt-1 text-sm">请调整筛选条件后重试</p>
                </div>
            ) : (
                <div className="flex flex-col gap-6">
                    {sets.map((group) => (
                        <ArmorSetSection key={group.key} group={group} />
                    ))}
                </div>
            )}
        </div>
    );
}
