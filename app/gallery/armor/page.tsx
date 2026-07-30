"use client";

import { useMemo, useState } from "react";
import { IconifyIcon } from "@/components/iconify-icon";
import Image from "next/image";
import { Field, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { gallery_armor_data } from "@/.velite";

/* -------------------------------------------------------------------------- */
/*  Types — aligned with armor_data schema                                    */
/* -------------------------------------------------------------------------- */

export type ArmorQuality = "D" | "C" | "B" | "A" | "S";
export type ArmorJob = "cike" | "fashi" | "mushi" | "sheshou" | "zhanshi";
export type ArmorPart = "HELMET" | "CHESTPLATE" | "LEGGINGS" | "BOOTS";

export interface ArmorBasic {
    name: string;
    quality: ArmorQuality;
    job: ArmorJob;
    image?: string;
}

export interface ArmorValue {
    durable?: number;
    armor?: number;
    "armor-toughness"?: number;
}

export interface ArmorEffect {
    "max-health"?: number;
    defense?: number;
    "max-mana"?: number;
    "max-stamina"?: number;
    "parry-rating"?: number;
    "movement-speed"?: number;
    "dodge-rating"?: number;
}

export interface ArmorGem {
    count?: number;
    volume?: number;
}

/** Schema output after transform (includes generated id) */
export interface ArmorItem {
    id: string;
    basic: ArmorBasic;
    value?: ArmorValue;
    effect?: ArmorEffect;
    gem?: ArmorGem;
}

interface ArmorSetGroup {
    key: string;
    job: ArmorJob;
    quality: ArmorQuality;
    setName: string;
    pieces: ArmorItem[];
}

/* -------------------------------------------------------------------------- */
/*  Display maps                                                              */
/* -------------------------------------------------------------------------- */

const JOB_LABEL: Record<ArmorJob, string> = {
    cike: "刺客",
    fashi: "法师",
    mushi: "牧师",
    sheshou: "射手",
    zhanshi: "战士",
};

const QUALITY_LABEL: Record<ArmorQuality, string> = {
    D: "D",
    C: "C",
    B: "B",
    A: "A",
    S: "S",
};

const QUALITY_COLOR: Record<ArmorQuality, string> = {
    D: "bg-slate-500 text-white",
    C: "bg-emerald-600 text-white",
    B: "bg-sky-600 text-white",
    A: "bg-violet-600 text-white",
    S: "bg-amber-500 text-black",
};

/** Soft border/accent tint per quality for the set frame */
const QUALITY_FRAME: Record<ArmorQuality, string> = {
    D: "border-sky-500/45 bg-sky-500/10",
    C: "border-emerald-500/45 bg-emerald-500/10",
    B: "border-cyan-500/45 bg-cyan-500/10",
    A: "border-violet-500/45 bg-violet-500/10",
    S: "border-amber-500/45 bg-amber-500/10",
};

/** Accent colors for set frame glow / icons (aligned with refined mock) */
const QUALITY_THEME: Record<ArmorQuality, { accent: string; accent2: string; glow: string }> = {
    D: { accent: "#3ea3ff", accent2: "#7cc5ff", glow: "rgba(62,163,255,.16)" },
    C: { accent: "#10b981", accent2: "#57ddb0", glow: "rgba(16,185,129,.16)" },
    B: { accent: "#0ea5e9", accent2: "#7dd3fc", glow: "rgba(14,165,233,.16)" },
    A: { accent: "#8b5cf6", accent2: "#c4b5fd", glow: "rgba(139,92,246,.16)" },
    S: { accent: "#f59e0b", accent2: "#fde68a", glow: "rgba(245,158,11,.16)" },
};

const PART_LABEL: Record<ArmorPart, string> = {
    HELMET: "头盔",
    CHESTPLATE: "胸甲",
    LEGGINGS: "护腿",
    BOOTS: "靴子",
};

const PART_ORDER: ArmorPart[] = ["HELMET", "CHESTPLATE", "LEGGINGS", "BOOTS"];

const JOB_ORDER: ArmorJob[] = ["zhanshi", "cike", "sheshou", "fashi", "mushi"];

const QUALITY_ORDER: ArmorQuality[] = ["D", "C", "B", "A", "S"];

const SET_BONUS = {
    cooldown: { D: 2, C: 4, B: 6, A: 8, S: 10 },
    rangedReduce: { D: 10, C: 10, B: 15, A: 20, S: 25 },
} as const;

/** Quality tier subtitle shown under set name */
const QUALITY_TIER: Record<ArmorQuality, string> = {
    D: "基础",
    C: "进阶",
    B: "精良",
    A: "史诗",
    S: "传说",
};

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

function parsePartFromId(id: string): ArmorPart | "UNKNOWN" {
    const upper = id.toUpperCase();
    for (const p of PART_ORDER) {
        if (upper.endsWith(`-${p}`)) return p;
    }
    return "UNKNOWN";
}

/** Merge value + effect for display (schema may place durable under value or effect) */
function getStats(item: ArmorItem) {
    const v = item.value ?? {};
    const e = item.effect ?? {};
    // Support both schema layout and current YAML layout (fields under effect)
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

function formatNumber(n: number | undefined, digits = 2): string {
    if (n === undefined || n === null) return "—";
    if (Number.isInteger(n)) return String(n);
    return n.toFixed(digits).replace(/\.?0+$/, "");
}

/** Extract set display name from piece names, e.g. 士卒之盔 → 士卒 */
function deriveSetName(pieces: ArmorItem[]): string {
    if (pieces.length === 0) return "未知套装";
    const names = pieces.map((p) => p.basic.name);
    // Prefer the common prefix before "之"
    const withZhi = names.map((n) => {
        const idx = n.indexOf("之");
        return idx > 0 ? n.slice(0, idx) : n;
    });
    const first = withZhi[0];
    if (withZhi.every((n) => n === first)) return first;
    // Fallback: longest common prefix
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
        // Sort pieces by part order
        pieces.sort((a, b) => {
            const pA = PART_ORDER.indexOf(parsePartFromId(a.id) as ArmorPart);
            const pB = PART_ORDER.indexOf(parsePartFromId(b.id) as ArmorPart);
            return pA - pB;
        });
        groups.push({
            key,
            job,
            quality,
            setName: deriveSetName(pieces),
            pieces,
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

/* -------------------------------------------------------------------------- */
/*  Sub-components                                                            */
/* -------------------------------------------------------------------------- */

function QualityBadge({ quality }: { quality: ArmorQuality }) {
    return (
        <span
            className={`inline-flex items-center justify-center rounded px-2 py-0.5 text-xs font-semibold tracking-wide ${QUALITY_COLOR[quality]}`}>
            {QUALITY_LABEL[quality]}
        </span>
    );
}

function StatRow({ label, icon, value, suffix = "" }: { label: string; icon?: string; value: string; suffix?: string }) {
    if (value === "—") return null;
    return (
        <div className="flex justify-between gap-2 text-sm">
            <span className="text-muted-foreground flex shrink-0 items-center gap-2">
                {icon &&
                    (icon.includes("|") ? (
                        <IconifyIcon icon={icon.split("|")[0]} style={{ color: icon.split("|")[1] }} width={16} height={16} />
                    ) : (
                        <IconifyIcon icon={icon} width={16} height={16} />
                    ))}
                {label}
            </span>
            <span className="text-right font-medium tabular-nums">
                {value}
                {suffix}
            </span>
        </div>
    );
}

/** Single equipment card inside a set — original layout; gem bar style from refined mock */
function ArmorPieceCard({ item }: { item: ArmorItem }) {
    const part = parsePartFromId(item.id);
    const stats = getStats(item);
    const jobLabel = JOB_LABEL[item.basic.job] ?? item.basic.job;
    const partLabel = part === "UNKNOWN" ? "—" : PART_LABEL[part];
    const hasGem = item.gem?.count !== undefined || item.gem?.volume !== undefined;

    return (
        <article className="border-border bg-card relative flex flex-col overflow-hidden rounded-xl border p-4 shadow-sm">
            {/* subtle top accent */}
            <div
                className="pointer-events-none absolute inset-x-0 top-0 h-0.5 opacity-80"
                style={{
                    background:
                        "linear-gradient(90deg, transparent, color-mix(in srgb, var(--primary) 55%, transparent), transparent)",
                }}
            />

            {/* Header */}
            <div className="mb-3 flex items-start gap-2">
                <Image
                    src={`/gallery/${item.basic.name}.png`}
                    alt={item.basic.name}
                    width={32}
                    height={32}
                    className="size-8 shrink-0 drop-shadow-sm"
                />
                <div className="min-w-0 flex-1">
                    <h3 className="truncate text-base leading-tight font-semibold">{item.basic.name}</h3>
                    <p className="text-muted-foreground mt-0.5 text-xs">
                        {jobLabel} · {partLabel}
                    </p>
                </div>
            </div>

            <div className="space-y-3">
                {/* 基础属性 */}
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

                {/* 宝石栏 — bar style */}
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
        </article>
    );
}

/** Set-level frame: header + always-visible grid of pieces (no collapse) */
function ArmorSetSection({ group }: { group: ArmorSetGroup }) {
    const jobLabel = JOB_LABEL[group.job];
    const tier = QUALITY_TIER[group.quality];
    const pieceCount = group.pieces.length;
    const cd = SET_BONUS.cooldown[group.quality];
    const rr = SET_BONUS.rangedReduce[group.quality];
    const theme = QUALITY_THEME[group.quality];

    return (
        <section
            className={`relative overflow-hidden rounded-2xl border p-4 shadow-sm sm:p-5 ${QUALITY_FRAME[group.quality]}`}
            style={
                {
                    boxShadow: `0 12px 40px rgba(0,0,0,.18), 0 0 0 1px color-mix(in srgb, ${theme.accent} 22%, transparent)`,
                    backgroundImage: `radial-gradient(circle at 8% 0%, ${theme.glow}, transparent 42%)`,
                } as React.CSSProperties
            }>
            {/* Set header */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                    <div
                        className="flex size-10 shrink-0 items-center justify-center rounded-lg border"
                        style={{
                            borderColor: `color-mix(in srgb, ${theme.accent} 45%, transparent)`,
                            background: `linear-gradient(180deg, color-mix(in srgb, ${theme.accent} 28%, transparent), color-mix(in srgb, ${theme.accent} 10%, transparent))`,
                            boxShadow: `0 0 16px ${theme.glow}`,
                        }}>
                        <IconifyIcon icon="lucide:shield" width={22} height={22} style={{ color: theme.accent2 }} />
                    </div>
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <h2 className="text-lg font-semibold tracking-tight">{group.setName}套装</h2>
                            <QualityBadge quality={group.quality} />
                        </div>
                        <p className="text-muted-foreground mt-0.5 text-sm">
                            {tier}
                            {jobLabel}防具 · 共{pieceCount}件
                        </p>
                    </div>
                </div>

                {/* 套装效果 — shown once at set level */}
                <div
                    className="rounded-lg border p-2 text-sm"
                    style={{
                        borderColor: `color-mix(in srgb, ${theme.accent} 35%, transparent)`,
                        background: `linear-gradient(180deg, color-mix(in srgb, ${theme.accent} 12%, transparent), color-mix(in srgb, ${theme.accent} 6%, transparent))`,
                        boxShadow: `inset 0 1px color-mix(in srgb, ${theme.accent2} 12%, transparent)`,
                    }}>
                    <p className="text-muted-foreground mb-1.5 text-xs font-semibold tracking-wider uppercase">
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
                            <IconifyIcon
                                icon="lucide:circle-arrow-down"
                                style={{ color: theme.accent2 }}
                                width={14}
                                height={14}
                            />
                            <span className="text-muted-foreground">远程减免</span>
                            <span className="font-medium tabular-nums" style={{ color: theme.accent2 }}>
                                -{rr}%
                            </span>
                        </span>
                    </div>
                </div>
            </div>

            {/* Pieces grid — always expanded */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {group.pieces.map((item) => (
                    <ArmorPieceCard key={item.id} item={item} />
                ))}
            </div>
        </section>
    );
}

/* -------------------------------------------------------------------------- */
/*  Filter bar                                                                */
/* -------------------------------------------------------------------------- */

function FilterBar({
    job,
    quality,
    part,
    onJobChange,
    onQualityChange,
    onPartChange,
    total,
    filtered,
}: {
    job: ArmorJob | "all";
    quality: ArmorQuality | "all";
    part: ArmorPart | "all";
    onJobChange: (v: ArmorJob | "all") => void;
    onQualityChange: (v: ArmorQuality | "all") => void;
    onPartChange: (v: ArmorPart | "all") => void;
    total: number;
    filtered: number;
}) {
    return (
        <div className="flex flex-wrap items-end gap-3">
            <div className="flex flex-col gap-1">
                <Field>
                    <FieldLabel className="text-muted-foreground -mb-2 text-xs">职业</FieldLabel>
                    <Select value={job} onValueChange={(v) => onJobChange(v as ArmorJob | "all")}>
                        <SelectTrigger className="bg-background! w-36!">
                            <SelectValue placeholder="全部" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                            <SelectItem value="all">全部</SelectItem>
                            {JOB_ORDER.map((j) => (
                                <SelectItem key={j} value={j}>
                                    {JOB_LABEL[j]}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </Field>
            </div>

            <div className="flex flex-col gap-1">
                <Field>
                    <FieldLabel className="text-muted-foreground -mb-2 text-xs">品质</FieldLabel>
                    <Select value={quality} onValueChange={(v) => onQualityChange(v as ArmorQuality | "all")}>
                        <SelectTrigger className="bg-background! w-36!">
                            <SelectValue placeholder="全部" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                            <SelectItem value="all">全部</SelectItem>
                            {QUALITY_ORDER.map((q) => (
                                <SelectItem key={q} value={q}>
                                    {q}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </Field>
            </div>

            <div className="flex flex-col gap-1">
                <Field>
                    <FieldLabel className="text-muted-foreground -mb-2 text-xs">部位</FieldLabel>
                    <Select value={part} onValueChange={(v) => onPartChange(v as ArmorPart | "all")}>
                        <SelectTrigger className="bg-background! w-36!">
                            <SelectValue placeholder="全部" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                            <SelectItem value="all">全部</SelectItem>
                            {PART_ORDER.map((p) => (
                                <SelectItem key={p} value={p}>
                                    {PART_LABEL[p]}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </Field>
            </div>

            <p className="text-muted-foreground ml-auto self-center text-right text-sm">
                正在展示 <span className="text-foreground font-medium">{filtered}</span> / {total} 件
            </p>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Armor gallery page — /gallery/armor
 *
 * Displays armor grouped by set (job + quality). Each set is a fixed section
 * with header (name, tier, set bonuses) and a grid of piece cards. No collapse.
 */
export function ArmorGalleryPage({ items }: { items: ArmorItem[] }) {
    const [jobFilter, setJobFilter] = useState<ArmorJob | "all">("all");
    const [qualityFilter, setQualityFilter] = useState<ArmorQuality | "all">("all");
    const [partFilter, setPartFilter] = useState<ArmorPart | "all">("all");

    const filtered = useMemo(() => {
        return items.filter((item) => {
            if (jobFilter !== "all" && item.basic.job !== jobFilter) return false;
            if (qualityFilter !== "all" && item.basic.quality !== qualityFilter) return false;
            if (partFilter !== "all") {
                const p = parsePartFromId(item.id);
                if (p !== partFilter) return false;
            }
            return true;
        });
    }, [items, jobFilter, qualityFilter, partFilter]);

    const sets = useMemo(() => groupIntoSets(filtered), [filtered]);

    return (
        <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">护甲图鉴</h1>
                <p className="text-muted-foreground mt-1">按职业、品质与部位浏览全部护甲数据（按套装分组）</p>
            </header>

            <div className="mb-6">
                <FilterBar
                    job={jobFilter}
                    quality={qualityFilter}
                    part={partFilter}
                    onJobChange={setJobFilter}
                    onQualityChange={setQualityFilter}
                    onPartChange={setPartFilter}
                    total={items.length}
                    filtered={filtered.length}
                />
            </div>

            {sets.length === 0 ? (
                <div className="border-border text-muted-foreground flex flex-col items-center justify-center rounded-xl border border-dashed py-16">
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

/**
 * Default export for Next.js App Router usage at app/gallery/armor/page.tsx.
 */
export default function ArmorPage() {
    const items: ArmorItem[] = gallery_armor_data;
    return <ArmorGalleryPage items={items} />;
}

