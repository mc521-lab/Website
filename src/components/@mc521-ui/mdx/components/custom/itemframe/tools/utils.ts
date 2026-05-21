import { ToolsIndex, ToolCategory, ResolvedTool } from "./types";

export async function loadToolsIndex(): Promise<ToolsIndex | null> {
    try {
        const res = await fetch("/wiki/item/data/_compiled/tools.json");
        if (!res.ok) return null;
        return await res.json();
    } catch {
        return null;
    }
}

export function resolveTools(index: ToolsIndex): ResolvedTool[] {
    const categoryMap = new Map<string, ToolCategory>();
    for (const cat of index.categories) {
        categoryMap.set(cat.id, cat);
    }

    return index.tools.map((tool) => {
        const category = categoryMap.get(tool.category);
        return {
            ...tool,
            categoryName: category?.name,
            categoryIcon: category?.icon,
        };
    });
}

export function getQualityColor(quality: string): string {
    switch (quality) {
        case "S":
            return "#f59e0b"; // amber-500
        case "A":
            return "#a855f7"; // purple-500
        case "B":
            return "#3b82f6"; // blue-500
        case "C":
            return "#22c55e"; // green-500
        case "D":
            return "#6b7280"; // gray-500
        default:
            return "#6b7280";
    }
}

export function getMaterialIcon(material: string): string {
    switch (material) {
        case "NETHERITE_PICKAXE":
            return "⛏️";
        case "NETHERITE_AXE":
            return "🪓";
        case "NETHERITE_SHOVEL":
            return "🔧";
        case "NETHERITE_HOE":
            return "🌾";
        default:
            return "🔨";
    }
}
