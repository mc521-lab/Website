"use client";

import Image from "next/image";
import { ResolvedEquipment, SetEffectEntry } from "./types";
import { formatStatValue, getQualityColor } from "./utils";
import {
    Shield,
    Swords,
    Heart,
    Zap,
    Gauge,
    Flame,
    Droplets,
    Wind,
    Mountain,
    Sparkles,
    Gem,
    Wand2,
    Crosshair,
    Clock,
    Diamond,
    CircleDot,
} from "lucide-react";

function getStatIcon(name: string | undefined, color: string, size: "sm" | "xs" = "sm") {
    const sizeClass = size === "xs" ? "h-2.5 w-2.5" : "h-3 w-3";
    if (!name) return <Gauge className={`${sizeClass} shrink-0`} style={{ color }} />;
    const n = name.toLowerCase();
    if (n.includes("攻击") || n.includes("伤害")) return <Swords className={`${sizeClass} shrink-0`} style={{ color }} />;
    if (n.includes("生命")) return <Heart className={`${sizeClass} shrink-0`} style={{ color }} />;
    if (n.includes("防御") || n.includes("减免") || n.includes("减伤") || n.includes("护甲"))
        return <Shield className={`${sizeClass} shrink-0`} style={{ color }} />;
    if (n.includes("暴击")) return <Zap className={`${sizeClass} shrink-0`} style={{ color }} />;
    if (n.includes("韧性")) return <Mountain className={`${sizeClass} shrink-0`} style={{ color }} />;
    if (n.includes("法力") || n.includes("魔力")) return <Droplets className={`${sizeClass} shrink-0`} style={{ color }} />;
    if (n.includes("怒气")) return <Flame className={`${sizeClass} shrink-0`} style={{ color }} />;
    if (n.includes("速度") || n.includes("闪避") || n.includes("冷却")) return <Wind className={`${sizeClass} shrink-0`} style={{ color }} />;
    if (n.includes("经验") || n.includes("掉落")) return <Sparkles className={`${sizeClass} shrink-0`} style={{ color }} />;
    if (n.includes("命中")) return <Crosshair className={`${sizeClass} shrink-0`} style={{ color }} />;
    if (n.includes("时间") || n.includes("持续")) return <Clock className={`${sizeClass} shrink-0`} style={{ color }} />;
    if (n.includes("魔法") || n.includes("法术")) return <Wand2 className={`${sizeClass} shrink-0`} style={{ color }} />;
    return <Gauge className={`${sizeClass} shrink-0`} style={{ color }} />;
}

interface EquipmentCardProps {
    equipment: ResolvedEquipment;
}

export function EquipmentCard({ equipment }: EquipmentCardProps) {
    const accentColor = equipment.jobColor ?? "#767676";
    const qualityColor = getQualityColor(equipment.quality);
    const hasImage = equipment.image && equipment.image.trim() !== "";

    // 计算宝石槽位显示
    const gemDetails = equipment.gemSlotDetails ?? [];
    const drillSlots = gemDetails.filter((g) => g.requireDrill).length;

    return (
        <div
            className="group relative flex flex-col overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/80 transition-all duration-300 hover:border-neutral-700 hover:bg-neutral-800/80"
            style={{
                boxShadow: `inset 0 0 0 1px ${accentColor}15`,
            }}>
            {/* 顶部装饰条 */}
            <div
                className="absolute top-0 left-0 h-1 w-full opacity-60"
                style={{
                    background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
                }}
            />

            <div className="flex flex-1 flex-col p-4">
                {/* 头部：图标 + 名称 + 品质 */}
                <div className="mb-3 flex items-center gap-2.5">
                    <div
                        className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg"
                        style={{
                            background: `linear-gradient(135deg, ${accentColor}20, ${accentColor}08)`,
                            border: `1px solid ${accentColor}30`,
                        }}>
                        {hasImage ? (
                            <Image
                                loading="lazy"
                                width={48}
                                height={48}
                                src={equipment.image!}
                                alt={equipment.name}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <Diamond className="h-5 w-5" style={{ color: accentColor }} />
                        )}
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                            <h3 className="truncate text-sm font-bold text-neutral-100">{equipment.name}</h3>
                            <span
                                className="shrink-0 rounded px-1 py-0 text-[10px] leading-4 font-bold"
                                style={{
                                    background: `${qualityColor}20`,
                                    color: qualityColor,
                                    border: `1px solid ${qualityColor}40`,
                                }}>
                                {equipment.quality}
                            </span>
                        </div>
                        {/* <div className="text-[11px] text-neutral-500">{equipment.slotName}</div> */}
                    </div>
                </div>

                {/* 属性列表 - 紧凑 */}
                <div className="mb-3 flex-1 space-y-1">
                    {(equipment.stats ?? []).map((stat) => (
                        <div key={stat.id} className="flex items-center gap-1.5 rounded bg-neutral-900/50 px-2 py-1">
                            {getStatIcon(stat.name, accentColor)}
                            <span className="min-w-0 flex-1 truncate text-[11px] text-neutral-300">{stat.name}</span>
                            <span className="shrink-0 font-mono text-[11px] font-medium text-neutral-200">{formatStatValue(stat)}</span>
                        </div>
                    ))}
                </div>

                {/* 槽位信息 */}
                <div className="flex items-center gap-3 border-t border-neutral-800/80 pt-2 text-[11px] text-neutral-400">
                    <div className="flex items-center gap-1">
                        <Wand2 className="h-3 w-3 text-neutral-500" />
                        <span className="font-mono text-neutral-200">{equipment.enchantSlots}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Gem className="h-3 w-3 text-neutral-500" />
                        <span className="font-mono text-neutral-200">{equipment.gemSlots}</span>
                    </div>
                    {drillSlots > 0 && (
                        <div className="flex items-center gap-1 text-amber-500/80">
                            <CircleDot className="h-3 w-3" />
                            <span className="font-mono">{drillSlots}待打孔</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

interface EquipmentSetRowProps {
    setName: string;
    armors: ResolvedEquipment[];
    jobColor?: string;
    setEffects?: Record<string, SetEffectEntry[]>;
}

export function EquipmentSetRow({ setName, armors, jobColor, setEffects }: EquipmentSetRowProps) {
    const accentColor = jobColor ?? "#767676";

    // 防具固定顺序：头盔、胸甲、护腿、靴子
    const armorSlotOrder = ["helmet", "chestplate", "leggings", "boots"];
    const orderedArmors = armorSlotOrder.map((slot) => armors.find((e) => e.slot === slot)).filter(Boolean) as ResolvedEquipment[];

    return (
        <div className="mb-6">
            {/* 套装标题 */}
            <div className="mb-3 flex flex-wrap items-center gap-3">
                <div className="h-5 w-1 rounded-full" style={{ backgroundColor: accentColor }} />
                <h3 className="text-base font-bold text-neutral-100">{setName}</h3>
                {setEffects && Object.keys(setEffects).length > 0 && (
                    <div className="flex flex-wrap items-center gap-2">
                        {Object.entries(setEffects).map(([count, effects]) => (
                            <div
                                key={count}
                                className="flex items-center gap-1.5 rounded-full border border-neutral-700 bg-neutral-800/60 px-2.5 py-0.5 text-[11px]">
                                <span style={{ color: accentColor }} className="font-medium">
                                    {count}件套
                                </span>
                                <span className="text-neutral-400">{effects.map((e) => `${e.name} ${formatStatValue(e)}`).join("，")}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* 防具四件一排 */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {orderedArmors.map((equipment) => (
                    <EquipmentCard key={equipment.id} equipment={equipment} />
                ))}
            </div>
        </div>
    );
}

// 紧凑型武器卡片 - 用于武器展示页面，5个一行
interface CompactWeaponCardProps {
    equipment: ResolvedEquipment;
}

export function CompactWeaponCard({ equipment }: CompactWeaponCardProps) {
    const accentColor = equipment.jobColor ?? "#767676";
    const qualityColor = getQualityColor(equipment.quality);
    const hasImage = equipment.image && equipment.image.trim() !== "";

    // 计算宝石槽位显示
    const gemDetails = equipment.gemSlotDetails ?? [];
    const drillSlots = gemDetails.filter((g) => g.requireDrill).length;

    return (
        <div
            className="group relative flex flex-col overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900/80 transition-all duration-200 hover:border-neutral-700 hover:bg-neutral-800/80"
            style={{
                boxShadow: `inset 0 0 0 1px ${accentColor}10`,
            }}>
            {/* 顶部装饰条 */}
            <div
                className="absolute top-0 left-0 h-0.5 w-full opacity-60"
                style={{
                    background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
                }}
            />

            <div className="flex flex-1 flex-col p-2.5">
                {/* 头部：图标 + 名称 + 品质 - 更紧凑 */}
                <div className="mb-2 flex items-center gap-2">
                    <div
                        className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-md"
                        style={{
                            background: `linear-gradient(135deg, ${accentColor}15, ${accentColor}05)`,
                            border: `1px solid ${accentColor}25`,
                        }}>
                        {hasImage ? (
                            <Image
                                loading="lazy"
                                width={48}
                                height={48}
                                src={equipment.image!}
                                alt={equipment.name}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <Diamond className="h-4 w-4" style={{ color: accentColor }} />
                        )}
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1">
                            <h3 className="truncate text-xs font-bold text-neutral-100">{equipment.name}</h3>
                            <span
                                className="shrink-0 rounded px-1 py-0 text-[9px] leading-3 font-bold"
                                style={{
                                    background: `${qualityColor}20`,
                                    color: qualityColor,
                                    border: `1px solid ${qualityColor}40`,
                                }}>
                                {equipment.quality}
                            </span>
                        </div>
                        {/* <div className="text-[9px] text-neutral-500">{equipment.slotName}</div> */}
                    </div>
                </div>

                {/* 属性列表 - 超紧凑 */}
                <div className="mb-2 flex-1 space-y-0.5">
                    {(equipment.stats ?? []).map((stat) => (
                        <div key={stat.id} className="flex items-center gap-1 rounded bg-neutral-900/50 px-1.5 py-0.5">
                            {getStatIcon(stat.name, accentColor, "xs")}
                            <span className="min-w-0 flex-1 truncate text-[10px] text-neutral-400">{stat.name}</span>
                            <span className="shrink-0 font-mono text-[10px] font-medium text-neutral-200">{formatStatValue(stat)}</span>
                        </div>
                    ))}
                </div>

                {/* 槽位信息 - 更紧凑 */}
                <div className="flex items-center gap-2 border-t border-neutral-800/80 pt-1.5 text-[10px] text-neutral-400">
                    <div className="flex items-center gap-0.5">
                        <Wand2 className="h-2.5 w-2.5 text-neutral-500" />
                        <span className="font-mono text-neutral-300">{equipment.enchantSlots}</span>
                    </div>
                    <div className="flex items-center gap-0.5">
                        <Gem className="h-2.5 w-2.5 text-neutral-500" />
                        <span className="font-mono text-neutral-300">{equipment.gemSlots}</span>
                    </div>
                    {drillSlots > 0 && (
                        <div className="flex items-center gap-0.5 text-amber-500/80">
                            <CircleDot className="h-2.5 w-2.5" />
                            <span className="font-mono text-[9px]">{drillSlots}孔待打</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
