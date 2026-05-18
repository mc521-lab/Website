export interface EquipmentStat {
    id: string;
    name: string;
    value: number;
    unit?: string;
}

export interface GemSlot {
    id: string;
    name: string;
    requireDrill: boolean;
}

export interface EquipmentData {
    id: string;
    name: string;
    slot: string;
    quality: string;
    applicableClass: string;
    setId?: string;
    image?: string | null;
    stats: EquipmentStat[];
    enchantSlots: number;
    gemSlots: number;
    gemSlotDetails?: GemSlot[];
    materials: string[];
}

export interface SetEffectEntry {
    id: string;
    name: string;
    value: number;
    unit?: string;
}

export interface SetData {
    id: string;
    name: string;
    job: string;
    jobId: string;
    setEffects: Record<string, SetEffectEntry[]>;
    materials: string[];
}

// 新结构：套装索引中的单个套装条目
export interface SetIndexEntry {
    id: string;
    name: string;
    folder: string;
    quality: string;
}

// 新结构：职业索引
export interface JobIndex {
    jobId: string;
    jobName: string;
    sets: SetIndexEntry[];
}

// 新结构：装备总索引
export interface EquipmentIndex {
    version: string;
    type: string;
    colorRef?: string;
    jobs: EquipmentJobEntry[];
}

export interface EquipmentJobEntry {
    id: string;
    name: string;
    entryPrefix: string;
}

// 颜色配置
export interface JobColorConfig {
    id: string;
    name: string;
    symbolColor: string;
}

export interface ColorConfig {
    version: string;
    type: string;
    jobs: Record<string, JobColorConfig>;
}

export interface ResolvedEquipment {
    id: string;
    name: string;
    slot: string;
    slotName: string;
    quality: string;
    applicableClass: string;
    setId?: string;
    setName?: string;
    image?: string | null;
    stats: EquipmentStat[];
    enchantSlots: number;
    gemSlots: number;
    gemSlotDetails?: GemSlot[];
    materials: string[];
    jobId?: string;
    jobName?: string;
    jobColor?: string;
    setEffects?: Record<string, SetEffectEntry[]>;
}

export interface ResolvedSet {
    id: string;
    name: string;
    job: string;
    jobId: string;
    setEffects: Record<string, SetEffectEntry[]>;
    materials: string[];
}
