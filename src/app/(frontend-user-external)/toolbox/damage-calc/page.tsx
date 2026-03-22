/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { SetStateAction, useMemo, useState } from "react";
import { Radix } from "@/components";
import Link from "next/link";
import { ExternalLinkIcon } from "lucide-react";

function armorDamageReduction(d: number, v: number, t: number, p: number = 0): number {
    if (d <= 0) return 0;

    if (p !== 0) {
        throw new Error("当前仅支持 p=0");
    }

    if (v <= 20) {
        const threshold = 1.6 * v + 0.2 * v * t;

        if (d <= threshold) {
            return (1 / (6.25 * t + 50)) * d * d + (1 - v / 25) * d;
        } else {
            return (1 - v / 125) * d;
        }
    } else {
        const inner = Math.max(0.2 * v, v - d / (2 + 0.5 * t));
        const armorTerm = Math.min(20, inner);
        const reduction = armorTerm / 25;
        const multiplier = Math.min(1, 1 - reduction);
        return d * multiplier;
    }
}

export default function ArmorDamageCalculator() {
    const [damage, setDamage] = useState<number | null>(10);
    const [armor, setArmor] = useState<number | null>(20);
    const [toughness, setToughness] = useState<number | null>(0);
    const [reduce, setReduce] = useState<number | null>(0);
    const [penetration] = useState<number | null>(0);
    const [enchantment, setEnchantment] = useState<number | null>(100);

    const { result, error } = useMemo(() => {
        function wrapper(input: number | null | undefined) {
            return input ?? 0;
        }

        try {
            const baseDamage = Math.max(0, wrapper(damage) - wrapper(reduce));

            const r = armorDamageReduction(baseDamage, wrapper(armor), wrapper(toughness), wrapper(penetration));

            return {
                result: r * (wrapper(enchantment) / 100),
                error: null,
            };
        } catch (e: any) {
            return {
                result: 0,
                error: e.message,
            };
        }
    }, [damage, armor, toughness, reduce, penetration, enchantment]);

    return (
        <main className="pixel-font flex h-[calc(100vh-61px)] w-full translate-y-15.25 flex-col items-center justify-center">
            <h1 className="mb-6 text-center text-4xl font-bold">护甲减伤计算器</h1>
            <Radix.Card className="w-md">
                <Radix.CardContent className="space-y-4">
                    {/* 原始伤害 */}
                    <div className="space-y-2">
                        <Radix.Label>原始伤害 (d)</Radix.Label>
                        <div className="flex items-center gap-4">
                            <Radix.Slider
                                className="flex-1"
                                min={0}
                                step={0.25}
                                value={[damage ?? 0]}
                                onValueChange={(val: SetStateAction<number | null>[]) => setDamage(val[0])}
                            />
                            <Radix.Input
                                min={0}
                                step={0.25}
                                type="number"
                                className="w-20"
                                value={damage ?? ""}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (val === "") {
                                        setDamage(null);
                                    } else {
                                        setDamage(Number(val));
                                    }
                                }}
                                onBlur={() => {
                                    // 失焦时修正为最小值
                                    if (damage === null || isNaN(damage)) {
                                        setDamage(0);
                                    }
                                }}
                            />
                        </div>
                    </div>

                    {/* 防御减伤 */}
                    <div className="space-y-2">
                        <Radix.Label>防御减伤 (r)</Radix.Label>
                        <div className="flex items-center gap-4">
                            <Radix.Slider
                                className="flex-1"
                                min={0}
                                step={0.5}
                                value={[reduce ?? 0]}
                                onValueChange={(val: SetStateAction<number | null>[]) => setReduce(val[0])}
                            />
                            <Radix.Input
                                min={0}
                                step={0.5}
                                type="number"
                                className="w-20"
                                value={reduce ?? ""}
                                onChange={(e: { target: { value: string } }) => {
                                    const val = e.target.value;
                                    if (val === "") {
                                        setReduce(null);
                                    } else {
                                        setReduce(Number(val));
                                    }
                                }}
                                onBlur={() => {
                                    // 失焦时修正为最小值
                                    if (reduce === null || isNaN(reduce)) {
                                        setReduce(0);
                                    }
                                }}
                            />
                        </div>
                    </div>

                    {/* 护甲值 */}
                    <div className="space-y-2">
                        <Radix.Label>护甲数值 (v)</Radix.Label>
                        <div className="flex items-center gap-4">
                            <Radix.Slider
                                className="flex-1"
                                min={0}
                                step={0.5}
                                value={[armor ?? 0]}
                                onValueChange={(val: SetStateAction<number | null>[]) => setArmor(val[0])}
                            />
                            <Radix.Input
                                min={0}
                                type="number"
                                className="w-20"
                                value={armor ?? ""}
                                onChange={(e: { target: { value: string } }) => {
                                    const val = e.target.value;
                                    if (val === "") {
                                        setArmor(null);
                                    } else {
                                        setArmor(Number(e.target.value));
                                    }
                                }}
                                onBlur={() => {
                                    // 失焦时修正为最小值
                                    if (armor === null || isNaN(armor)) {
                                        setArmor(0);
                                    }
                                }}
                            />
                        </div>
                    </div>

                    {/* 韧性 */}
                    <div className="space-y-2">
                        <Radix.Label>盔甲韧性 (t)</Radix.Label>
                        <div className="flex items-center gap-4">
                            <Radix.Slider
                                className="flex-1"
                                min={0}
                                step={0.5}
                                value={[toughness ?? 0]}
                                onValueChange={(val: SetStateAction<number | null>[]) => setToughness(val[0])}
                            />
                            <Radix.Input
                                min={0}
                                type="number"
                                className="w-20"
                                value={toughness ?? ""}
                                onChange={(e: { target: { value: string } }) => {
                                    const val = e.target.value;
                                    if (val === "") {
                                        setToughness(null);
                                    } else {
                                        setToughness(Number(e.target.value));
                                    }
                                }}
                                onBlur={() => {
                                    // 失焦时修正为最小值
                                    if (toughness === null || isNaN(toughness)) {
                                        setToughness(0);
                                    }
                                }}
                            />
                        </div>
                    </div>

                    {/* 破甲 */}
                    {/* <div className="space-y-2">
                        <Radix.Label>破甲等级 (p)</Radix.Label>
                        <div className="flex items-center gap-4">
                            <Radix.Slider
                                className="flex-1"
                                min={0}
                                max={2}
                                step={0.5}
                                value={[penetration ?? 0]}
                                disabled={true}
                                onValueChange={(val: SetStateAction<number | null>[]) => setPenetration(val[0])}
                            />
                            <Radix.Input
                                min={0}
                                max={2}
                                type="number"
                                className="w-20"
                                value={penetration ?? ""}
                                disabled={true}
                                onChange={(e: { target: { value: string } }) => {
                                    const val = e.target.value;
                                    if (val === "") {
                                        setPenetration(null);
                                    } else {
                                        setPenetration(Number(e.target.value));
                                    }
                                }}
                                onBlur={() => {
                                    // 失焦时修正为最小值
                                    if (penetration === null || isNaN(penetration)) {
                                        setPenetration(0);
                                    }
                                }}
                            />
                        </div>
                    </div> */}

                    {/* 附魔 */}
                    <div className="space-y-2">
                        <Radix.Label>附魔系数 (k%)</Radix.Label>
                        <div className="flex items-center gap-4">
                            <Radix.Slider
                                className="flex-1"
                                min={0}
                                max={100}
                                step={1}
                                value={[enchantment ?? 0]}
                                onValueChange={(val: SetStateAction<number | null>[]) => setEnchantment(val[0])}
                            />
                            <Radix.Input
                                min={0}
                                max={100}
                                step={1}
                                type="number"
                                className="w-20"
                                value={enchantment ?? ""}
                                onChange={(e: { target: { value: string } }) => {
                                    const val = e.target.value;
                                    if (val === "") {
                                        setEnchantment(null);
                                    } else {
                                        setEnchantment(Number(e.target.value));
                                    }
                                }}
                            />
                        </div>
                    </div>

                    <Radix.Separator />

                    {/* 结果 */}
                    <div className="flex items-center justify-between">
                        <div className="">
                            {error ? (
                                <div className="text-sm text-red-500">{error}</div>
                            ) : (
                                <div className="text-lg font-semibold">实际伤害: {result.toFixed(3)}</div>
                            )}
                        </div>

                        <Radix.Button variant="link">
                            <Link
                                href="https://zh.minecraft.wiki/w/%E7%9B%94%E7%94%B2%E6%9C%BA%E5%88%B6#%E4%BC%A4%E5%AE%B3%E5%87%8F%E5%85%8D"
                                target="_blank">
                                计算公式参考
                            </Link>
                            <ExternalLinkIcon className="-ml-1 size-3" />
                        </Radix.Button>
                    </div>
                </Radix.CardContent>
            </Radix.Card>
        </main>
    );
}
