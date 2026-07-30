"use client";

import { useMemo, useState } from "react";
import { Field, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { gallery_gem_data } from "@/.velite";
import { IconifyIcon } from "@/components/iconify-icon";
import Image from "next/image";

/* -------------------------------------------------------------------------- */
/*  Types — aligned with gem gallery YAML / Velite schema                     */
/* -------------------------------------------------------------------------- */

export type GemQuality = "C" | "B" | "A" | "S";

/** 宝石类型缩写（对应 _data/gem 下的文件夹名） */
export type GemType = "fx" | "bl" | "fy" | "hj" | "lh" | "bj";

export interface GemBasic {
    name: string;
    quality: GemQuality;
}

export interface GemMeta {
    "success-rate"?: number;
    consume?: number;
}

export interface GemModifierEntry {
    probability: number;
    effect: string;
    min: number;
    max: number;
}

export interface GemModifiers {
    min?: number;
    max?: number;
    entries?: Record<string, GemModifierEntry>;
}

/** Schema output after transform (includes generated id / type) */
export interface GemItem {
    id: string;
    type?: GemType | string;
    basic: GemBasic;
    gem?: GemMeta;
    modifiers?: GemModifiers;
}

/* -------------------------------------------------------------------------- */
/*  Display maps                                                              */
/* -------------------------------------------------------------------------- */

const TYPE_LABEL: Record<GemType, string> = {
    fx: "焚心宝石",
    bl: "冰灵宝石",
    fy: "风语宝石",
    hj: "灰烬宝石",
    lh: "灵魂宝石",
    bj: "暴击宝石",
};

const QUALITY_LABEL: Record<GemQuality, string> = {
    C: "C",
    B: "B",
    A: "A",
    S: "S",
};

const QUALITY_COLOR: Record<GemQuality, string> = {
    C: "bg-emerald-600 text-white",
    B: "bg-sky-600 text-white",
    A: "bg-violet-600 text-white",
    S: "bg-amber-500 text-black",
};

const TYPE_ORDER: GemType[] = ["fx", "bl", "fy", "hj", "lh", "bj"];

const QUALITY_ORDER: GemQuality[] = ["C", "B", "A", "S"];

/** 修饰符 effect → 中文名 */
const EFFECT_LABEL: Record<string, string> = {
    "max-health": "最大生命",
    "health-regeneration": "生命恢复",
    "max-mana": "最大法力",
    "mana-regeneration": "法力恢复",
    "max-stamina": "最大体力",
    "stamina-regeneration": "体力恢复",
    "dodge-rating": "闪避几率",
    defense: "防御减伤",
    "attack-damage": "基础攻击",
    "pve-damage": "PVE 伤害",
    "critical-strike-chance": "暴击几率",
    "critical-strike-power": "暴击伤害",
};

/**
 * 修饰符 effect → Iconify 图标（可选带颜色：icon|color）
 */
const EFFECT_ICON: Record<string, string> = {
    "max-health": "lucide:heart|#ef4444",
    "health-regeneration": "lucide:heart-pulse|#f43f5e",
    "max-mana": "lucide:droplet|#3b82f6",
    "mana-regeneration": "lucide:droplets|#60a5fa",
    "max-stamina": "lucide:zap|#eab308",
    "stamina-regeneration": "lucide:battery-charging|#facc15",
    "dodge-rating": "lucide:wind|#22c55e",
    defense: "lucide:shield|#a78bfa",
    "attack-damage": "lucide:sword|#ef4444",
    "pve-damage": "lucide:swords|#f97316",
    "critical-strike-chance": "lucide:target|#eab308",
    "critical-strike-power": "lucide:crosshair|#f97316",
};

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

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

function formatNumber(n: number | undefined | null, digits = 2): string {
    if (n === undefined || n === null) return "—";
    if (Number.isInteger(n)) return String(n);
    return n.toFixed(digits).replace(/\.?0+$/, "");
}

function formatRange(min: number | undefined, max: number | undefined): string {
    if (min === undefined && max === undefined) return "—";
    if (min === max || max === undefined) return formatNumber(min);
    if (min === undefined) return formatNumber(max);
    return `${formatNumber(min)} ~ ${formatNumber(max)}`;
}

/** probability 0–1 → 百分比；success-rate 0–100 原样加 % */
function formatPercent(n: number | undefined): string {
    if (n === undefined || n === null) return "—";
    if (n <= 1) return `${formatNumber(n * 100, 1)}%`;
    return `${formatNumber(n, 1)}%`;
}

function effectLabel(effect: string): string {
    return EFFECT_LABEL[effect] ?? effect;
}

function effectIcon(effect: string): string | undefined {
    return EFFECT_ICON[effect];
}

/* -------------------------------------------------------------------------- */
/*  Sub-components                                                            */
/* -------------------------------------------------------------------------- */

function QualityBadge({ quality }: { quality: GemQuality }) {
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

function ModifierEntryRow({ entry }: { entry: GemModifierEntry }) {
    const icon = effectIcon(entry.effect);
    return (
        <div className="border-border/50 bg-background/50 rounded-md border px-2.5 py-1.5">
            <div className="mb-0.5 flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5 text-sm font-medium">
                    {icon &&
                        (icon.includes("|") ? (
                            <IconifyIcon
                                icon={icon.split("|")[0]}
                                style={{ color: icon.split("|")[1] }}
                                width={14}
                                height={14}
                            />
                        ) : (
                            <IconifyIcon icon={icon} width={14} height={14} />
                        ))}
                    {effectLabel(entry.effect)}
                </span>
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

function GemCard({ item }: { item: GemItem }) {
    const typeCode = resolveType(item);
    const typeLabel = typeCode === "UNKNOWN" ? item.basic.name : TYPE_LABEL[typeCode];
    const entries = item.modifiers?.entries ? Object.entries(item.modifiers.entries) : [];

    return (
        <article className="border-border bg-card flex flex-col rounded-xl border p-4 shadow-sm">
            {/* Header */}
            <div className="mb-3 flex items-start gap-2">
                <Image
                    src={`/gallery/${item.basic.name}-${item.basic.quality}级.png`}
                    alt={item.basic.name}
                    width={32}
                    height={32}
                    className="size-8 shrink-0"
                />
                <div className="min-w-0">
                    <h3 className="flex items-center gap-2 truncate text-base leading-tight font-semibold">
                        {item.basic.name} <QualityBadge quality={item.basic.quality} />
                    </h3>
                    <p className="text-muted-foreground mt-0.5 text-xs">{typeLabel.slice(0, 2)}</p>
                </div>
            </div>

            <div className="space-y-3">
                {/* 镶嵌信息 */}
                <div>
                    <h4 className="text-muted-foreground mb-1.5 text-xs font-semibold tracking-wider uppercase">镶嵌信息</h4>
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

                {/* 可能属性 */}
                <div>
                    <h4 className="text-muted-foreground mb-1.5 text-xs font-semibold tracking-wider uppercase">
                        属性组
                        {entries.length > 0 ? `（${entries.length}）` : ""}
                    </h4>
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

/* -------------------------------------------------------------------------- */
/*  Filter bar                                                                */
/* -------------------------------------------------------------------------- */

function FilterBar({
    type,
    quality,
    onTypeChange,
    onQualityChange,
    total,
    filtered,
}: {
    type: GemType | "all";
    quality: GemQuality | "all";
    onTypeChange: (v: GemType | "all") => void;
    onQualityChange: (v: GemQuality | "all") => void;
    total: number;
    filtered: number;
}) {
    return (
        <div className="flex flex-wrap items-end gap-3">
            <div className="flex flex-col gap-1">
                <Field>
                    <FieldLabel className="text-muted-foreground -mb-2 text-xs">类型</FieldLabel>
                    <Select value={type} onValueChange={(v) => onTypeChange(v as GemType | "all")}>
                        <SelectTrigger className="bg-background! w-36!">
                            <SelectValue placeholder="全部" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                            <SelectItem value="all">全部</SelectItem>
                            {TYPE_ORDER.map((t) => (
                                <SelectItem key={t} value={t}>
                                    {TYPE_LABEL[t]}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </Field>
            </div>

            <div className="flex flex-col gap-1">
                <Field>
                    <FieldLabel className="text-muted-foreground -mb-2 text-xs">品质</FieldLabel>
                    <Select value={quality} onValueChange={(v) => onQualityChange(v as GemQuality | "all")}>
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

            <p className="text-muted-foreground ml-auto self-center text-sm">
                正在展示 <span className="text-foreground font-medium">{filtered}</span> / {total} 颗
            </p>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Gem gallery page — /gallery/gem
 *
 * Expects `items` from Velite collection `gallery_gem_data`.
 */
export function GemGalleryPage({ items }: { items: GemItem[] }) {
    const [typeFilter, setTypeFilter] = useState<GemType | "all">("all");
    const [qualityFilter, setQualityFilter] = useState<GemQuality | "all">("all");

    const filtered = useMemo(() => {
        return items
            .filter((item) => {
                const typeCode = resolveType(item);
                if (typeFilter !== "all" && typeCode !== typeFilter) return false;
                if (qualityFilter !== "all" && item.basic.quality !== qualityFilter) return false;
                return true;
            })
            .sort((a, b) => {
                const typeA = resolveType(a);
                const typeB = resolveType(b);
                const idxA = typeA === "UNKNOWN" ? 99 : TYPE_ORDER.indexOf(typeA as GemType);
                const idxB = typeB === "UNKNOWN" ? 99 : TYPE_ORDER.indexOf(typeB as GemType);
                if (idxA !== idxB) return idxA - idxB;
                const qA = QUALITY_ORDER.indexOf(a.basic.quality);
                const qB = QUALITY_ORDER.indexOf(b.basic.quality);
                return qA - qB;
            });
    }, [items, typeFilter, qualityFilter]);

    return (
        <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">宝石图鉴</h1>
                <p className="text-muted-foreground mt-1">按类型与品质浏览全部宝石及可随机属性</p>
            </header>

            <div className="mb-6">
                <FilterBar
                    type={typeFilter}
                    quality={qualityFilter}
                    onTypeChange={setTypeFilter}
                    onQualityChange={setQualityFilter}
                    total={items.length}
                    filtered={filtered.length}
                />
            </div>

            {filtered.length === 0 ? (
                <div className="border-border text-muted-foreground flex flex-col items-center justify-center rounded-xl border border-dashed py-16">
                    <p className="text-lg">暂无符合条件的宝石</p>
                    <p className="mt-1 text-sm">请调整筛选条件后重试</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filtered.map((item) => (
                        <GemCard key={item.id} item={item} />
                    ))}
                </div>
            )}
        </div>
    );
}

/**
 * Default export for Next.js App Router usage at app/gallery/gem/page.tsx.
 */
export default function GemPage() {
    const items: GemItem[] = gallery_gem_data;
    return <GemGalleryPage items={items} />;
}

