"use client";

import { useMemo, useState } from "react";

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

const PART_LABEL: Record<ArmorPart, string> = {
    HELMET: "头盔",
    CHESTPLATE: "胸甲",
    LEGGINGS: "护腿",
    BOOTS: "靴子",
};

const PART_ORDER: ArmorPart[] = ["HELMET", "CHESTPLATE", "LEGGINGS", "BOOTS"];

const JOB_ORDER: ArmorJob[] = ["zhanshi", "cike", "sheshou", "fashi", "mushi"];

const QUALITY_ORDER: ArmorQuality[] = ["D", "C", "B", "A", "S"];

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
    //  Support both schema layout and current YAML layout (fields under effect)
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

function ArmorCard({ item, onSelect }: { item: ArmorItem; onSelect: (item: ArmorItem) => void }) {
    const part = parsePartFromId(item.id);
    const stats = getStats(item);
    const jobLabel = JOB_LABEL[item.basic.job] ?? item.basic.job;
    const partLabel = part === "UNKNOWN" ? "—" : PART_LABEL[part];

    return (
        <button
            type="button"
            onClick={() => onSelect(item)}
            className="group border-border bg-card hover:border-primary/40 focus-visible:ring-ring flex flex-col rounded-xl border p-4 text-left shadow-sm transition-all hover:shadow-md focus-visible:ring-2 focus-visible:outline-none">
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
                        {jobLabel} · {partLabel}
                    </p>
                </div>
                <div className="ml-auto">
                    <QualityBadge quality={item.basic.quality} />
                </div>
            </div>

            <div className="border-border/60 mt-auto space-y-1 border-t pt-3">
                <StatRow label="耐久" value={formatNumber(stats.durable, 0)} />
                <StatRow label="护甲" value={formatNumber(stats.armor)} />
                <StatRow label="韧性" value={formatNumber(stats.toughness)} />
                <StatRow label="防御" value={formatNumber(stats.defense)} />
            </div>
        </button>
    );
}

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
function DetailPanel({ item, onClose }: { item: ArmorItem; onClose: () => void }) {
    const part = parsePartFromId(item.id);
    const stats = getStats(item);
    const jobLabel = JOB_LABEL[item.basic.job] ?? item.basic.job;
    const partLabel = part === "UNKNOWN" ? "未知部位" : PART_LABEL[part];

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
                            <h2 className="flex items-center gap-2 text-xl font-bold">
                                {item.basic.name} <QualityBadge quality={item.basic.quality} />
                            </h2>
                            <p className="text-muted-foreground text-sm">
                                {jobLabel} · {partLabel}
                            </p>
                        </div>
                    </div>

                    <section className="space-y-4">
                        <div>
                            <h3 className="text-muted-foreground mb-2 text-sm font-semibold tracking-wider uppercase">
                                {item.basic.name.slice(0, 2)} 四件套效果
                            </h3>
                            <div
                                className="bg-muted/40 flashing-border space-y-1.5 rounded-lg border p-3"
                                style={
                                    {
                                        "--border-1": "oklch(from var(--primary) l c h / 0.5)",
                                        "--border-2": "oklch(from var(--primary) l c h / 1)",
                                    } as React.CSSProperties
                                }>
                                <StatRow
                                    label="技能冷却"
                                    icon="lucide:hourglass|#8b5cf6"
                                    value={`-${{ D: 2, C: 4, B: 6, A: 8, S: 10 }[item.basic.quality]}%`}
                                />
                                <StatRow
                                    label="远程减免"
                                    icon="lucide:circle-arrow-down|#f97316"
                                    value={`-${{ D: 10, C: 10, B: 15, A: 20, S: 25 }[item.basic.quality]}%`}
                                />
                            </div>
                        </div>

                        <div>
                            <h3 className="text-muted-foreground mb-2 text-sm font-semibold tracking-wider uppercase">
                                基础数值
                            </h3>
                            <div className="bg-muted/40 space-y-1.5 rounded-lg p-3">
                                <StatRow
                                    label="耐久"
                                    icon="lucide:rectangle-ellipsis|var(--color-primary)"
                                    value={formatNumber(stats.durable, 0)}
                                />
                                <StatRow label="护甲值" icon="lucide:shield|#3b82f6" value={formatNumber(stats.armor)} />
                                <StatRow
                                    label="护甲韧性"
                                    icon="lucide:shield-plus|#22c55e"
                                    value={formatNumber(stats.toughness)}
                                />
                            </div>
                        </div>

                        <div>
                            <h3 className="text-muted-foreground mb-2 text-sm font-semibold tracking-wider uppercase">
                                特殊效果
                            </h3>
                            <div className="bg-muted/40 space-y-1.5 rounded-lg p-3">
                                <StatRow
                                    label="最大生命"
                                    icon="lucide:heart-plus|#ef4444"
                                    value={formatNumber(stats.maxHealth)}
                                />
                                <StatRow
                                    label="防御减伤"
                                    icon="lucide:shield-minus|#f97316"
                                    value={formatNumber(stats.defense)}
                                />
                                <StatRow
                                    label="最大法力"
                                    icon="lucide:wand-sparkles|#60a5fa"
                                    value={formatNumber(stats.maxMana)}
                                />
                                <StatRow label="最大耐力" icon="lucide:stone|#b244ef" value={formatNumber(stats.maxStamina)} />
                                <StatRow label="招架几率" icon="lucide:hand-fist|#ef44db" value={formatNumber(stats.parry)} />
                                <StatRow
                                    label="移动速度"
                                    icon="lucide:footprints|#e8d525"
                                    value={formatNumber(stats.moveSpeed)}
                                />
                                <StatRow label="闪避率" icon="lucide:wind|#14b8a6" value={formatNumber(stats.dodge)} />
                                {!stats.maxHealth &&
                                    !stats.defense &&
                                    !stats.maxMana &&
                                    !stats.maxStamina &&
                                    !stats.parry &&
                                    !stats.moveSpeed &&
                                    !stats.dodge && <p className="text-muted-foreground text-sm">无额外效果</p>}
                            </div>
                        </div>

                        {(item.gem?.count !== undefined || item.gem?.volume !== undefined) && (
                            <div>
                                <h3 className="text-muted-foreground mb-2 text-sm font-semibold tracking-wider uppercase">
                                    宝石
                                </h3>
                                <div className="bg-muted/40 space-y-1.5 rounded-lg p-3">
                                    <StatRow
                                        label="槽位数量"
                                        icon="lucide:wallet-cards"
                                        value={formatNumber(item.gem?.count, 0)}
                                    />
                                    <StatRow
                                        label="容量"
                                        icon="lucide:package-open"
                                        value={formatNumber(item.gem?.volume, 0)}
                                    />
                                </div>
                            </div>
                        )}
                    </section>
                </div>
            </DialogContent>
        </Dialog>
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
 * Armor gallery page — /gallery/armor
 *
 * Expects `items` to be the collection produced by the armor_data schema
 * (Velite / Contentlayer / custom loader). When wiring into the app:
 *
 *   import { armor } from "@/content";  or equivalent
 *   <ArmorGalleryPage items={armor} />
 *
 * Or use the default export with a server component that fetches data
 * and passes it as props.
 */
export function ArmorGalleryPage({ items }: { items: ArmorItem[] }) {
    const [jobFilter, setJobFilter] = useState<ArmorJob | "all">("all");
    const [qualityFilter, setQualityFilter] = useState<ArmorQuality | "all">("all");
    const [partFilter, setPartFilter] = useState<ArmorPart | "all">("all");
    const [selected, setSelected] = useState<ArmorItem | null>(null);

    const filtered = useMemo(() => {
        return items
            .filter((item) => {
                if (jobFilter !== "all" && item.basic.job !== jobFilter) return false;
                if (qualityFilter !== "all" && item.basic.quality !== qualityFilter) return false;
                if (partFilter !== "all") {
                    const p = parsePartFromId(item.id);
                    if (p !== partFilter) return false;
                }
                return true;
            })
            .sort((a, b) => {
                const jobA = JOB_ORDER.indexOf(a.basic.job);
                const jobB = JOB_ORDER.indexOf(b.basic.job);
                if (jobA !== jobB) return jobA - jobB;
                const qA = QUALITY_ORDER.indexOf(a.basic.quality);
                const qB = QUALITY_ORDER.indexOf(b.basic.quality);
                if (qA !== qB) return qA - qB;
                const pA = PART_ORDER.indexOf(parsePartFromId(a.id) as ArmorPart);
                const pB = PART_ORDER.indexOf(parsePartFromId(b.id) as ArmorPart);
                return pA - pB;
            });
    }, [items, jobFilter, qualityFilter, partFilter]);

    return (
        <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">护甲图鉴</h1>
                <p className="text-muted-foreground mt-1">按职业、品质与部位浏览全部护甲数据</p>
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

            {filtered.length === 0 ? (
                <div className="border-border text-muted-foreground flex flex-col items-center justify-center rounded-xl border border-dashed py-16">
                    <p className="text-lg">暂无符合条件的护甲</p>
                    <p className="mt-1 text-sm">请调整筛选条件后重试</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filtered.map((item) => (
                        <ArmorCard key={item.id} item={item} onSelect={setSelected} />
                    ))}
                </div>
            )}

            {selected && <DetailPanel item={selected} onClose={() => setSelected(null)} />}
        </div>
    );
}

/**
 * Default export for Next.js App Router usage at app/gallery/armor/page.tsx.
 */
import { gallery_armor_data } from "@/.velite";
import { IconifyIcon } from "@/components/iconify-icon";
import Image from "next/image";
export default function ArmorPage() {
    const items: ArmorItem[] = gallery_armor_data;
    return <ArmorGalleryPage items={items} />;
}

