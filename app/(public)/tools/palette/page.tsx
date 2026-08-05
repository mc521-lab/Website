"use client";

import { useMemo, useState } from "react";
import { Check, Copy, Layers3, Palette, Plus, Sparkles, RotateCw, Trash2, Box } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

type FormatMode = "minimessage" | "cmi" | "vanilla";
type ColorMode = "single" | "cycle" | "gradient";

type Preset = {
    name: string;
    colors: string[];
};

const PRESET_SINGLE: Preset[] = [
    { name: "蓝紫", colors: ["#8B5CF6"] },
    { name: "青绿", colors: ["#14B8A6"] },
    { name: "暖橙", colors: ["#F97316"] },
    { name: "玫红", colors: ["#EC4899"] },
    { name: "天空蓝", colors: ["#0EA5E9"] },
    { name: "翠绿", colors: ["#10B981"] },
    { name: "琥珀", colors: ["#F59E0B"] },
    { name: "靛蓝", colors: ["#6366F1"] },
    { name: "珊瑚", colors: ["#F43F5E"] },
    { name: "青瓷", colors: ["#06B6D4"] },
    { name: "薰衣", colors: ["#A78BFA"] },
    { name: "薄荷", colors: ["#34D399"] },
];

const PRESET_MULTI: Preset[] = [
    { name: "霓虹", colors: ["#22D3EE", "#A855F7", "#F43F5E"] },
    { name: "海岸", colors: ["#38BDF8", "#2DD4BF", "#F8FAFC"] },
    { name: "夕光", colors: ["#F59E0B", "#FB7185", "#8B5CF6"] },
    { name: "森林", colors: ["#22C55E", "#84CC16", "#EAB308"] },
    { name: "极光", colors: ["#06B6D4", "#8B5CF6", "#EC4899"] },
    { name: "日落", colors: ["#FBBF24", "#F97316", "#F43F5E"] },
    { name: "深海", colors: ["#0EA5E9", "#6366F1", "#294fb6"] },
    { name: "樱花", colors: ["#F9A8D4", "#EC4899", "#F472B6"] },
    { name: "翡翠", colors: ["#10B981", "#34D399", "#6EE7B7"] },
    { name: "暮色", colors: ["#7C3AED", "#A78BFA", "#C4B5FD"] },
    { name: "秋叶", colors: ["#EA580C", "#F59E0B", "#D97706"] },
    { name: "星河", colors: ["#3B82F6", "#8B5CF6", "#EC4899"] },
];

function normalizeInput(value: string) {
    return value.replace(/\r\n/g, "\n").trimEnd();
}

function stripColorTags(input: string) {
    return input
        .replace(/<gradient:[^>]+>/g, "")
        .replace(/<#[0-9a-fA-F]{6,8}>/g, "")
        .replace(/\{#[0-9a-fA-F]{6,8}\}/g, "")
        .replace(/<\/gradient>/g, "")
        .replace(/\{\/gradient\}/g, "")
        .replace(/<\/#[0-9a-fA-F]{6,8}>/g, "")
        .replace(/\{\/[#][0-9a-fA-F]{6,8}\}/g, "");
}

function extractText(input: string) {
    const cleaned = normalizeInput(input);
    const plain = stripColorTags(cleaned);
    return plain || cleaned;
}

function hexToRgb(hex: string) {
    const normalized = hex.replace("#", "");
    const size = normalized.length === 3 ? 1 : 2;
    const expand = (value: string) => (size === 1 ? value + value : value);
    const parts = normalized.match(size === 1 ? /.{1}/g : /.{2}/g) ?? [];
    const [r, g, b] = parts.map((part) => Number.parseInt(expand(part), 16));
    return { r: Number.isFinite(r) ? r : 255, g: Number.isFinite(g) ? g : 255, b: Number.isFinite(b) ? b : 255 };
}

function rgbToHex(rgb: { r: number; g: number; b: number }) {
    const toHex = (value: number) =>
        Math.max(0, Math.min(255, Math.round(value)))
            .toString(16)
            .padStart(2, "0");
    return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`.toUpperCase();
}

function mixColor(a: string, b: string, t: number) {
    const start = hexToRgb(a);
    const end = hexToRgb(b);
    return rgbToHex({
        r: start.r + (end.r - start.r) * t,
        g: start.g + (end.g - start.g) * t,
        b: start.b + (end.b - start.b) * t,
    });
}

function buildGradientPalette(colors: string[], length: number) {
    if (length <= 0) {
        return [];
    }

    if (colors.length <= 1) {
        return Array.from({ length }, () => colors[0] ?? "#FFFFFF");
    }

    if (length === 1) {
        return [colors[0]];
    }

    const segments = colors.length - 1;
    return Array.from({ length }, (_, index) => {
        const ratio = index / (length - 1);
        const segment = Math.min(segments - 1, Math.floor(ratio * segments));
        const segmentStart = segment / segments;
        const segmentEnd = (segment + 1) / segments;
        const localT = (ratio - segmentStart) / (segmentEnd - segmentStart || 1);
        return mixColor(colors[segment], colors[segment + 1], localT);
    });
}

function normalizeColorInput(value: string) {
    const trimmed = value.trim();
    if (!trimmed) {
        return "#000000";
    }

    return trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
}

function ensureTextTokens(text: string) {
    return text.split(/(\s+)/).filter(Boolean);
}

function isWhitespaceToken(token: string) {
    return /^\s+$/.test(token);
}

function toMinimessage(text: string, colors: string[], mode: ColorMode) {
    const tokens = ensureTextTokens(extractText(text));
    if (!tokens.length) {
        return "";
    }

    switch (mode) {
        case "single":
            return `<${colors[0] ?? "#FFFFFF"}>${tokens.join("")}`;

        case "cycle":
            let colorIndex = 0;
            return text
                .split("")
                .map((token) => {
                    if (isWhitespaceToken(token)) {
                        return token;
                    }
                    const color = colors[colorIndex % colors.length] ?? "#FFFFFF";
                    colorIndex += 1;
                    return `<${color}>${token}`;
                })
                .join("");

        case "gradient":
            return `<gradient:${colors.join(":")}>${tokens.join("")}`;
    }
}

function toCmi(text: string, colors: string[], mode: ColorMode) {
    const tokens = ensureTextTokens(extractText(text));
    if (!tokens.length) {
        return "";
    }

    switch (mode) {
        case "single":
            return `{${colors[0] ?? "#FFFFFF"}}${tokens.join("")}`;

        case "cycle":
            let colorIndex = 0;
            return text
                .split("")
                .map((token) => {
                    if (isWhitespaceToken(token)) {
                        return token;
                    }
                    const color = colors[colorIndex % colors.length] ?? "#FFFFFF";
                    colorIndex += 1;
                    return `{${color}}${token}`;
                })
                .join("");

        case "gradient":
            const compact = tokens.filter((token) => !isWhitespaceToken(token)).join("");
            const gradient = buildGradientPalette(colors, compact.length || 1);
            let index = 0;
            return tokens
                .map((token) => {
                    if (isWhitespaceToken(token)) {
                        return token;
                    }
                    return token
                        .split("")
                        .map((char) => `{${gradient[index++] ?? colors[0] ?? "#FFFFFF"}}${char}`)
                        .join("");
                })
                .join("");
    }
}

function toVanilla(text: string, colors: string[], mode: ColorMode) {
    const tokens = ensureTextTokens(extractText(text));
    if (!tokens.length) {
        return "";
    }

    switch (mode) {
        case "single":
            return `&${colors[0] ?? "#FFFFFF"}${tokens.join("")}`;

        case "cycle":
            let colorIndex = 0;
            return text
                .split("")
                .map((token) => {
                    if (isWhitespaceToken(token)) {
                        return token;
                    }
                    const color = colors[colorIndex % colors.length] ?? "#FFFFFF";
                    colorIndex += 1;
                    return `&${color}${token}`;
                })
                .join("");

        case "gradient":
            const compact = tokens.filter((token) => !isWhitespaceToken(token)).join("");
            const gradient = buildGradientPalette(colors, compact.length || 1);
            let index = 0;
            return tokens
                .map((token) => {
                    if (isWhitespaceToken(token)) {
                        return token;
                    }
                    return token
                        .split("")
                        .map((char) => `&${gradient[index++] ?? colors[0] ?? "#FFFFFF"}${char}`)
                        .join("");
                })
                .join("");
    }
}

export default function PalettePage() {
    const [text, setText] = useState("欢迎使用彩色文本生成器");
    const [format, setFormat] = useState<FormatMode>("minimessage");
    const [colorMode, setColorMode] = useState<ColorMode>("single");
    const [singleColor, setSingleColor] = useState("#8B5CF6");
    const [cycleColors, setCycleColors] = useState<string[]>(["#22D3EE", "#A855F7", "#F43F5E"]);
    const [gradientColors, setGradientColors] = useState<string[]>(["#F97316", "#EC4899", "#8B5CF6"]);
    const [inputLooksColored] = useState(true);
    const [copied, setCopied] = useState(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const activeColors = colorMode === "single" ? [singleColor] : colorMode === "cycle" ? cycleColors : gradientColors;

    const output = useMemo(() => {
        const source = inputLooksColored ? extractText(text) : text;
        switch (format) {
            case "minimessage":
                return toMinimessage(source, activeColors, colorMode);
            case "cmi":
                return toCmi(source, activeColors, colorMode);
            case "vanilla":
                return toVanilla(source, activeColors, colorMode);
        }
    }, [activeColors, colorMode, format, inputLooksColored, text]);

    const previewSegments = useMemo(() => {
        const source = extractText(text) || text;
        const chars = Array.from(source);
        if (colorMode === "single") {
            return chars.map((char) => ({ char, color: singleColor }));
        }
        if (colorMode === "cycle") {
            return chars.map((char, index) => ({ char, color: activeColors[index % activeColors.length] ?? singleColor }));
        }
        const palette = buildGradientPalette(activeColors, chars.filter((char) => !/\s/.test(char)).length || 1);
        let index = 0;
        return chars.map((char) => {
            if (/\s/.test(char)) {
                return { char, color: "#94A3B8" };
            }
            return { char, color: palette[index++] ?? activeColors[0] ?? singleColor };
        });
    }, [activeColors, colorMode, singleColor, text]);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(output);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1500);
    };

    const applyPreset = (preset: Preset) => {
        if (colorMode === "single") {
            setSingleColor(preset.colors[0]);
            return;
        }

        if (colorMode === "cycle") {
            setCycleColors(preset.colors);
            return;
        }

        setGradientColors(preset.colors);
    };

    const addColor = () => {
        const setColors = colorMode === "cycle" ? setCycleColors : setGradientColors;
        setColors([...activeColors, "#FFFFFF"]);
    };

    const currentPresets = colorMode === "single" ? PRESET_SINGLE : PRESET_MULTI;

    return (
        <div className="flex flex-1 flex-col gap-4 overflow-hidden">
            <header className="space-y-2">
                <div className="text-muted-foreground flex items-center gap-2 text-xs tracking-[0.24em] uppercase">
                    <Sparkles className="size-4" />
                    Color Text Generator
                </div>
                <h1 className="font-heading text-foreground text-2xl font-bold">彩色文本生成</h1>
                <p className="text-muted-foreground max-w-2xl text-sm">
                    输入普通文本或带颜色字段文本，按 MiniMessage / CMI 规则输出单色、循环色或渐变色结果。
                </p>
            </header>

            <main className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden">
                <section className="border-border/60 bg-background/60 flex min-h-0 flex-1 flex-col gap-4 overflow-hidden rounded-xl border p-4 shadow-sm">
                    <div className="flex flex-wrap items-center gap-3">
                        <ModeChip
                            icon={Palette}
                            label="MiniMessage (用于悬浮字)"
                            active={format === "minimessage"}
                            onClick={() => setFormat("minimessage")}
                        />
                        <ModeChip
                            icon={Layers3}
                            label="CMI (用于告示牌)"
                            active={format === "cmi"}
                            onClick={() => setFormat("cmi")}
                        />
                        <ModeChip
                            className="opacity-1"
                            icon={Box}
                            label="Vanilla (聊天栏)"
                            active={format === "vanilla"}
                            onClick={() => setFormat("vanilla")}
                        />
                        <div className="ms-auto flex items-center gap-2">
                            <Button size="sm" type="button" variant="outline" onClick={() => setText("欢迎使用彩色文本生成器")}>
                                <RotateCw className="size-4" />
                                重置文本
                            </Button>
                            <Button size="sm" type="button" onClick={handleCopy}>
                                {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                                {copied ? "已复制" : "复制结果"}
                            </Button>
                        </div>
                    </div>

                    <div className="border-border/60 bg-muted/15 flex flex-1 flex-col space-y-4 rounded-2xl border p-4 shadow-sm">
                        <div className="space-y-2">
                            <Label htmlFor="palette-input">输入文本</Label>
                            <Input
                                id="palette-input"
                                value={text}
                                onChange={(event) => setText(event.target.value)}
                                placeholder="输入普通文本，或带颜色标签的文本"
                                className="bg-background/70 h-11 rounded-xl px-3 text-sm shadow-inner shadow-black/10"
                            />
                            {/* <div className="text-muted-foreground flex items-center gap-2 text-xs">
                                <input
                                    checked={inputLooksColored}
                                    id="palette-colored"
                                    onChange={(event) => setInputLooksColored(event.target.checked)}
                                    type="checkbox"
                                    className="border-border size-4 rounded"
                                />
                                <Label htmlFor="palette-colored" className="text-muted-foreground text-xs font-normal">
                                    这段文本已经带有颜色字段，生成时自动提取纯文本
                                </Label>
                            </div> */}
                        </div>

                        <div className="grid min-h-0 flex-1 gap-4 xl:grid-cols-[1.1fr_0.9fr]">
                            <div className="border-border/60 bg-background/70 flex min-h-0 flex-col rounded-2xl border p-4 shadow-sm">
                                <div className="border-border/60 mb-3 flex items-center justify-between gap-3 border-b pb-3">
                                    <div>
                                        <div className="text-foreground text-sm font-medium">颜色工作区</div>
                                        <div className="text-muted-foreground text-xs">单色、循环色或渐变色都在这里编辑</div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Select value={colorMode} onValueChange={(value) => setColorMode(value as ColorMode)}>
                                            <SelectTrigger className="w-36">
                                                <SelectValue placeholder="颜色模式" />
                                            </SelectTrigger>
                                            <SelectContent position="popper">
                                                <SelectItem value="single">单色</SelectItem>
                                                <SelectItem value="cycle">多色循环</SelectItem>
                                                <SelectItem value="gradient">多色渐变</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className="h-8.75 gap-2"
                                            onClick={addColor}
                                            disabled={colorMode === "single" || activeColors.length === 15}>
                                            <Plus className="size-4" />
                                            添加颜色
                                        </Button>
                                    </div>
                                </div>

                                <div className="border-border/60 bg-background/70 flex min-h-0 flex-1 flex-col rounded-xl border p-4">
                                    <div className="mb-3 flex shrink-0 items-center justify-between gap-2">
                                        <Label>
                                            {colorMode === "single" ? "颜色" : colorMode === "cycle" ? "循环色组" : "渐变色组"}
                                        </Label>
                                        <span className="text-muted-foreground text-xs">
                                            {colorMode === "single" ? "1 色" : `${activeColors.length} 色`}
                                        </span>
                                    </div>

                                    <div className="min-h-0 flex-1 overflow-y-auto pr-1">
                                        {colorMode === "single" ? (
                                            <SingleColorEditor value={singleColor} onChange={setSingleColor} />
                                        ) : (
                                            <PaletteEditor
                                                colors={colorMode === "cycle" ? cycleColors : gradientColors}
                                                onChange={colorMode === "cycle" ? setCycleColors : setGradientColors}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="border-border/60 bg-background/70 flex min-h-0 flex-col rounded-2xl border p-4 shadow-sm">
                                <div className="border-border/60 mb-3 flex shrink-0 items-center justify-between gap-2 border-b pb-3">
                                    <div>
                                        <div className="text-foreground text-sm font-medium">预设方案</div>
                                        <div className="text-muted-foreground text-xs">一键套用预设方案，快速生成颜色</div>
                                    </div>
                                </div>
                                <div className="min-h-0 flex-1 overflow-y-auto pr-1">
                                    <div className="grid grid-cols-3 gap-2">
                                        {currentPresets.map((preset) => (
                                            <Button
                                                key={preset.name}
                                                type="button"
                                                variant="ghost"
                                                onClick={() => applyPreset(preset)}>
                                                <span
                                                    className="size-3 rounded-full ring-1 ring-white/20"
                                                    style={{
                                                        background: `linear-gradient(135deg, ${preset.colors.join(",")})`,
                                                    }}
                                                />
                                                <span className="text-foreground text-sm">{preset.name}</span>
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-border/60 bg-muted/20 flex min-h-0 flex-col gap-3 rounded-2xl border p-4 shadow-sm">
                        <div className="text-muted-foreground flex items-center justify-between gap-2 text-xs">
                            <span>实时预览</span>
                            <span>{output.length} 字符</span>
                        </div>
                        <div className="border-border/60 bg-background rounded-xl border p-4 text-lg leading-8 shadow-inner shadow-black/10">
                            {previewSegments.map((segment, index) => (
                                <span key={`${segment.char}-${index}`} style={{ color: segment.color }}>
                                    {segment.char}
                                </span>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

function ModeChip({
    icon: Icon,
    label,
    active,
    onClick,
    className,
}: {
    icon: typeof Box;
    label: string;
    active: boolean;
    onClick: () => void;
    className?: string;
}) {
    return (
        <Button
            type="button"
            variant={active ? "default" : "outline"}
            size="sm"
            onClick={onClick}
            className={cn("gap-2 rounded-full px-4", active && "shadow-sm", className)}>
            <Icon className="size-4" />
            {label}
        </Button>
    );
}

function PaletteEditor({ colors, onChange }: { colors: string[]; onChange: (colors: string[]) => void }) {
    const updateColor = (index: number, value: string) => {
        const next = [...colors];
        next[index] = normalizeColorInput(value);
        onChange(next);
    };

    const removeColor = (index: number) => {
        if (colors.length <= 2) {
            return;
        }

        onChange(colors.filter((_, currentIndex) => currentIndex !== index));
    };

    return (
        <div className="grid gap-3">
            <div className="grid grid-cols-3 gap-2 pt-1">
                {colors.map((color, index) => (
                    <div className="flex items-center gap-2" key={`${index}-${color}`}>
                        <input
                            aria-label={`颜色 ${index + 1}`}
                            className="border-border h-9 w-11 rounded-md border bg-transparent p-1"
                            type="color"
                            value={color}
                            onChange={(event) => updateColor(index, event.target.value)}
                        />
                        <Input
                            value={color}
                            onChange={(event) => updateColor(index, event.target.value)}
                            className="h-9 max-w-20 font-mono uppercase"
                        />
                        <Button
                            type="button"
                            variant="destructive"
                            size="icon-xs"
                            onClick={() => removeColor(index)}
                            disabled={colors.length <= 2}
                            aria-label={`删除颜色 ${index + 1}`}>
                            <Trash2 className="size-4" />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}

function SingleColorEditor({ value, onChange }: { value: string; onChange: (value: string) => void }) {
    return (
        <div className="grid gap-3">
            <div className="flex items-center gap-3 pt-1">
                <input
                    aria-label="单色颜色"
                    className="border-border h-12 w-16 rounded-md border bg-transparent p-1 shadow-sm"
                    type="color"
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                />
                <Input
                    value={value}
                    onChange={(event) => onChange(normalizeColorInput(event.target.value))}
                    className="h-12 font-mono tracking-wide uppercase"
                />
            </div>
        </div>
    );
}
