export type GalleryJob = "cike" | "fashi" | "mushi" | "sheshou" | "zhanshi";
export type GalleryQuality = "D" | "C" | "B" | "A" | "S";
export type GalleryQualityNoD = "C" | "B" | "A" | "S";

export interface GroupTheme {
    accent: string;
    accent2: string;
    glow: string;
    frame: string;
}

export interface GallerySetGroup<T> {
    key: string;
    title: string;
    subtitle: string;
    pieces: T[];
    theme: GroupTheme;
}

/* -------------------------------------------------------------------------- */
/*  Armor                                                                     */
/* -------------------------------------------------------------------------- */

export type ArmorQuality = GalleryQuality;
export type ArmorJob = GalleryJob;
export type ArmorPart = "HELMET" | "CHESTPLATE" | "LEGGINGS" | "BOOTS";

export interface ArmorBasic {
    name: string;
    quality: ArmorQuality;
    job: ArmorJob;
    image?: string;
}

export interface ArmorValue {
    durable?: number;
    armor?: number;
    "armor-toughness"?: number;
}

export interface ArmorEffect {
    "max-health"?: number;
    defense?: number;
    "max-mana"?: number;
    "max-stamina"?: number;
    "parry-rating"?: number;
    "movement-speed"?: number;
    "dodge-rating"?: number;
}

export interface ArmorGem {
    count?: number;
    volume?: number;
}

export interface ArmorItem {
    id: string;
    basic: ArmorBasic;
    value?: ArmorValue;
    effect?: ArmorEffect;
    gem?: ArmorGem;
}

export interface ArmorSetGroup extends GallerySetGroup<ArmorItem> {
    job: ArmorJob;
    quality: ArmorQuality;
    setName: string;
}

/* -------------------------------------------------------------------------- */
/*  Gem                                                                       */
/* -------------------------------------------------------------------------- */

export type GemQuality = GalleryQualityNoD;
export type GemType = "fx" | "bl" | "fy" | "hj" | "lh" | "bj";

export interface GemBasic {
    name: string;
    quality: GemQuality;
}

export interface GemMeta {
    "success-rate"?: number;
    consume?: number;
}

export interface GemModifierEntry {
    probability: number;
    effect: string;
    min: number;
    max: number;
}

export interface GemModifiers {
    min?: number;
    max?: number;
    entries?: Record<string, GemModifierEntry>;
}

export interface GemItem {
    id: string;
    type?: GemType | string;
    basic: GemBasic;
    gem?: GemMeta;
    modifiers?: GemModifiers;
}

export type GemSetGroup = GallerySetGroup<GemItem>;

/* -------------------------------------------------------------------------- */
/*  Jewelry                                                                   */
/* -------------------------------------------------------------------------- */

export type JewelryJob = GalleryJob;

export type JewelryPosition = "jiezhiyou" | "jiezhizuo" | "mibao" | "shoutao" | "shouzhuo" | "xianglian";

export interface JewelryBasic {
    name: string;
    special: boolean;
}

export interface JewelryStatEntry {
    effect: string;
    min: number;
    max: number;
}

export interface JewelryModifierEntry {
    probability: number;
    stats: JewelryStatEntry[];
}

export interface JewelryModifiers {
    entries?: Record<string, JewelryModifierEntry>;
}

export interface JewelryItem {
    id: string;
    job?: JewelryJob | string;
    position?: JewelryPosition | string;
    basic: JewelryBasic;
    modifiers?: JewelryModifiers;
}

export type JewelrySetGroup = GallerySetGroup<JewelryItem>;

/* -------------------------------------------------------------------------- */
/*  Sword                                                                     */
/* -------------------------------------------------------------------------- */

export type SwordQuality = GalleryQuality;
export type SwordJob = GalleryJob;

export interface SwordBasic {
    name: string;
    quality: SwordQuality;
    job: SwordJob;
    image?: string;
}

export interface SwordValue {
    durable?: number;
    "attack-damage"?: number;
    "attack-speed"?: number;
    "critical-strike-power"?: number;
    "critical-strike-chance"?: number;
    lifesteal?: number;
}

export interface SwordGem {
    count?: number;
    volume?: number;
    lock?: number;
}

export interface SwordItem {
    id: string;
    basic: SwordBasic;
    value?: SwordValue;
    gem?: SwordGem;
}

export type SwordSetGroup = GallerySetGroup<SwordItem>;
