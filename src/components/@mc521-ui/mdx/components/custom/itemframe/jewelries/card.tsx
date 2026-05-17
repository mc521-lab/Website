"use client";

import { ResolvedJewelry } from "./types";
import { formatValue } from "./utils";
import { Diamond, Zap, Heart, Swords, ShieldCheck, Gauge, Flame, Droplets, Wind, Mountain, Sparkles } from "lucide-react";

function getAttributeIcon(name: string, color: string) {
    const n = name.toLowerCase();
    if (n.includes("攻击") || n.includes("伤害")) return <Swords className="h-3.5 w-3.5 shrink-0" style={{ color }} />;
    if (n.includes("生命") || n.includes("恢复")) return <Heart className="h-3.5 w-3.5 shrink-0" style={{ color }} />;
    if (n.includes("防御") || n.includes("减免") || n.includes("减伤"))
        return <ShieldCheck className="h-3.5 w-3.5 shrink-0" style={{ color }} />;
    if (n.includes("暴击")) return <Zap className="h-3.5 w-3.5 shrink-0" style={{ color }} />;
    if (n.includes("体力") || n.includes("耐力")) return <Mountain className="h-3.5 w-3.5 shrink-0" style={{ color }} />;
    if (n.includes("法力") || n.includes("魔力")) return <Droplets className="h-3.5 w-3.5 shrink-0" style={{ color }} />;
    if (n.includes("怒气")) return <Flame className="h-3.5 w-3.5 shrink-0" style={{ color }} />;
    if (n.includes("速度") || n.includes("闪避")) return <Wind className="h-3.5 w-3.5 shrink-0" style={{ color }} />;
    if (n.includes("经验") || n.includes("掉落")) return <Sparkles className="h-3.5 w-3.5 shrink-0" style={{ color }} />;
    return <Gauge className="h-3.5 w-3.5 shrink-0" style={{ color }} />;
}

interface JewelryCardProps {
    jewelry: ResolvedJewelry;
}

export function JewelryCard({ jewelry }: JewelryCardProps) {
    const accentColor = jewelry.jobColor ?? "#767676";

    return (
        <div
            className="group relative overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/80 transition-all duration-300 hover:border-neutral-700 hover:bg-neutral-800/80"
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

            <div className="p-5">
                {/* 头部：图标 + 名称 + 部位 */}
                <div className="mb-4 flex items-center gap-3">
                    <div
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg"
                        style={{
                            background: `linear-gradient(135deg, ${accentColor}20, ${accentColor}08)`,
                            border: `1px solid ${accentColor}30`,
                        }}>
                        <Diamond className="h-6 w-6" style={{ color: accentColor }} />
                    </div>
                    <div className="min-w-0 flex-1">
                        <h3 className="truncate text-lg font-bold text-neutral-100">{jewelry.name}</h3>
                        <div className="flex items-center gap-2 text-xs text-neutral-500">
                            <span>{jewelry.slotType}</span>
                            {jewelry.jobName && (
                                <span
                                    className="rounded-full px-2 py-0.5 font-medium"
                                    style={{
                                        background: `${accentColor}20`,
                                        color: accentColor,
                                    }}>
                                    {jewelry.jobName}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* 适用职业 */}
                <div className="mb-3 flex items-center gap-1.5 text-xs text-neutral-400">
                    <Diamond className="h-3.5 w-3.5" />
                    <span>适用: {jewelry.applicableClass}</span>
                </div>

                {/* 属性列表 */}
                <div className="space-y-2">
                    {(jewelry.features ?? []).map((feature) => (
                        <div key={feature.id} className="rounded-lg border border-neutral-800/80 bg-neutral-900/50 p-3">
                            <div className="space-y-1.5">
                                {(feature.values ?? []).map((val) => (
                                    <div key={val.id} className="flex items-center gap-2">
                                        {/* 属性图标 */}
                                        {getAttributeIcon(val.name, accentColor)}
                                        {/* 描述 */}
                                        <span className="min-w-0 flex-1 truncate text-xs text-neutral-300">{val.name}</span>
                                        {/* 数值 */}
                                        <span className="shrink-0 rounded bg-neutral-800/80 px-2 py-0.5 font-mono text-xs font-medium text-neutral-200">
                                            {formatValue(val.value)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
