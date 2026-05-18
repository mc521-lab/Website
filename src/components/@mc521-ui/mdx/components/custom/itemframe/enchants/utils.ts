import { EnchantData, EnchantsManifest, EnchantValue, ResolvedEnchant } from "./types";

export async function loadEnchantsManifest(): Promise<EnchantsManifest | null> {
    try {
        const res = await fetch("/wiki/item/data/enchants/manifest.json");
        if (!res.ok) return null;
        return await res.json();
    } catch {
        return null;
    }
}

export async function loadEnchant(id: string): Promise<EnchantData | null> {
    try {
        const res = await fetch(`/wiki/item/data/enchants/${id}.json`);
        if (!res.ok) return null;
        return await res.json();
    } catch {
        return null;
    }
}

export async function loadAllEnchants(manifest: EnchantsManifest): Promise<ResolvedEnchant[]> {
    const enchants: ResolvedEnchant[] = [];
    for (const id of manifest.enchants) {
        const enchant = await loadEnchant(id);
        if (enchant) {
            // 解析 type 和 rarity
            const typeInfo = manifest.types[enchant.type];
            const rarityInfo = manifest.rarities[enchant.rarity];
            enchants.push({
                ...enchant,
                typeName: typeInfo?.name,
                typeColor: typeInfo?.color,
                rarityName: rarityInfo?.name,
                rarityColor: rarityInfo?.color,
            });
        }
    }
    return enchants;
}

// 安全计算数学表达式
function safeEval(expr: string): number {
    // 只允许数字、运算符、括号和数学函数
    const sanitized = expr.replace(/[^0-9+\-*/().\s]/g, "");
    if (!sanitized) return 0;
    try {
        return new Function("return " + sanitized)();
    } catch {
        return 0;
    }
}

// 计算数值公式，将 %level% 替换为实际等级
export function calculateValue(formula: string, level: number): number {
    // 替换 %level% 为实际值
    let expr = formula.replace(/%level%/g, level.toString());

    // 处理 min 函数: min(a, b)
    expr = expr.replace(/min\(([^,]+),\s*([^)]+)\)/g, (_, a, b) => {
        return Math.min(safeEval(a), safeEval(b)).toString();
    });

    // 处理 ceil 函数 - 使用循环处理嵌套
    while (expr.includes("ceil(")) {
        const match = expr.match(/ceil\(([^()]+)\)/);
        if (!match) break;
        const inner = match[1];
        const result = Math.ceil(safeEval(inner));
        expr = expr.replace(match[0], result.toString());
    }

    // 处理 floor 函数 - 使用循环处理嵌套
    while (expr.includes("floor(")) {
        const match = expr.match(/floor\(([^()]+)\)/);
        if (!match) break;
        const inner = match[1];
        const result = Math.floor(safeEval(inner));
        expr = expr.replace(match[0], result.toString());
    }

    // 处理 round 函数
    while (expr.includes("round(")) {
        const match = expr.match(/round\(([^()]+)\)/);
        if (!match) break;
        const inner = match[1];
        const result = Math.round(safeEval(inner));
        expr = expr.replace(match[0], result.toString());
    }

    try {
        return safeEval(expr);
    } catch {
        return 0;
    }
}

// 获取指定等级的所有数值
export function getValuesAtLevel(values: EnchantValue[], level: number): { id: string; name: string; value: number; unit?: string }[] {
    return values.map((v) => ({
        id: v.id,
        name: v.name,
        value: calculateValue(v.formula, level),
        unit: v.unit,
    }));
}

export function getTargetIcon(target: string): string {
    const icons: Record<string, string> = {
        pickaxe: "⛏️",
        axe: "🪓",
        shovel: "🔧",
        hoe: "🌾",
        sword: "⚔️",
        bow: "🏹",
        crossbow: "🔫",
        trident: "🔱",
        helmet: "⛑️",
        chestplate: "👕",
        leggings: "👖",
        boots: "👢",
        elytra: "🪽",
        armor: "🛡️",
        mace: "🔨",
        fishing_rod: "🎣",
        all: "📦",
    };
    return icons[target] || "📦";
}

export function getTargetName(target: string): string {
    const names: Record<string, string> = {
        pickaxe: "镐子",
        axe: "斧子",
        shovel: "铲子",
        hoe: "锄头",
        sword: "剑",
        bow: "弓",
        crossbow: "弩",
        trident: "三叉戟",
        helmet: "头盔",
        chestplate: "胸甲",
        leggings: "护腿",
        boots: "靴子",
        elytra: "鞘翅",
        armor: "护甲",
        mace: "重锤",
        fishing_rod: "钓鱼竿",
        all: "所有物品",
    };
    return names[target] || target;
}
