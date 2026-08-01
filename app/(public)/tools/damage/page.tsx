"use client";

import { useMemo, useState } from "react";
import { Sword, Shield, Shirt, ShieldCheck, BookOpen, Info, ChevronRight, type LucideIcon } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

// ==================== 核心计算逻辑 ====================

function calculateArmorDamage(d: number, v: number, t: number, p: number): number {
    if (p === 0 && v <= 20) {
        const threshold = 1.6 * v + 0.2 * v * t;
        if (d >= 0 && d <= threshold) {
            return (1 / (6.25 * t + 50)) * d * d + (1 - v / 25) * d;
        }
        return (1 - v / 125) * d;
    }

    const denominator = 2 + 0.25 * t;
    const inner = Math.min(20, Math.max(0.2 * v, v - d / denominator));
    const reduction = inner / 25 - 0.15 * p;
    const multiplier = Math.min(1, 1 - reduction);
    return d * multiplier;
}

// ==================== 类型定义 ====================

interface SliderConfig {
    label: string;
    key: "rawDamage" | "defenseReduction" | "armorValue" | "armorToughness" | "enchantmentFactor";
    min: number;
    max: number;
    step: number;
    unit: string;
    icon: LucideIcon;
    description: string;
}

// ==================== 配置数据 ====================

const SLIDER_CONFIGS: SliderConfig[] = [
    {
        label: "攻击伤害 d",
        key: "rawDamage",
        min: 0,
        max: 100,
        step: 0.5,
        unit: "",
        icon: Sword,
        description: "攻击造成的基础伤害值。",
    },
    {
        label: "防御减伤 r",
        key: "defenseReduction",
        min: 0,
        max: 100,
        step: 0.5,
        unit: "%",
        icon: Shield,
        description: "技能、状态效果等带来的额外固定减伤比例。",
    },
    {
        label: "护甲数值 v",
        key: "armorValue",
        min: 0,
        max: 100,
        step: 1,
        unit: "",
        icon: Shirt,
        description: "目标当前护甲值，越高提供的减伤越多。",
    },
    {
        label: "盔甲韧性 t",
        key: "armorToughness",
        min: 0,
        max: 20,
        step: 0.5,
        unit: "",
        icon: ShieldCheck,
        description: "减少高伤害对护甲减伤的削弱影响。",
    },
    {
        label: "附魔系数 k",
        key: "enchantmentFactor",
        min: 0,
        max: 100,
        step: 1,
        unit: "%",
        icon: BookOpen,
        description: "附魔保护效果的生效比例\n每件保护 4 为 16%，每件保护 5 为 20%",
    },
];

// ==================== 主页面 ====================

export default function DamageCalculatorPage() {
    const [values, setValues] = useState({
        rawDamage: 10,
        defenseReduction: 0,
        armorValue: 20,
        armorToughness: 0,
        enchantmentFactor: 0,
    });

    const [activeIndex, setActiveIndex] = useState<number>(SLIDER_CONFIGS.length - 1);
    const piercingLevel = 0;

    const finalDamage = useMemo(() => {
        const armorDamage = calculateArmorDamage(values.rawDamage, values.armorValue, values.armorToughness, piercingLevel);
        const afterDefense = armorDamage * (1 - values.defenseReduction / 100);
        const afterEnchantment = afterDefense * (1 - values.enchantmentFactor / 100);
        return Math.max(0, afterEnchantment);
    }, [values]);

    const updateValue = (key: string, value: number) => {
        setValues((prev) => ({ ...prev, [key]: value }));
    };

    const clampValue = (key: string, min: number, max: number, value: number) => {
        const parsed = Number(value);
        const clamped = Number.isNaN(parsed) ? min : Math.min(max, Math.max(min, parsed));
        updateValue(key, clamped);
    };

    return (
        <div className="flex h-full flex-1 flex-col gap-6">
            {/* 标题 */}
            <header className="text-center">
                <h1 className="font-heading text-foreground mb-2 text-2xl font-bold">伤害计算</h1>
                <p className="text-muted-foreground text-sm">调整下方参数，估算护甲与附魔减免后的实际伤害</p>
            </header>

            {/* 主内容区 */}
            <main className="flex min-h-0 flex-1 flex-col gap-4">
                {/* 上方：参数调整 + 参数说明 */}
                <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                    {/* 左侧：滑块列表 */}
                    <section className="border-foreground/8 bg-background/25 flex min-h-0 flex-col gap-3 rounded-xl border p-5">
                        <div className="border-foreground/8 border-b pb-2">
                            <span className="text-foreground/50 font-mono text-[11px] tracking-widest">PARAMETERS</span>
                            <h2 className="font-heading text-foreground text-lg font-bold">参数调整</h2>
                        </div>

                        <div className="flex flex-col gap-3">
                            {SLIDER_CONFIGS.map((config, index) => (
                                <SliderRow
                                    key={config.key}
                                    config={config}
                                    value={values[config.key]}
                                    isActive={activeIndex === index}
                                    onChange={(v) => updateValue(config.key, v)}
                                    onFocus={() => setActiveIndex(index)}
                                    onBlur={() => setActiveIndex(index)}
                                    onClamp={(v) => clampValue(config.key, config.min, config.max, v)}
                                />
                            ))}
                        </div>
                    </section>

                    {/* 右侧：参数说明（与左侧等高） */}
                    <ExplanationPanel activeIndex={activeIndex} />
                </div>

                {/* 下方：结果 + 参考链接 */}
                <div className="flex shrink-0 flex-col gap-4 lg:flex-row">
                    <ResultPanel finalDamage={finalDamage} className="flex-1" />
                    <ReferenceLink />
                </div>
            </main>
        </div>
    );
}

// ==================== 滑块行组件 ====================

function SliderRow({
    config,
    value,
    isActive,
    onChange,
    onFocus,
    onBlur,
    onClamp,
}: {
    config: SliderConfig;
    value: number;
    isActive: boolean;
    onChange: (value: number) => void;
    onFocus: () => void;
    onBlur: () => void;
    onClamp: (value: number) => void;
}) {
    const IconComp = config.icon;

    return (
        <div
            className={cn(
                "flex flex-col gap-2 rounded-lg border p-3 transition-colors",
                "hover:border-primary/20 border-white/5 bg-black/20 hover:bg-black/28",
                isActive && "border-primary/40 bg-primary/5"
            )}
            onMouseEnter={onFocus}
            onFocus={onFocus}
            tabIndex={0}>
            {/* 顶部：图标 + 标签 + 数值输入 */}
            <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                    <IconComp size={16} className="text-primary shrink-0" />
                    <label className="text-foreground/95 text-sm font-medium whitespace-nowrap">{config.label}</label>
                    <Info size={12} className="text-foreground/35 shrink-0" />
                </div>
                <div
                    className={cn(
                        "flex h-7 items-center justify-center gap-0.5 rounded-md border px-2",
                        "border-primary/35 bg-black/35 shadow-inner shadow-black/30"
                    )}>
                    <input
                        type="number"
                        value={value}
                        min={config.min}
                        max={config.max}
                        step={config.step}
                        onChange={(e) => onChange(Number(e.target.value))}
                        onFocus={onFocus}
                        onBlur={(e) => {
                            onBlur();
                            onClamp(Number(e.target.value));
                        }}
                        className={cn(
                            "[appearance:textfield] bg-transparent text-right font-mono text-sm text-white outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
                            config.unit ? "w-[4ch]" : "w-[5ch]"
                        )}
                    />
                    {config.unit && <span className="text-foreground/60 font-mono text-xs">{config.unit}</span>}
                </div>
            </div>

            {/* shadcn Slider */}
            <Slider
                value={[value]}
                min={config.min}
                max={config.max}
                step={config.step}
                onValueChange={([v]) => onChange(v)}
                onFocus={onFocus}
                className="w-full"
            />

            {/* 范围标注 */}
            <div className="text-foreground/50 flex justify-between text-xs">
                <span>{config.min}</span>
                <span>
                    {config.max}
                    {config.unit}
                </span>
            </div>
        </div>
    );
}

// ==================== 说明面板组件 ====================

function ExplanationPanel({ activeIndex }: { activeIndex: number }) {
    return (
        <div className="border-foreground/8 bg-background/25 flex min-h-0 flex-1 flex-col rounded-xl border p-4">
            <div className="border-foreground/8 mb-3 border-b pb-2">
                <span className="text-foreground/50 font-mono text-[11px] tracking-widest">EXPLANATION</span>
                <h3 className="font-heading text-foreground text-base font-bold">参数说明</h3>
            </div>

            <div className="flex flex-1 flex-col gap-2">
                {SLIDER_CONFIGS.map((config, index) => {
                    const IconComp = config.icon;
                    const isActive = activeIndex === index;
                    const lines = config.description.split("\n");

                    return (
                        <div
                            key={config.key}
                            className={cn(
                                "flex flex-1 flex-col justify-center rounded-md border p-2 px-4 transition-colors",
                                "border-white/5 bg-black/15",
                                isActive && "bg-primary/10 border-primary/35"
                            )}>
                            <div className="mb-0.5 flex items-center gap-2">
                                <IconComp size={16} className="text-primary" />
                                <span className="text-foreground/95 text-md font-medium">{config.label}</span>
                            </div>
                            {lines.map((line, i) => (
                                <p key={i} className="text-foreground/65 m-0 text-sm leading-relaxed">
                                    {line}
                                </p>
                            ))}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ==================== 结果面板组件 ====================

function ResultPanel({ finalDamage, className }: { finalDamage: number; className?: string }) {
    return (
        <div
            className={cn(
                "flex flex-col items-center gap-1 rounded-xl border p-4",
                "bg-primary/10 border-primary/35",
                "shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_4px_16px_rgba(0,0,0,0.2)]",
                className
            )}>
            <span className="text-foreground/80 text-xs font-medium tracking-wider uppercase">最终伤害</span>
            <span
                className="text-primary font-mono text-3xl font-bold"
                style={{ textShadow: "0 2px 12px rgba(212, 137, 58, 0.25)" }}>
                {finalDamage.toFixed(2)}
            </span>
            <div className="text-foreground/50 mt-1 flex items-center justify-center gap-1 text-center text-xs">
                <Info size={12} className="text-foreground/40 shrink-0" />
                <span>以上结果仅供参考，实际数值可能因游戏版本或模组有所差异。</span>
            </div>
        </div>
    );
}

// ==================== 参考链接组件 ====================

function ReferenceLink() {
    return (
        <a
            className={cn(
                "flex min-h-18 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-colors",
                "border-primary/30 text-foreground/90 bg-black/20",
                "hover:bg-primary/12 hover:border-primary/60 hover:text-white"
            )}
            href="https://zh.minecraft.wiki/w/%E7%9B%94%E7%94%B2%E6%9C%BA%E5%88%B6#%E4%BC%A4%E5%AE%B3%E5%87%8F%E5%85%8D"
            target="_blank"
            rel="noopener noreferrer">
            <BookOpen size={18} className="text-primary shrink-0" />
            <span className="whitespace-nowrap">查看 Minecraft Wiki：盔甲机制 · 伤害减免</span>
            <ChevronRight size={18} className="text-primary/70 shrink-0" />
        </a>
    );
}

