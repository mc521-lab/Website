export interface EnchantValue {
    id: string;
    name: string;
    formula: string;
    unit?: string;
    description?: string;
}

export interface EnchantEffect {
    id: string;
    description: string;
    formula?: string;
    effect?: string;
    level?: number;
    duration?: string;
    applyToPlayer?: boolean;
    checkHardness?: boolean;
    disableOnSneak?: boolean;
    consumeSeeds?: boolean;
    onlyFullyGrown?: boolean;
    blocks?: string[];
}

export interface EnchantCondition {
    id: string;
    description: string;
}

export interface EnchantType {
    name: string;
    color: string;
}

export interface EnchantRarity {
    name: string;
    color: string;
    order: number;
}

export interface EnchantData {
    id: string;
    displayName: string;
    description: string;
    type: string; // "vanilla" | "extension"
    rarity: string; // "common" | "rare" | "epic" | "special" | "curse"
    targets: string[];
    conflicts: string[];
    maxLevel: number;
    tradeable: boolean;
    discoverable: boolean;
    enchantable: boolean;
    effects: EnchantEffect[];
    values: EnchantValue[];
    conditions: EnchantCondition[];
}

export interface EnchantsManifest {
    version: string;
    types: Record<string, EnchantType>;
    rarities: Record<string, EnchantRarity>;
    enchants: string[];
}

export interface ResolvedEnchant extends EnchantData {
    typeName?: string;
    typeColor?: string;
    rarityName?: string;
    rarityColor?: string;
}
