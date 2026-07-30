"use client";

import { useMemo, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { gallery_jewelry_data } from "@/.velite";
import { IconifyIcon } from "@/components/iconify-icon";
import { cn } from "@/lib/utils";
import Image from "next/image";

/* -------------------------------------------------------------------------- */
/*  Types — aligned with jewelry gallery YAML / Velite schema                 */
/* -------------------------------------------------------------------------- */

export type JewelryJob = "cike" | "fashi" | "mushi" | "sheshou" | "zhanshi";

/** 饰品部位（对应 _data/jewelries/{JOB}/ 下的文件名） */
export type JewelryPosition = "jiezhiyou" | "jiezhizuo" | "mibao" | "shoutao" | "shouzhuo" | "xianglian";

export interface JewelryBasic {
    name: string;
    special: boolean;
}

export interface JewelryStatEntry {
    effect: string;
    min: number;
    max: number;
}

export interface JewelryModifierEntry {
    probability: number;
    stats: JewelryStatEntry[];
}

export interface JewelryModifiers {
    entries?: Record<string, JewelryModifierEntry>;
}

/** Schema output after transform (includes generated id / job / position) */
export interface JewelryItem {
    id: string;
    job?: JewelryJob | string;
    position?: JewelryPosition | string;
    basic: JewelryBasic;
    modifiers?: JewelryModifiers;
}

/* -------------------------------------------------------------------------- */
/*  Display maps                                                              */
/* -------------------------------------------------------------------------- */

const JOB_LABEL: Record<JewelryJob, string> = {
    zhanshi: "战士",
    fashi: "法师",
    cike: "刺客",
    sheshou: "射手",
    mushi: "牧师",
};

const POSITION_LABEL: Record<JewelryPosition, string> = {
    jiezhiyou: "右戒",
    jiezhizuo: "左戒",
    mibao: "密宝",
    shoutao: "手套",
    shouzhuo: "手镯",
    xianglian: "项链",
};

const JOB_ORDER: JewelryJob[] = ["zhanshi", "cike", "sheshou", "fashi", "mushi"];

const POSITION_ORDER: JewelryPosition[] = ["jiezhizuo", "jiezhiyou", "shoutao", "shouzhuo", "xianglian", "mibao"];

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
    "pvp-damage-reduction": "PVP 减伤",
    "pve-damage-reduction": "PVE 减伤",
    "critical-strike-chance": "暴击几率",
    "critical-strike-power": "暴击伤害",
    "parry-rating": "招架几率",
    "movement-speed": "移动速度",
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
    "pvp-damage-reduction": "lucide:shield-check|#8b5cf6",
    "pve-damage-reduction": "lucide:shield-half|#a78bfa",
    "critical-strike-chance": "lucide:target|#eab308",
    "critical-strike-power": "lucide:crosshair|#f97316",
    "parry-rating": "lucide:hand|#f59e0b",
    "movement-speed": "lucide:footprints|#22c55e",
};

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

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

/** probability 0–1 → 百分比 */
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

function entryStatCount(item: JewelryItem): number {
    const entries = item.modifiers?.entries;
    if (!entries) return 0;
    return Object.keys(entries).length;
}

/* -------------------------------------------------------------------------- */
/*  Sub-components                                                            */
/* -------------------------------------------------------------------------- */

function SpecialBadge({ special }: { special: boolean }) {
    if (!special) return null;
    return (
        <span className="inline-flex items-center justify-center rounded bg-amber-500/15 px-2 py-0.5 text-xs font-semibold tracking-wide text-amber-600 dark:text-amber-400">
            推荐
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

function JewelryCard({ item, onSelect }: { item: JewelryItem; onSelect: (item: JewelryItem) => void }) {
    const jobCode = resolveJob(item);
    const posCode = resolvePosition(item);
    const jobLabel = jobCode === "UNKNOWN" ? "未知职业" : JOB_LABEL[jobCode];
    const posLabel = posCode === "UNKNOWN" ? "未知部位" : POSITION_LABEL[posCode];
    const entryCount = entryStatCount(item);

    return (
        <button
            type="button"
            onClick={() => onSelect(item)}
            className={cn(
                "group bg-card hover:border-primary/40 focus-visible:ring-ring flex flex-col rounded-xl border p-4 text-left shadow-sm transition-all hover:shadow-md focus-visible:ring-2 focus-visible:outline-none",
                item.basic.special ? "flashing-border border-dashed" : "border-border"
            )}
            style={
                {
                    "--border-1": "oklch(from var(--primary) l c h / 0.5)",
                    "--border-2": "oklch(from var(--primary) l c h / 1)",
                } as React.CSSProperties
            }>
            <div className="mb-3 flex items-start gap-2">
                <Image
                    src={`/gallery/${item.basic.name}.png`}
                    alt={item.basic.name}
                    width={16}
                    height={16}
                    className="size-8"
                />
                <div className="min-w-0">
                    <h3 className="truncate text-base leading-tight font-semibold">{item.basic.name}</h3>
                    <p className="text-muted-foreground mt-0.5 text-xs">
                        {jobLabel} · {posLabel}
                    </p>
                </div>
                <div className="ml-auto">
                    <SpecialBadge special={item.basic.special} />
                </div>
            </div>

            <div className="border-border/60 mt-auto space-y-1 border-t pt-3">
                <StatRow label="随机效果" value={entryCount > 0 ? `${entryCount} 选 1` : "—"} />
            </div>
        </button>
    );
}

function ModifierStatLines({ stats }: { stats: JewelryStatEntry[] }) {
    return (
        <div className="mt-1 space-y-1">
            {stats.map((s) => {
                const icon = effectIcon(s.effect);
                return (
                    <div key={s.effect} className="text-muted-foreground flex items-center justify-between gap-2 text-xs">
                        <span className="flex items-center gap-1.5">
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
                            <span className="translate-y-0.5">{effectLabel(s.effect)}</span>
                        </span>
                        <span className="text-foreground font-medium tabular-nums">{formatRange(s.min, s.max)}</span>
                    </div>
                );
            })}
        </div>
    );
}

function ModifierEntryRow({ entry }: { entry: JewelryModifierEntry }) {
    return (
        <div className="border-foreground/50 rounded-md border border-dashed px-3 py-2">
            <div className="mb-1 flex items-center justify-between gap-2">
                <span className="text-muted-foreground text-xs">
                    生效概率 <span className="text-foreground font-medium">{formatPercent(entry.probability)}</span>
                </span>
            </div>
            <ModifierStatLines stats={entry.stats ?? []} />
        </div>
    );
}

function DetailPanel({ item, onClose }: { item: JewelryItem; onClose: () => void }) {
    const jobCode = resolveJob(item);
    const posCode = resolvePosition(item);
    const jobLabel = jobCode === "UNKNOWN" ? "未知职业" : JOB_LABEL[jobCode];
    const posLabel = posCode === "UNKNOWN" ? "未知部位" : POSITION_LABEL[posCode];
    const entries = item.modifiers?.entries ? Object.entries(item.modifiers.entries) : [];

    return (
        <Dialog open={!!item}>
            <DialogContent showCloseButton={false} className="mt-8">
                <div className="relative w-full" onClick={(e) => e.stopPropagation()}>
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={onClose}
                        className="text-muted-foreground hover:bg-muted hover:text-foreground absolute top-0 right-0 rounded-md p-1"
                        aria-label="关闭">
                        ✕
                    </Button>

                    <div className="mb-4 flex items-center gap-3">
                        <Image
                            src={`/gallery/${item.basic.name}.png`}
                            alt={item.basic.name}
                            width={16}
                            height={16}
                            className="size-12"
                        />
                        <div>
                            <h2 className="text-xl font-bold">{item.basic.name}</h2>
                            <p className="text-muted-foreground text-sm">
                                {jobLabel} · {posLabel}
                            </p>
                        </div>
                    </div>

                    <section className="space-y-4">
                        <div>
                            <h3 className="text-muted-foreground mb-2 text-sm font-semibold tracking-wider uppercase">
                                随机属性
                            </h3>
                            <div className="bg-muted/40 space-y-1.5 rounded-lg p-3">
                                {entries.length === 0 && <p className="text-muted-foreground text-sm">无随机属性</p>}
                                {entries.length > 0 && (
                                    <div className="space-y-2">
                                        {entries.map(([id, entry]) => (
                                            <ModifierEntryRow key={id} entry={entry} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                </div>
            </DialogContent>
        </Dialog>
    );
}

/* -------------------------------------------------------------------------- */
/*  Filter bar — 单选下拉（与宝石图鉴一致，非多选 Checkbox）                    */
/* -------------------------------------------------------------------------- */

function FilterBar({
    job,
    position,
    onJobChange,
    onPositionChange,
    total,
    filtered,
}: {
    job: JewelryJob | "all";
    position: JewelryPosition | "all";
    special: "all" | "yes" | "no";
    onJobChange: (v: JewelryJob | "all") => void;
    onPositionChange: (v: JewelryPosition | "all") => void;
    onSpecialChange: (v: "all" | "yes" | "no") => void;
    total: number;
    filtered: number;
}) {
    return (
        <div className="flex flex-wrap items-end gap-3">
            <div className="flex flex-col gap-1">
                <Field>
                    <FieldLabel className="text-muted-foreground -mb-2 text-xs">职业</FieldLabel>
                    <Select value={job} onValueChange={(v) => onJobChange(v as JewelryJob | "all")}>
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
                    <FieldLabel className="text-muted-foreground -mb-2 text-xs">部位</FieldLabel>
                    <Select value={position} onValueChange={(v) => onPositionChange(v as JewelryPosition | "all")}>
                        <SelectTrigger className="bg-background! w-36!">
                            <SelectValue placeholder="全部" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                            <SelectItem value="all">全部</SelectItem>
                            {POSITION_ORDER.map((p) => (
                                <SelectItem key={p} value={p}>
                                    {POSITION_LABEL[p]}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </Field>
            </div>

            <p className="text-muted-foreground ml-auto self-center text-right text-sm">
                正在展示 <span className="text-foreground font-medium">{filtered}</span> / {total} 件
                <br />
                点击卡片查看详情
            </p>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Jewelry gallery page — /gallery/jewelries
 *
 * Expects `items` from Velite collection `gallery_jewelry_data`.
 *
 * 筛选说明（与宝石图鉴一致）：
 * - 使用 shadcn Select 单选下拉，每个维度同一时间只选一个值（或「全部」）
 * - 状态为独立 useState，在 useMemo 中做 AND 组合过滤
 * - 并非 Checkbox 多选；若需多选可改为 Set + 切换按钮
 */
export function JewelryGalleryPage({ items }: { items: JewelryItem[] }) {
    const [jobFilter, setJobFilter] = useState<JewelryJob | "all">("all");
    const [positionFilter, setPositionFilter] = useState<JewelryPosition | "all">("all");
    const [specialFilter, setSpecialFilter] = useState<"all" | "yes" | "no">("all");
    const [selected, setSelected] = useState<JewelryItem | null>(null);

    const filtered = useMemo(() => {
        return items
            .filter((item) => {
                const jobCode = resolveJob(item);
                const posCode = resolvePosition(item);

                if (jobFilter !== "all" && jobCode !== jobFilter) return false;
                if (positionFilter !== "all" && posCode !== positionFilter) return false;
                if (specialFilter === "yes" && !item.basic.special) return false;
                if (specialFilter === "no" && item.basic.special) return false;
                return true;
            })
            .sort((a, b) => {
                const jobA = resolveJob(a);
                const jobB = resolveJob(b);
                const idxJobA = jobA === "UNKNOWN" ? 99 : JOB_ORDER.indexOf(jobA);
                const idxJobB = jobB === "UNKNOWN" ? 99 : JOB_ORDER.indexOf(jobB);
                if (idxJobA !== idxJobB) return idxJobA - idxJobB;

                const posA = resolvePosition(a);
                const posB = resolvePosition(b);
                const idxPosA = posA === "UNKNOWN" ? 99 : POSITION_ORDER.indexOf(posA);
                const idxPosB = posB === "UNKNOWN" ? 99 : POSITION_ORDER.indexOf(posB);
                return idxPosA - idxPosB;
            });
    }, [items, jobFilter, positionFilter, specialFilter]);

    return (
        <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">饰品图鉴</h1>
                <p className="text-muted-foreground mt-1">按职业与部位浏览全部饰品及可随机属性</p>
            </header>

            <div className="mb-6">
                <FilterBar
                    job={jobFilter}
                    position={positionFilter}
                    special={specialFilter}
                    onJobChange={setJobFilter}
                    onPositionChange={setPositionFilter}
                    onSpecialChange={setSpecialFilter}
                    total={items.length}
                    filtered={filtered.length}
                />
            </div>

            {filtered.length === 0 ? (
                <div className="border-border text-muted-foreground flex flex-col items-center justify-center rounded-xl border border-dashed py-16">
                    <p className="text-lg">暂无符合条件的饰品</p>
                    <p className="mt-1 text-sm">请调整筛选条件后重试</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {filtered.map((item) => (
                        <JewelryCard key={item.id} item={item} onSelect={setSelected} />
                    ))}
                </div>
            )}

            {selected && <DetailPanel item={selected} onClose={() => setSelected(null)} />}
        </div>
    );
}

/**
 * Default export for Next.js App Router usage at app/gallery/jewelries/page.tsx.
 */
export default function JewelryPage() {
    const items: JewelryItem[] = gallery_jewelry_data as JewelryItem[];
    return <JewelryGalleryPage items={items} />;
}

