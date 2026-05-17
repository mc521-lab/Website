export interface JewelryFeatureValue {
    id: string;
    name: string;
    value: number | [number, number];
}

// 通用模板中的 feature 结构: { id, name, value }
export interface JewelryFlatFeature {
    id: string;
    name: string;
    value: number | [number, number];
}

// 秘宝等嵌套结构: { id, name, values: [...] }
export interface JewelryNestedFeature {
    id: string;
    name: string;
    values: JewelryFeatureValue[];
}

export type JewelryFeature = JewelryFlatFeature | JewelryNestedFeature;

export interface JewelryData {
    id: string;
    name: string;
    type: string;
    applicableClass: string;
    features: JewelryFeature[];
}

export interface JewelryInheritData {
    id: string;
    inherit: string;
    variables: Record<string, string>;
}

export interface JewelryJobEntry {
    id: string;
    name: string;
    entryPrefix: string;
    symbolColor: string;
}

export interface JewelryCategoryMetadata {
    jobEntries?: JewelryJobEntry[];
}

export interface JewelryManifestCategory {
    id: string;
    type: string;
    name: string;
    entries: string[];
    metadata?: JewelryCategoryMetadata;
}

export interface JewelryManifest {
    version: string;
    categories: JewelryManifestCategory[];
}

// 统一后的 ResolvedFeature: 如果是 flat 的，包装成 values 数组
export interface ResolvedFeature {
    id: string;
    name: string;
    values: JewelryFeatureValue[];
    // 用于秘宝：标识这是第几组（单属性/双属性/三属性）
    groupLabel?: string;
}

export interface ResolvedJewelry {
    id: string;
    name: string;
    type: string;
    applicableClass: string;
    features: ResolvedFeature[];
    jobId?: string;
    jobName?: string;
    jobColor?: string;
    slotType?: string;
    // 是否是秘宝类型（三组随机抽一组）
    isTreasure?: boolean;
}
