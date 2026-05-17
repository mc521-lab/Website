import {
    JewelryData,
    JewelryInheritData,
    ResolvedJewelry,
    JewelryJobEntry,
    ResolvedFeature,
    JewelryFeature,
    JewelryFeatureValue,
} from "./types";

export function formatValue(value: number | [number, number]): string {
    if (typeof value === "number") {
        return String(value);
    }
    if (Array.isArray(value)) {
        const [min, max] = value;
        return `${min} ~ ${max}`;
    }
    return String(value);
}

export function isInheritData(data: unknown): data is JewelryInheritData {
    return typeof data === "object" && data !== null && "inherit" in data;
}

export function isJewelryData(data: unknown): data is JewelryData {
    return (
        typeof data === "object" &&
        data !== null &&
        "features" in data &&
        Array.isArray((data as Record<string, unknown>).features) &&
        !("inherit" in data)
    );
}

export function resolveJewelryName(name: string, variables: Record<string, string>): string {
    let resolved = name;
    for (const [key, value] of Object.entries(variables)) {
        resolved = resolved.replace(new RegExp(`\\{${key}\\}`, "g"), value);
    }
    return resolved;
}

export function getSlotTypeFromPath(entryPath: string): string {
    const filename = entryPath.split("/").pop()?.replace(".json", "") ?? "";
    const slotMap: Record<string, string> = {
        bracelet: "手镯",
        gloves: "手套",
        necklace: "项链",
        ring_left: "戒指-左",
        ring_right: "戒指-右",
        treasure: "秘宝",
    };
    return slotMap[filename] ?? filename;
}

export function getSlotIcon(slotType: string): string {
    const iconMap: Record<string, string> = {
        bracelet: "🔮",
        gloves: "🧤",
        necklace: "📿",
        "戒指-左": "💍",
        "戒指-右": "💎",
        ring_left: "💍",
        ring_right: "💎",
        treasure: "🎁",
        秘宝: "🎁",
        手镯: "🔮",
        手套: "🧤",
        项链: "📿",
    };
    return iconMap[slotType] ?? "✨";
}

// 判断 feature 是否是嵌套结构（有 values 数组）
function isNestedFeature(f: JewelryFeature): boolean {
    return "values" in f && Array.isArray((f as Record<string, unknown>).values);
}

// 将 JewelryFeature 统一转换为 ResolvedFeature
function normalizeFeature(f: JewelryFeature): ResolvedFeature {
    if (isNestedFeature(f)) {
        const nested = f as { id: string; name: string; values: JewelryFeatureValue[] };
        return {
            id: nested.id,
            name: nested.name,
            values: nested.values ?? [],
        };
    }
    // flat feature: { id, name, value } -> 包装成 values 数组
    const flat = f as { id: string; name: string; value: number | [number, number] };
    return {
        id: flat.id,
        name: flat.name,
        values: [
            {
                id: flat.id,
                name: flat.name,
                value: flat.value,
            },
        ],
    };
}

// 将 JewelryData.features 全部统一为 ResolvedFeature[]
function normalizeFeatures(features: JewelryFeature[]): ResolvedFeature[] {
    return features.map(normalizeFeature);
}

export async function resolveJewelryEntry(entryPath: string, jobEntry?: JewelryJobEntry): Promise<ResolvedJewelry | null> {
    try {
        const res = await fetch(`/wiki/item/data/${entryPath}`);
        if (!res.ok) return null;
        const data = await res.json();

        const slotType = getSlotTypeFromPath(entryPath);
        const isTreasure = slotType === "秘宝";

        if (isJewelryData(data)) {
            return {
                id: data.id,
                name: data.name,
                type: data.type,
                applicableClass: data.applicableClass,
                features: normalizeFeatures(data.features),
                jobId: jobEntry?.id,
                jobName: jobEntry?.name,
                jobColor: jobEntry?.symbolColor,
                slotType,
                isTreasure,
            };
        }

        if (isInheritData(data)) {
            const inheritRes = await fetch(`/wiki/item/data/jewelries/_common/${data.inherit.replace("common_", "")}.json`);
            if (!inheritRes.ok) return null;
            const baseData = await inheritRes.json();

            if (!isJewelryData(baseData)) return null;

            const resolvedName = resolveJewelryName(baseData.name, data.variables);

            return {
                id: data.id,
                name: resolvedName,
                type: baseData.type,
                applicableClass: jobEntry?.name ?? baseData.applicableClass,
                features: normalizeFeatures(baseData.features),
                jobId: jobEntry?.id,
                jobName: jobEntry?.name,
                jobColor: jobEntry?.symbolColor,
                slotType,
                isTreasure,
            };
        }

        return null;
    } catch {
        return null;
    }
}
