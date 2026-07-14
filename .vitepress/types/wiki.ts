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
