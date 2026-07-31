"use client";

import { useMemo, useState } from "react";
import { Field, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { gallery_sword_data } from "@/.velite";
import { IconifyIcon } from "@/components/iconify-icon";
import Image from "next/image";

/* -------------------------------------------------------------------------- */
/*  Types — aligned with sword_data schema                                    */
/* -------------------------------------------------------------------------- */

export type SwordQuality = "D" | "C" | "B" | "A" | "S";
export type SwordJob = "cike" | "fashi" | "mushi" | "sheshou" | "zhanshi";

export interface SwordBasic {
    name: string;
    quality: SwordQuality;
    job: SwordJob;
    image?: string;
}

export interface SwordValue {
    durable?: number;
    "attack-damage"?: number;
    "attack-speed"?: number;
    "critical-strike-power"?: number;
    "critical-strike-chance"?: number;
    lifesteal?: number;
}

export interface SwordGem {
    count?: number;
    volume?: number;
    lock?: number;
}

/** Schema output after transform (includes generated id) */
export interface SwordItem {
    id: string;
    basic: SwordBasic;
    value?: SwordValue;
    gem?: SwordGem;
}

/* -------------------------------------------------------------------------- */
/*  Display maps                                                              */
/* -------------------------------------------------------------------------- */

const JOB_LABEL: Record<SwordJob, string> = {
    cike: "刺客",
    fashi: "法师",
    mushi: "牧师",
    sheshou: "射手",
    zhanshi: "战士",
};

const QUALITY_LABEL: Record<SwordQuality, string> = {
    D: "D",
    C: "C",
    B: "B",
    A: "A",
    S: "S",
};

const QUALITY_COLOR: Record<SwordQuality, string> = {
    D: "bg-slate-500 text-white",
    C: "bg-emerald-600 text-white",
    B: "bg-sky-600 text-white",
    A: "bg-violet-600 text-white",
    S: "bg-amber-500 text-black",
};

const JOB_ORDER: SwordJob[] = ["zhanshi", "cike", "sheshou", "fashi", "mushi"];

const QUALITY_ORDER: SwordQuality[] = ["D", "C", "B", "A", "S"];

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

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

function formatNumber(n: number | undefined, digits = 2): string {
    if (n === undefined || n === null) return "—";
    if (Number.isInteger(n)) return String(n);
    return n.toFixed(digits).replace(/\.?0+$/, "");
}

/* -------------------------------------------------------------------------- */
/*  Sub-components                                                            */
/* -------------------------------------------------------------------------- */

function QualityBadge({ quality }: { quality: SwordQuality }) {
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

function SwordCard({ item }: { item: SwordItem }) {
    const stats = getStats(item);
    const jobLabel = JOB_LABEL[item.basic.job] ?? item.basic.job;
    const hasCombat = stats.critPower !== undefined || stats.critChance !== undefined || stats.lifesteal !== undefined;
    const hasGem = item.gem?.count !== undefined || item.gem?.volume !== undefined || item.gem?.lock !== undefined;

    return (
        <article className="border-border bg-card flex flex-col rounded-xl border p-4 shadow-sm">
            {/* Header */}
            <div className="mb-3 flex items-start gap-2">
                <Image
                    src={`/gallery/${item.basic.name}.png`}
                    alt={item.basic.name}
                    width={32}
                    height={32}
                    className="size-8 shrink-0"
                />
                <div className="min-w-0 flex-1">
                    <h3 className="truncate text-base leading-tight font-semibold">{item.basic.name}</h3>
                    <p className="text-muted-foreground mt-0.5 text-xs">{jobLabel}</p>
                </div>
                <QualityBadge quality={item.basic.quality} />
            </div>

            <div className="space-y-3">
                {/* 属性：基础 + 战斗 + 宝石合并为一组，与护甲图鉴一致 */}
                <div>
                    <h4 className="text-muted-foreground mb-1.5 text-xs font-semibold tracking-wider uppercase">属性</h4>
                    <div className="bg-muted/40 space-y-1 rounded-lg p-2.5">
                        <StatRow
                            label="耐久"
                            icon="lucide:rectangle-ellipsis|var(--color-primary)"
                            value={formatNumber(stats.durable, 0)}
                        />
                        <StatRow label="攻击力" icon="lucide:sword|#ef4444" value={formatNumber(stats.attackDamage)} />
                        <StatRow label="攻击速度" icon="lucide:gauge|#3b82f6" value={formatNumber(stats.attackSpeed)} />
                        {hasCombat ? (
                            <>
                                <StatRow
                                    label="暴击伤害"
                                    icon="lucide:crosshair|#f97316"
                                    value={formatNumber(stats.critPower)}
                                />
                                <StatRow label="暴击几率" icon="lucide:target|#eab308" value={formatNumber(stats.critChance)} />
                                <StatRow
                                    label="生命偷取"
                                    icon="lucide:heart-pulse|#ef4444"
                                    value={formatNumber(stats.lifesteal)}
                                />
                            </>
                        ) : null}
                        {hasGem && (
                            <>
                                <StatRow label="宝石槽位" icon="lucide:wallet-cards" value={formatNumber(item.gem?.count, 0)} />
                                <StatRow label="锁定槽位" icon="lucide:lock|#a1a1aa" value={formatNumber(item.gem?.lock, 0)} />
                                <StatRow
                                    label="宝石容量"
                                    icon="lucide:package-open"
                                    value={formatNumber(item.gem?.volume, 0)}
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </article>
    );
}

/* -------------------------------------------------------------------------- */
/*  Filter bar                                                                */
/* -------------------------------------------------------------------------- */

function FilterBar({
    job,
    quality,
    onJobChange,
    onQualityChange,
    total,
    filtered,
}: {
    job: SwordJob | "all";
    quality: SwordQuality | "all";
    onJobChange: (v: SwordJob | "all") => void;
    onQualityChange: (v: SwordQuality | "all") => void;
    total: number;
    filtered: number;
}) {
    return (
        <div className="flex flex-wrap items-end gap-3">
            <div className="flex flex-col gap-1">
                <Field>
                    <FieldLabel className="text-muted-foreground -mb-2 text-xs">职业</FieldLabel>
                    <Select value={job} onValueChange={(v) => onJobChange(v as SwordJob | "all")}>
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
                    <Select value={quality} onValueChange={(v) => onQualityChange(v as SwordQuality | "all")}>
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
 * Sword gallery page — /gallery/sword
 *
 * Expects `items` to be the collection produced by the sword_data schema.
 *
 *   import { sword } from "@/content";
 *   <SwordGalleryPage items={sword} />
 */
function SwordGalleryPage({ items }: { items: SwordItem[] }) {
    const [jobFilter, setJobFilter] = useState<SwordJob | "all">("all");
    const [qualityFilter, setQualityFilter] = useState<SwordQuality | "all">("all");

    const filtered = useMemo(() => {
        return items
            .filter((item) => {
                if (jobFilter !== "all" && item.basic.job !== jobFilter) return false;
                if (qualityFilter !== "all" && item.basic.quality !== qualityFilter) return false;
                return true;
            })
            .sort((a, b) => {
                const jobA = JOB_ORDER.indexOf(a.basic.job);
                const jobB = JOB_ORDER.indexOf(b.basic.job);
                if (jobA !== jobB) return jobA - jobB;
                const qA = QUALITY_ORDER.indexOf(a.basic.quality);
                const qB = QUALITY_ORDER.indexOf(b.basic.quality);
                return qA - qB;
            });
    }, [items, jobFilter, qualityFilter]);

    return (
        <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">武器图鉴</h1>
                <p className="text-muted-foreground mt-1">按职业与品质浏览全部武器数据</p>
            </header>

            <div className="mb-6">
                <FilterBar
                    job={jobFilter}
                    quality={qualityFilter}
                    onJobChange={setJobFilter}
                    onQualityChange={setQualityFilter}
                    total={items.length}
                    filtered={filtered.length}
                />
            </div>

            {filtered.length === 0 ? (
                <div className="border-border text-muted-foreground flex flex-col items-center justify-center rounded-xl border border-dashed py-16">
                    <p className="text-lg">暂无符合条件的武器</p>
                    <p className="mt-1 text-sm">请调整筛选条件后重试</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                    {filtered.map((item) => (
                        <SwordCard key={item.id} item={item} />
                    ))}
                </div>
            )}
        </div>
    );
}

/**
 * Default export for Next.js App Router usage at app/gallery/sword/page.tsx.
 */
export default function SwordPage() {
    const items: SwordItem[] = gallery_sword_data;
    return <SwordGalleryPage items={items} />;
}

