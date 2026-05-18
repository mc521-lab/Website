import { EquipmentData, SetData, ResolvedEquipment, EquipmentJobEntry, SetIndexEntry, JobIndex, ColorConfig } from "./types";

// 缓存颜色配置
let colorConfigCache: ColorConfig | null = null;

export function formatStatValue(stat: { value: number; unit?: string }): string {
    const unit = stat.unit ?? "";
    if (typeof stat.value === "number") {
        if (stat.value > 0) return `+${stat.value}${unit}`;
        return `${stat.value}${unit}`;
    }
    return `${stat.value}${unit}`;
}

export function getSlotName(slot: string): string {
    const slotMap: Record<string, string> = {
        helmet: "头盔",
        chestplate: "胸甲",
        leggings: "护腿",
        boots: "靴子",
        weapon: "武器",
    };
    return slotMap[slot] ?? slot;
}

export function getSlotIcon(slot: string): string {
    const iconMap: Record<string, string> = {
        helmet: "🪖",
        chestplate: "🛡️",
        leggings: "👖",
        boots: "👢",
        weapon: "⚔️",
    };
    return iconMap[slot] ?? "⚙️";
}

export function getQualityColor(quality: string): string {
    const colorMap: Record<string, string> = {
        D: "#9CA3AF",
        C: "#34D399",
        B: "#60A5FA",
        A: "#A78BFA",
        S: "#FBBF24",
    };
    return colorMap[quality] ?? "#9CA3AF";
}

export function getQualityName(quality: string): string {
    const nameMap: Record<string, string> = {
        D: "D级",
        C: "C级",
        B: "B级",
        A: "A级",
        S: "S级",
    };
    return nameMap[quality] ?? quality;
}

export function isEquipmentData(data: unknown): data is EquipmentData {
    return (
        typeof data === "object" &&
        data !== null &&
        "stats" in data &&
        Array.isArray((data as Record<string, unknown>).stats) &&
        !("setEffects" in data)
    );
}

export function isSetData(data: unknown): data is SetData {
    return typeof data === "object" && data !== null && "setEffects" in data && !("stats" in data);
}

// 从预编译的静态 JSON 加载所有装备数据
export async function loadAllEquipmentData(): Promise<{
    colors: ColorConfig;
    jobs: EquipmentJobEntry[];
    equipments: ResolvedEquipment[];
    weapons: ResolvedEquipment[];
} | null> {
    try {
        const res = await fetch("/wiki/item/data/_compiled/equipment.json");
        if (!res.ok) return null;
        return await res.json();
    } catch {
        return null;
    }
}

// 加载颜色配置
export async function loadColorConfig(): Promise<ColorConfig | null> {
    if (colorConfigCache) return colorConfigCache;

    try {
        const res = await fetch("/wiki/item/data/colors.json");
        if (!res.ok) return null;
        const data = await res.json();
        colorConfigCache = data as ColorConfig;
        return colorConfigCache;
    } catch {
        return null;
    }
}

// 获取职业颜色
export function getJobColor(jobId: string, colorConfig?: ColorConfig | null): string {
    if (!colorConfig) return "#767676";
    return colorConfig.jobs[jobId]?.symbolColor ?? "#767676";
}

// 加载职业索引
export async function loadJobIndex(jobPrefix: string): Promise<JobIndex | null> {
    try {
        const res = await fetch(`/wiki/item/data/${jobPrefix}/index.json`);
        if (!res.ok) return null;
        return await res.json();
    } catch {
        return null;
    }
}

// 加载单个套装定义
export async function loadSetData(setPath: string): Promise<SetData | null> {
    try {
        const res = await fetch(`/wiki/item/data/${setPath}/set.json`);
        if (!res.ok) return null;
        const data = await res.json();
        if (isSetData(data)) {
            return data;
        }
        return null;
    } catch {
        return null;
    }
}

// 加载套装下的所有装备
export async function loadSetEquipments(
    setPath: string,
    setData: SetData,
    jobEntry?: EquipmentJobEntry,
    colorConfig?: ColorConfig | null
): Promise<ResolvedEquipment[]> {
    const slots = ["helmet", "chestplate", "leggings", "boots"];
    const equipments: ResolvedEquipment[] = [];
    const jobColor = getJobColor(jobEntry?.id ?? "", colorConfig);

    for (const slot of slots) {
        try {
            const res = await fetch(`/wiki/item/data/${setPath}/${slot}.json`);
            if (!res.ok) continue;
            const data = await res.json();

            if (!isEquipmentData(data)) continue;

            const slotName = getSlotName(data.slot);

            equipments.push({
                id: data.id,
                name: data.name,
                slot: data.slot,
                slotName,
                quality: data.quality,
                applicableClass: data.applicableClass,
                setId: data.setId,
                setName: setData.name,
                image: data.image,
                stats: data.stats,
                enchantSlots: data.enchantSlots,
                gemSlots: data.gemSlots,
                gemSlotDetails: data.gemSlotDetails,
                materials: data.materials,
                jobId: jobEntry?.id,
                jobName: jobEntry?.name,
                jobColor,
                setEffects: setData.setEffects,
            });
        } catch {
            // ignore
        }
    }

    return equipments;
}

// 加载套装下的武器
export async function loadSetWeapon(
    setPath: string,
    setData: SetData,
    jobEntry?: EquipmentJobEntry,
    colorConfig?: ColorConfig | null
): Promise<ResolvedEquipment | null> {
    try {
        const res = await fetch(`/wiki/item/data/${setPath}/weapon.json`);
        if (!res.ok) return null;
        const data = await res.json();

        if (!isEquipmentData(data)) return null;

        const slotName = getSlotName(data.slot);
        const jobColor = getJobColor(jobEntry?.id ?? "", colorConfig);

        return {
            id: data.id,
            name: data.name,
            slot: data.slot,
            slotName,
            quality: data.quality,
            applicableClass: data.applicableClass,
            setId: data.setId,
            setName: setData.name,
            image: data.image,
            stats: data.stats,
            enchantSlots: data.enchantSlots,
            gemSlots: data.gemSlots,
            gemSlotDetails: data.gemSlotDetails,
            materials: data.materials,
            jobId: jobEntry?.id,
            jobName: jobEntry?.name,
            jobColor,
            setEffects: setData.setEffects,
        };
    } catch {
        return null;
    }
}

// 兼容旧结构的加载函数（从 manifest 加载）
export async function loadSets(entries: string[]): Promise<Map<string, SetData>> {
    const setMap = new Map<string, SetData>();
    const setEntries = entries.filter((e) => e.endsWith("/set.json"));

    await Promise.all(
        setEntries.map(async (entryPath) => {
            try {
                const res = await fetch(`/wiki/item/data/${entryPath}`);
                if (!res.ok) return;
                const data = await res.json();
                if (isSetData(data)) {
                    setMap.set(data.id, data);
                }
            } catch {
                // ignore
            }
        })
    );

    return setMap;
}

// 兼容旧结构的解析函数
export async function resolveEquipmentEntry(
    entryPath: string,
    jobEntry?: EquipmentJobEntry,
    setMap?: Map<string, SetData>
): Promise<ResolvedEquipment | null> {
    try {
        const res = await fetch(`/wiki/item/data/${entryPath}`);
        if (!res.ok) return null;
        const data = await res.json();

        if (!isEquipmentData(data)) return null;

        const slotName = getSlotName(data.slot);
        const setData = data.setId ? setMap?.get(data.setId) : undefined;

        return {
            id: data.id,
            name: data.name,
            slot: data.slot,
            slotName,
            quality: data.quality,
            applicableClass: data.applicableClass,
            setId: data.setId,
            setName: setData?.name,
            image: data.image,
            stats: data.stats,
            enchantSlots: data.enchantSlots,
            gemSlots: data.gemSlots,
            gemSlotDetails: data.gemSlotDetails,
            materials: data.materials,
            jobId: jobEntry?.id,
            jobName: jobEntry?.name,
            jobColor: undefined, // 旧结构不再支持颜色
            setEffects: setData?.setEffects,
        };
    } catch {
        return null;
    }
}
