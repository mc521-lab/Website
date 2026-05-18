"use client";

import { ResolvedTool } from "./types";
import { getQualityColor, getMaterialIcon } from "./utils";
import { Infinity, Clock, ShieldAlert, Sparkles } from "lucide-react";

interface ToolCardProps {
    tool: ResolvedTool;
}

export function ToolCard({ tool }: ToolCardProps) {
    const qualityColor = getQualityColor(tool.quality);
    const icon = tool.categoryIcon || getMaterialIcon(tool.material);

    return (
        <div
            className="group relative flex flex-col overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/80 transition-all duration-300 hover:border-neutral-700 hover:bg-neutral-800/80"
            style={{
                boxShadow: `inset 0 0 0 1px ${qualityColor}15`,
            }}>
            {/* 顶部装饰条 */}
            <div
                className="absolute top-0 left-0 h-1 w-full opacity-60"
                style={{
                    background: `linear-gradient(90deg, transparent, ${qualityColor}, transparent)`,
                }}
            />

            <div className="flex flex-1 flex-col p-4">
                {/* 头部：图标 + 名称 + 品质 */}
                <div className="mb-3 flex items-center gap-2.5">
                    <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-2xl"
                        style={{
                            background: `linear-gradient(135deg, ${qualityColor}20, ${qualityColor}08)`,
                            border: `1px solid ${qualityColor}30`,
                        }}>
                        {icon}
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                            <h3 className="truncate text-sm font-bold text-neutral-100">{tool.name}</h3>
                            <span
                                className="shrink-0 rounded px-1 py-0 text-[10px] leading-4 font-bold"
                                style={{
                                    background: `${qualityColor}20`,
                                    color: qualityColor,
                                    border: `1px solid ${qualityColor}40`,
                                }}>
                                {tool.quality}
                            </span>
                        </div>
                        <div className="text-[11px] text-neutral-500">{tool.categoryName}</div>
                    </div>
                </div>

                {/* 特性标签 */}
                <div className="mb-3 flex flex-wrap gap-1.5">
                    {tool.unbreakable && (
                        <span className="inline-flex items-center gap-0.5 rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] text-emerald-400">
                            <Infinity className="h-2.5 w-2.5" />
                            无限耐久
                        </span>
                    )}
                    {tool.trial && (
                        <span className="inline-flex items-center gap-0.5 rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px] text-amber-400">
                            <Clock className="h-2.5 w-2.5" />
                            限时体验
                        </span>
                    )}
                    {tool.maxDurability && (
                        <span className="inline-flex items-center gap-0.5 rounded bg-red-500/10 px-1.5 py-0.5 text-[10px] text-red-400">
                            <ShieldAlert className="h-2.5 w-2.5" />
                            有限耐久
                        </span>
                    )}
                </div>

                {/* 描述 */}
                <p className="mb-3 line-clamp-3 flex-1 text-[11px] leading-relaxed text-neutral-400">{tool.description}</p>

                {/* 附魔列表 */}
                <div className="flex items-center gap-2 border-t border-neutral-800/80 pt-2">
                    <div className="flex items-center gap-1 text-[10px] text-purple-500">
                        <Sparkles className="h-3 w-3" />
                        <span>附魔</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                        {tool.enchants.map((enchant, idx) => (
                            <span key={idx} className="rounded bg-neutral-800/60 px-1.5 py-0.5 text-[10px] text-neutral-300">
                                {enchant.name}
                                <span className="ml-0.5 text-neutral-500">{enchant.level}</span>
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
