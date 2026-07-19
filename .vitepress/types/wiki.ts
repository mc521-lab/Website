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
    image?: string;
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

export interface WikiWeaponData {
    colors: WikiEquipmentColorConfig;
    jobs: WikiEquipmentJob[];
    weapons: WikiEquipment[];
}

export interface WikiArmorData {
    colors: WikiEquipmentColorConfig;
    jobs: WikiEquipmentJob[];
    armors: WikiEquipment[];
}

export interface WikiJewelryAttribute {
    id: string;
    name: string;
    min: number;
    max: number;
    icon: string;
    iconColor: string;
}

export interface WikiJewelry {
    id: string;
    name: string;
    slotType: string;
    jobId: string;
    jobName: string;
    jobColor: string;
    image?: string;
    randomMin: number;
    randomMax: number;
    attributes: WikiJewelryAttribute[];
}

export interface WikiJewelries {
    jobs: { id: string; name: string }[];
    jewelries: WikiJewelry[];
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
    rarityName: string;
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