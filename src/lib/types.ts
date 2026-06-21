export interface IEnchantInfo {
    id: string;
    displayName: string;
    description: string;
    type: string;
    rarity: string;
    targets: string[];
    conflicts: string[];
    maxLevel: number;
    effects: Array<IEnchantEffect>;
    values: Array<IEnchantValue>;
    conditions: Array<IEnchantCondition>;
    typeName: string;
    typeColor: string;
    rarityName: string;
    rarityColor: string;
}

export interface IEnchantEffect {
    id: string;
    description: string;
    formula?: string;
    [key: string]: any;
}

export interface IEnchantValue {
    id: string;
    name: string;
    formula: string;
    unit: string;
    description: string;
}

export interface IEnchantCondition {
    id: string;
    description: string;
}
