export interface WikiManifestType {
    name: string;
    color: string;
}

export interface WikiManifestRarity {
    name: string;
    color: string;
    order: number;
}

export interface WikiEnchantEffect {
    id: string;
    description: string;
    [key: string]: unknown;
}

export interface WikiEnchantValue {
    id: string;
    name: string;
    formula: string;
    unit: string;
    description: string;
}

export interface WikiEnchantCondition {
    id: string;
    description: string;
}

export interface WikiEnchant {
    id: string;
    displayName: string;
    description: string;
    type: "vanilla" | "extension";
    rarity: string;
    targets: string[];
    conflicts: string[];
    maxLevel: number;
    tradeable: boolean;
    discoverable: boolean;
    enchantable: boolean;
    effects: WikiEnchantEffect[];
    values: WikiEnchantValue[];
    conditions: WikiEnchantCondition[];
    typeName: string;
    typeColor: string;
    rarityName: string;
    rarityColor: string;
}

export interface WikiEnchants {
    manifest: {
        version: string;
        types: Record<string, WikiManifestType>;
        rarities: Record<string, WikiManifestRarity>;
        enchants: string[];
    };
    enchants: WikiEnchant[];
}

export interface WikiGemFeature {
    id: string;
    name: string;
}

export interface WikiGemQualityFeature {
    id: string;
    value: number | number[] | null;
}

export interface WikiGemQuality {
    id: string;
    name: string;
    description: string;
    features: WikiGemQualityFeature[];
}

export interface WikiGem {
    id: string;
    name: string;
    symbolColor: string;
    description: string;
    image: string | null;
    features: WikiGemFeature[];
    qualitys: WikiGemQuality[];
}

export interface WikiGems {
    gems: WikiGem[];
}

export interface WikiJewelryFeatureValue {
    id: string;
    name: string;
    value: number[];
}

export interface WikiJewelryFeature {
    id: string;
    name: string;
    values: WikiJewelryFeatureValue[];
}

export interface WikiJewelry {
    id: string;
    name: string;
    type: string;
    applicableClass: string;
    features: WikiJewelryFeature[];
    jobId: string;
    jobName: string;
    jobColor: string;
    slotType: string;
    isTreasure: boolean;
}

export interface WikiJewelryJobEntry {
    id: string;
    name: string;
    entryPrefix: string;
    symbolColor: string;
}

export interface WikiJewelries {
    manifest: {
        id: string;
        type: string;
        name: string;
        entries: string[];
        metadata: {
            jobEntries: WikiJewelryJobEntry[];
        };
    };
    jewelries: WikiJewelry[];
}

export interface WikiMaterial {
    id: string;
    name: string;
    quality: string;
    type: string;
    description: string;
    effect: string;
    source: string;
    image?: string;
}

export interface WikiMaterials {
    materials: WikiMaterial[];
}

export interface WikiToolEnchant {
    name: string;
    level: number;
}

export interface WikiTool {
    id: string;
    name: string;
    category: string;
    material: string;
    quality: string;
    type: string;
    description: string;
    unbreakable?: boolean;
    trial?: boolean;
    maxDurability?: number;
    timeLimit?: string;
    enchants: WikiToolEnchant[];
    categoryName: string;
    categoryIcon: string;
}

export interface WikiToolCategory {
    id: string;
    name: string;
    icon: string;
}

export interface WikiTools {
    version: string;
    type: string;
    categories: WikiToolCategory[];
    tools: WikiTool[];
}

export interface WikiEquipmentStat {
    id: string;
    name: string;
    value: number;
    unit?: string;
}

export interface WikiEquipmentSetEffect {
    id: string;
    name: string;
    value: number;
    unit?: string;
}

export interface WikiEquipment {
    id: string;
    name: string;
    slot: string;
    slotName: string;
    quality: string;
    applicableClass: string;
    setId?: string;
    setName: string;
    stats: WikiEquipmentStat[];
    enchantSlots: number;
    gemSlots: number;
    materials: unknown[];
    jobId: string;
    jobName: string;
    jobColor: string;
    setEffects: Record<string, WikiEquipmentSetEffect[]>;
}

export interface WikiEquipmentJob {
    id: string;
    name: string;
    entryPrefix: string;
}

export interface WikiEquipmentColorConfig {
    version: string;
    type: string;
    jobs: Record<string, { id: string; name: string; symbolColor: string }>;
}

export interface WikiEquipments {
    colors: WikiEquipmentColorConfig;
    jobs: WikiEquipmentJob[];
    equipments: WikiEquipment[];
    weapons: WikiEquipment[];
}
