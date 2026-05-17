"use client";

import { GemData } from "./types";
import { formatValue, getQualityBadgeColor, getQualityGlow } from "./utils";
import { Diamond, Sparkles } from "lucide-react";

interface GemCardProps {
    gem: GemData;
}

export function GemCard({ gem }: GemCardProps) {
    const featureMap = new Map(gem.features.map((f) => [f.id, f.name]));

    return (
        <div
            className="group relative overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/80 transition-all duration-300 hover:border-neutral-700 hover:bg-neutral-800/80"
            style={{
                boxShadow: `inset 0 0 0 1px ${gem.symbolColor}15`,
            }}>
            {/* 顶部装饰条 */}
            <div
                className="absolute top-0 left-0 h-1 w-full opacity-60"
                style={{
                    background: `linear-gradient(90deg, transparent, ${gem.symbolColor}, transparent)`,
                }}
            />

            <div className="p-5">
                {/* 头部：图标 + 名称 */}
                <div className="mb-4 flex items-center gap-3">
                    <div
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg"
                        style={{
                            background: `linear-gradient(135deg, ${gem.symbolColor}20, ${gem.symbolColor}08)`,
                            border: `1px solid ${gem.symbolColor}30`,
                        }}>
                        <Diamond className="h-6 w-6" style={{ color: gem.symbolColor }} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-neutral-100">{gem.name}</h3>
                    </div>
                </div>

                {/* 属性列表 */}
                <div className="mb-4 flex flex-wrap gap-2">
                    {gem.features.map((feature) => (
                        <span
                            key={feature.id}
                            className="inline-flex items-center gap-1 rounded-full border border-neutral-700 bg-neutral-800/60 px-2.5 py-1 text-xs text-neutral-300">
                            <Sparkles className="h-3 w-3" style={{ color: gem.symbolColor }} />
                            {feature.name}
                        </span>
                    ))}
                </div>

                {/* 品质表格 */}
                <div className="space-y-2">
                    {gem.qualitys.map((quality) => (
                        <div
                            key={quality.id}
                            className="rounded-lg border border-neutral-800/80 bg-neutral-900/50 p-3 transition-colors hover:bg-neutral-800/50"
                            style={{
                                boxShadow: getQualityGlow(quality.id),
                            }}>
                            <div className="mb-2 flex items-center justify-between">
                                <span className="text-sm font-bold" style={{ color: getQualityBadgeColor(quality.id) }}>
                                    {quality.name}
                                </span>
                                <span className="text-xs text-neutral-500">{quality.description}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                {quality.features.map((qf) => {
                                    const featureName = featureMap.get(qf.id) ?? qf.id;
                                    return (
                                        <div key={qf.id} className="flex items-center justify-between rounded bg-neutral-800/60 px-2 py-1">
                                            <span className="text-xs text-neutral-400">{featureName}</span>
                                            <span className="font-mono text-xs font-medium text-neutral-200">{formatValue(qf.value)}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
