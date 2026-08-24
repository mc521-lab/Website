import type { GalleryJob, GalleryQuality, GemQuality, GemType, GroupTheme, JewelryPosition } from "./types";

export const JOB_LABEL: Record<GalleryJob, string> = {
    cike: "刺客",
    fashi: "法师",
    mushi: "牧师",
    sheshou: "射手",
    zhanshi: "战士",
};

export const JOB_ORDER: GalleryJob[] = ["zhanshi", "cike", "sheshou", "fashi", "mushi"];

export const QUALITY_LABEL: Record<GalleryQuality, string> = {
    D: "D",
    C: "C",
    B: "B",
    A: "A",
    S: "S",
};

export const QUALITY_ORDER: GalleryQuality[] = ["D", "C", "B", "A", "S"];

export const GEM_QUALITY_ORDER: GemQuality[] = ["C", "B", "A", "S"];

export const QUALITY_COLOR: Record<GalleryQuality, string> = {
    D: "bg-slate-500 text-white",
    C: "bg-emerald-600 text-white",
    B: "bg-sky-600 text-white",
    A: "bg-violet-600 text-white",
    S: "bg-amber-500 text-black",
};

export const QUALITY_THEME: Record<GalleryQuality, GroupTheme> = {
    D: {
        accent: "#3ea3ff",
        accent2: "#7cc5ff",
        glow: "rgba(62,163,255,.16)",
        frame: "border-sky-500/45 bg-sky-500/10",
    },
    C: {
        accent: "#10b981",
        accent2: "#57ddb0",
        glow: "rgba(16,185,129,.16)",
        frame: "border-emerald-500/45 bg-emerald-500/10",
    },
    B: {
        accent: "#0ea5e9",
        accent2: "#7dd3fc",
        glow: "rgba(14,165,233,.16)",
        frame: "border-cyan-500/45 bg-cyan-500/10",
    },
    A: {
        accent: "#8b5cf6",
        accent2: "#c4b5fd",
        glow: "rgba(139,92,246,.16)",
        frame: "border-violet-500/45 bg-violet-500/10",
    },
    S: {
        accent: "#f59e0b",
        accent2: "#fde68a",
        glow: "rgba(245,158,11,.16)",
        frame: "border-amber-500/45 bg-amber-500/10",
    },
};

export const QUALITY_TIER: Record<GalleryQuality, string> = {
    D: "基础",
    C: "进阶",
    B: "精良",
    A: "史诗",
    S: "传说",
};

export const TYPE_LABEL: Record<GemType, string> = {
    fx: "焚心宝石",
    bl: "冰灵宝石",
    fy: "风语宝石",
    hj: "灰烬宝石",
    lh: "灵魂宝石",
    bj: "暴击宝石",
};

export const TYPE_ORDER: GemType[] = ["fx", "bl", "fy", "hj", "lh", "bj"];

export const EFFECT_LABEL: Record<string, string> = {
    "max-health": "最大生命",
    "health-regeneration": "生命恢复",
    "max-mana": "最大法力",
    "mana-regeneration": "法力恢复",
    "max-stamina": "最大体力",
    "stamina-regeneration": "体力恢复",
    "dodge-rating": "闪避几率",
    defense: "防御减伤",
    "attack-damage": "基础攻击",
    "pve-damage": "PVE 伤害",
    "pvp-damage-reduction": "PVP 减伤",
    "pve-damage-reduction": "PVE 减伤",
    "critical-strike-chance": "暴击几率",
    "critical-strike-power": "暴击伤害",
    "parry-rating": "招架几率",
    "movement-speed": "移动速度",
};

export const EFFECT_ICON: Record<string, string> = {
    "max-health": "lucide:heart|#ef4444",
    "health-regeneration": "lucide:heart-pulse|#f43f5e",
    "max-mana": "lucide:droplet|#3b82f6",
    "mana-regeneration": "lucide:droplets|#60a5fa",
    "max-stamina": "lucide:zap|#eab308",
    "stamina-regeneration": "lucide:battery-charging|#facc15",
    "dodge-rating": "lucide:wind|#22c55e",
    defense: "lucide:shield|#a78bfa",
    "attack-damage": "lucide:sword|#ef4444",
    "pve-damage": "lucide:swords|#f97316",
    "pvp-damage-reduction": "lucide:shield-check|#8b5cf6",
    "pve-damage-reduction": "lucide:shield-half|#a78bfa",
    "critical-strike-chance": "lucide:target|#eab308",
    "critical-strike-power": "lucide:crosshair|#f97316",
    "parry-rating": "lucide:hand|#f59e0b",
    "movement-speed": "lucide:footprints|#22c55e",
};

export const JOB_THEME: Record<GalleryJob, GroupTheme> = {
    zhanshi: {
        accent: "#ef4444",
        accent2: "#fca5a5",
        glow: "rgba(239,68,68,.16)",
        frame: "border-red-500/45 bg-red-500/10",
    },
    cike: {
        accent: "#a855f7",
        accent2: "#d8b4fe",
        glow: "rgba(168,85,247,.16)",
        frame: "border-purple-500/45 bg-purple-500/10",
    },
    sheshou: {
        accent: "#22c55e",
        accent2: "#86efac",
        glow: "rgba(34,197,94,.16)",
        frame: "border-green-500/45 bg-green-500/10",
    },
    fashi: {
        accent: "#3b82f6",
        accent2: "#93c5fd",
        glow: "rgba(59,130,246,.16)",
        frame: "border-blue-500/45 bg-blue-500/10",
    },
    mushi: {
        accent: "#eab308",
        accent2: "#fde047",
        glow: "rgba(234,179,8,.16)",
        frame: "border-yellow-500/45 bg-yellow-500/10",
    },
};

export const TYPE_THEME: Record<GemType, GroupTheme> = {
    fx: {
        accent: "#ef4444",
        accent2: "#fca5a5",
        glow: "rgba(239,68,68,.16)",
        frame: "border-red-500/45 bg-red-500/10",
    },
    bl: {
        accent: "#3b82f6",
        accent2: "#93c5fd",
        glow: "rgba(59,130,246,.16)",
        frame: "border-blue-500/45 bg-blue-500/10",
    },
    fy: {
        accent: "#22c55e",
        accent2: "#86efac",
        glow: "rgba(34,197,94,.16)",
        frame: "border-green-500/45 bg-green-500/10",
    },
    hj: {
        accent: "#eab308",
        accent2: "#fde047",
        glow: "rgba(234,179,8,.16)",
        frame: "border-yellow-500/45 bg-yellow-500/10",
    },
    lh: {
        accent: "#a855f7",
        accent2: "#d8b4fe",
        glow: "rgba(168,85,247,.16)",
        frame: "border-purple-500/45 bg-purple-500/10",
    },
    bj: {
        accent: "#ec4899",
        accent2: "#f9a8d4",
        glow: "rgba(236,72,153,.16)",
        frame: "border-pink-500/45 bg-pink-500/10",
    },
};

export const POSITION_LABEL: Record<JewelryPosition, string> = {
    jiezhiyou: "右戒",
    jiezhizuo: "左戒",
    mibao: "密宝",
    shoutao: "手套",
    shouzhuo: "手镯",
    xianglian: "项链",
};

export const POSITION_ORDER: JewelryPosition[] = ["jiezhizuo", "jiezhiyou", "shoutao", "shouzhuo", "xianglian", "mibao"];

export const POSITION_THEME: Record<JewelryPosition, GroupTheme> = {
    jiezhiyou: {
        accent: "#f97316",
        accent2: "#fdba74",
        glow: "rgba(249,115,22,.16)",
        frame: "border-orange-500/45 bg-orange-500/10",
    },
    jiezhizuo: {
        accent: "#f59e0b",
        accent2: "#fcd34d",
        glow: "rgba(245,158,11,.16)",
        frame: "border-amber-500/45 bg-amber-500/10",
    },
    mibao: {
        accent: "#ec4899",
        accent2: "#f9a8d4",
        glow: "rgba(236,72,153,.16)",
        frame: "border-pink-500/45 bg-pink-500/10",
    },
    shoutao: {
        accent: "#14b8a6",
        accent2: "#5eead4",
        glow: "rgba(20,184,166,.16)",
        frame: "border-teal-500/45 bg-teal-500/10",
    },
    shouzhuo: {
        accent: "#06b6d4",
        accent2: "#67e8f9",
        glow: "rgba(6,182,212,.16)",
        frame: "border-cyan-500/45 bg-cyan-500/10",
    },
    xianglian: {
        accent: "#6366f1",
        accent2: "#a5b4fc",
        glow: "rgba(99,102,241,.16)",
        frame: "border-indigo-500/45 bg-indigo-500/10",
    },
};

export const PART_LABEL: Record<string, string> = {
    HELMET: "头盔",
    CHESTPLATE: "胸甲",
    LEGGINGS: "护腿",
    BOOTS: "靴子",
};

export const PART_ORDER: string[] = ["HELMET", "CHESTPLATE", "LEGGINGS", "BOOTS"];

export const SET_BONUS = {
    cooldown: { D: 2, C: 4, B: 6, A: 8, S: 10 },
    rangedReduce: { D: 10, C: 10, B: 15, A: 20, S: 25 },
} as const;
