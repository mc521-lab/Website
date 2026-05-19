import { MaterialData } from "./types";

const qualityColorMap: Record<string, string> = {
    C: "#9ca3af",
    B: "#60a5fa",
    A: "#c084fc",
    S: "#fbbf24",
    普通: "#9ca3af",
    精良: "#60a5fa",
    稀有: "#c084fc",
    史诗: "#fbbf24",
};

export function getQualityColor(quality: string): string {
    return qualityColorMap[quality] ?? "#9ca3af";
}

export function getMaterialCategory(m: MaterialData): string {
    if (m.id.startsWith("ZQ_")) return "坐骑碎片";
    if (m.id.startsWith("CW_") && !m.id.startsWith("CWFOOD")) return "宠物币";
    if (m.type === "宠食") return "宠食";
    if (m.type === "道具") return "道具";
    if (m.type === "货币") return "货币";
    return "材料";
}

export function groupMaterials(materials: MaterialData[]) {
    const groups = new Map<string, MaterialData[]>();
    for (const m of materials) {
        const cat = getMaterialCategory(m);
        if (!groups.has(cat)) {
            groups.set(cat, []);
        }
        groups.get(cat)!.push(m);
    }
    return groups;
}

const categoryOrder: Record<string, number> = {
    宠食: 1,
    道具: 2,
    材料: 3,
    货币: 4,
    坐骑碎片: 5,
    宠物币: 6,
};

export function sortCategories(categories: string[]): string[] {
    return categories.sort((a, b) => (categoryOrder[a] ?? 99) - (categoryOrder[b] ?? 99));
}

const qualityOrder: Record<string, number> = {
    C: 1,
    B: 2,
    A: 3,
    S: 4,
    普通: 5,
    精良: 6,
    稀有: 7,
    史诗: 8,
};

export function sortMaterials(materials: MaterialData[]): MaterialData[] {
    return [...materials].sort((a, b) => {
        const qa = qualityOrder[a.quality] ?? 99;
        const qb = qualityOrder[b.quality] ?? 99;
        if (qa !== qb) return qa - qb;
        return a.name.localeCompare(b.name, "zh-CN");
    });
}

const categoryColorMap: Record<string, string> = {
    宠食: "#f59e0b",
    道具: "#3b82f6",
    材料: "#10b981",
    货币: "#eab308",
    坐骑碎片: "#a855f7",
    宠物币: "#ec4899",
};

export function getCategoryColor(category: string): string {
    return categoryColorMap[category] ?? "#6b7280";
}
