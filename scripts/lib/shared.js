const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

const ROOT = path.resolve(__dirname, "../..");
const RAW_CONFIG_DIR = path.join(ROOT, "temp/raw-config");
const OUTPUT_DIR = path.join(ROOT, ".vitepress/data/raw");
const PUBLIC_DIR = path.join(ROOT, "public");

function loadYaml(fileName) {
    const filePath = path.join(RAW_CONFIG_DIR, fileName);
    const content = fs.readFileSync(filePath, "utf8");
    return yaml.load(content);
}

function writeJson(fileName, data) {
    const filePath = path.join(OUTPUT_DIR, fileName);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(data, null, 4) + "\n", "utf8");
    return filePath;
}

function cleanText(str) {
    if (!str) return "";
    return (
        str
            // MiniMessage hex colors: <#RRGGBB> and <#AARRGGBB>
            .replace(/<#[A-Fa-f0-9]{6,8}>/g, "")
            // MiniMessage tags: <gradient:...>, </gradient>, <st>, </st>, etc.
            .replace(/<\/?[a-zA-Z0-9_:#-]+>/g, "")
            // Legacy color codes: &0-9, &a-f, &k-o, &r ; § variants
            .replace(/[&§][0-9a-fk-orA-FK-OR]/g, "")
            // ziti symbols used as quality / action icons
            .replace(/[겨걂걃걄걅갫]/g, "")
            .trim()
    );
}

const ZITI_QUALITY_MAP = {
    겨: "D",
    걂: "C",
    걃: "B",
    걄: "A",
    걅: "S",
};

const QUALITY_NAME = {
    D: "D",
    C: "C",
    B: "B",
    A: "A",
    S: "S",
};

const JOB_CONFIG = {
    zhanshi: { name: "战士", color: "#FF0000", prefix: "ZHANSHI" },
    fashi: { name: "法师", color: "#01B2E3", prefix: "FASHI" },
    cike: { name: "刺客", color: "#00C853", prefix: "CIKE" },
    mushi: { name: "牧师", color: "#868686", prefix: "MUSHI" },
    sheshou: { name: "射手", color: "#F0B100", prefix: "SHESHOU" },
};

const EQUIPMENT_SLOT_MAP = {
    helmet: { slot: "helmet", slotName: "头盔", suffixes: ["KUI", "helmet"] },
    chestplate: { slot: "chestplate", slotName: "胸甲", suffixes: ["XIONG", "chestplate", "chest"] },
    leggings: { slot: "leggings", slotName: "护腿", suffixes: ["KU", "leggings", "legs"] },
    boots: { slot: "boots", slotName: "靴子", suffixes: ["XUE", "boots", "feet"] },
    weapon: { slot: "weapon", slotName: "武器", suffixes: ["JIAN", "weapon"] },
};

const ARMOR_STAT_MAP = {
    "max-health": { id: "extraHealth", name: "额外生命" },
    armor: { id: "armorValue", name: "护甲数值" },
    "armor-toughness": { id: "armorToughness", name: "盔甲韧性" },
    defense: { id: "damageReduction", name: "防御减伤" },
    "max-mana": { id: "maxMana", name: "法力上限" },
    "max-stamina": { id: "maxStamina", name: "耐力上限" },
    "dodge-rating": { id: "dodgeRating", name: "闪避率" },
};

const WEAPON_STAT_MAP = {
    "attack-damage": { id: "baseDamage", name: "基础伤害" },
    "attack-speed": { id: "attackSpeed", name: "攻击速度" },
    "critical-strike-power": { id: "critDamage", name: "暴击伤害", unit: "%" },
    "critical-strike-chance": { id: "critRate", name: "暴击概率", unit: "%" },
};

const SET_PINYIN_MAP = {
    // 战士
    士卒: "sizu",
    骑士: "qishi",
    将军: "jiangjun",
    领袖: "lingxiu",
    战神: "zhanshen",
    // 法师
    学徒: "xuetu",
    术师: "shushi",
    魔导: "modao",
    贤者: "xianzhe",
    法神: "fashen",
    // 刺客
    暗卒: "anzu",
    隐匿: "yinni",
    夜行: "yexing",
    诡影: "guiying",
    刺魂: "cihun",
    // 牧师
    信徒: "xintu",
    圣洁: "shengjie",
    光辉: "guanghui",
    守护: "shouhu",
    教皇: "jiaohuang",
    // 射手
    弓卒: "gongzu",
    猎手: "lieshou",
    鹰眼: "yingyan",
    苍穹: "cangqiong",
    后羿: "houyi",
};

const SET_EFFECTS = {
    zhanshi: {
        D: { setName: "士卒", effects: { "4": [{ id: "cooldownReduction", name: "技能冷却", value: -2, unit: "%" }, { id: "rangedReduction", name: "远程减免", value: -10, unit: "%" }] } },
        C: { setName: "骑士", effects: { "4": [{ id: "cooldownReduction", name: "技能冷却", value: -4, unit: "%" }, { id: "rangedReduction", name: "远程减免", value: -10, unit: "%" }] } },
        B: { setName: "将军", effects: { "4": [{ id: "cooldownReduction", name: "技能冷却", value: -6, unit: "%" }, { id: "rangedReduction", name: "远程减免", value: -15, unit: "%" }] } },
        A: { setName: "领袖", effects: { "4": [{ id: "cooldownReduction", name: "技能冷却", value: -8, unit: "%" }, { id: "rangedReduction", name: "远程减免", value: -20, unit: "%" }] } },
        S: { setName: "战神", effects: { "4": [{ id: "cooldownReduction", name: "技能冷却", value: -10, unit: "%" }, { id: "rangedReduction", name: "远程减免", value: -25, unit: "%" }] } },
    },
    fashi: {
        D: { setName: "学徒", effects: { "4": [{ id: "maxMana", name: "法力上限", value: 0.5, unit: "" }, { id: "maxStamina", name: "耐力上限", value: 0.5, unit: "" }] } },
        C: { setName: "术师", effects: { "4": [{ id: "maxMana", name: "法力上限", value: 1, unit: "" }, { id: "maxStamina", name: "耐力上限", value: 1, unit: "" }] } },
        B: { setName: "魔导", effects: { "4": [{ id: "maxMana", name: "法力上限", value: 2, unit: "" }, { id: "maxStamina", name: "耐力上限", value: 2, unit: "" }] } },
        A: { setName: "贤者", effects: { "4": [{ id: "maxMana", name: "法力上限", value: 3, unit: "" }, { id: "maxStamina", name: "耐力上限", value: 3, unit: "" }] } },
        S: { setName: "法神", effects: { "4": [{ id: "maxMana", name: "法力上限", value: 4, unit: "" }, { id: "maxStamina", name: "耐力上限", value: 4, unit: "" }] } },
    },
    cike: {
        D: { setName: "暗卒", effects: { "4": [{ id: "movementSpeed", name: "移速加成", value: 0.25, unit: "%" }] } },
        C: { setName: "隐匿", effects: { "4": [{ id: "movementSpeed", name: "移速加成", value: 0.5, unit: "%" }] } },
        B: { setName: "夜行", effects: { "4": [{ id: "movementSpeed", name: "移速加成", value: 1, unit: "%" }] } },
        A: { setName: "诡影", effects: { "4": [{ id: "movementSpeed", name: "移速加成", value: 1.5, unit: "%" }] } },
        S: { setName: "刺魂", effects: { "4": [{ id: "movementSpeed", name: "移速加成", value: 2, unit: "%" }] } },
    },
    mushi: {
        D: { setName: "信徒", effects: { "4": [{ id: "extraHealth", name: "生命上限", value: 0.5, unit: "" }, { id: "maxMana", name: "法力上限", value: 0.5, unit: "" }, { id: "maxStamina", name: "耐力上限", value: 0.5, unit: "" }] } },
        C: { setName: "圣洁", effects: { "4": [{ id: "extraHealth", name: "生命上限", value: 1, unit: "" }, { id: "maxMana", name: "法力上限", value: 1, unit: "" }, { id: "maxStamina", name: "耐力上限", value: 1, unit: "" }] } },
        B: { setName: "光辉", effects: { "4": [{ id: "extraHealth", name: "生命上限", value: 2, unit: "" }, { id: "maxMana", name: "法力上限", value: 2, unit: "" }, { id: "maxStamina", name: "耐力上限", value: 2, unit: "" }] } },
        A: { setName: "守护", effects: { "4": [{ id: "extraHealth", name: "生命上限", value: 3, unit: "" }, { id: "maxMana", name: "法力上限", value: 3, unit: "" }, { id: "maxStamina", name: "耐力上限", value: 3, unit: "" }] } },
        S: { setName: "教皇", effects: { "4": [{ id: "extraHealth", name: "生命上限", value: 4, unit: "" }, { id: "maxMana", name: "法力上限", value: 4, unit: "" }, { id: "maxStamina", name: "耐力上限", value: 4, unit: "" }] } },
    },
    sheshou: {
        D: { setName: "弓卒", effects: { "4": [{ id: "dodgeRating", name: "闪避率", value: 1, unit: "%" }] } },
        C: { setName: "猎手", effects: { "4": [{ id: "dodgeRating", name: "闪避率", value: 2, unit: "%" }] } },
        B: { setName: "鹰眼", effects: { "4": [{ id: "dodgeRating", name: "闪避率", value: 4, unit: "%" }] } },
        A: { setName: "苍穹", effects: { "4": [{ id: "dodgeRating", name: "闪避率", value: 6, unit: "%" }] } },
        S: { setName: "后羿", effects: { "4": [{ id: "dodgeRating", name: "闪避率", value: 8, unit: "%" }] } },
    },
};

const GEM_GROUP_MAP = {
    BS_FX: { id: "fenxin", name: "焚心宝石", color: "#FF0000", featureIds: ["maxHealth", "healthRegen"] },
    BS_BL: { id: "bingling", name: "冰灵宝石", color: "#01B2E3", featureIds: ["maxMana", "manaRegen"] },
    BS_FY: { id: "fengyu", name: "风语宝石", color: "#00D700", featureIds: ["maxStamina", "staminaRegen"] },
    BS_HJ: { id: "huijin", name: "灰烬宝石", color: "#767676", featureIds: ["dodgeRate", "damageReduction"] },
    BS_LH: { id: "linghun", name: "灵魂宝石", color: "#9E00F4", featureIds: ["baseAttack", "pveAttack"] },
    BS_BJ: { id: "baoji", name: "暴击宝石", color: "#D80071", featureIds: ["critRate", "critDamage"] },
};

const GEM_STAT_NAME = {
    maxHealth: "最大生命值",
    healthRegen: "生命恢复",
    maxMana: "最大法力值",
    manaRegen: "法力恢复",
    maxStamina: "最大体力值",
    staminaRegen: "体力恢复",
    dodgeRate: "闪避几率",
    damageReduction: "防御减伤",
    baseAttack: "基础攻击",
    pveAttack: "PVE攻击",
    critRate: "暴击几率",
    critDamage: "暴击伤害",
};

const GEM_YAML_STAT_MAP = {
    "max-health": "maxHealth",
    "health-regeneration": "healthRegen",
    "max-mana": "maxMana",
    "mana-regeneration": "manaRegen",
    "max-stamina": "maxStamina",
    "stamina-regeneration": "staminaRegen",
    "dodge-rating": "dodgeRate",
    defense: "damageReduction",
    "attack-damage": "baseAttack",
    "pve-damage": "pveAttack",
    "critical-strike-chance": "critRate",
    "critical-strike-power": "critDamage",
};

const JEWELRY_SLOT_MAP = {
    sp_shouzhuo: { slotType: "手镯", slotEn: "bracelet" },
    sp_shoutao: { slotType: "手套", slotEn: "gloves" },
    sp_xianglian: { slotType: "项链", slotEn: "necklace" },
    sp_jiezhizuo: { slotType: "戒指-左", slotEn: "ring_left" },
    sp_jiezhiyou: { slotType: "戒指-右", slotEn: "ring_right" },
    sp_mibao: { slotType: "秘宝", slotEn: "treasure" },
};

const JEWELRY_SET_PINYIN = {
    烈焰: "lieyan",
    奥术: "aoshu",
    瞬影: "shunying",
    光羽: "guangyu",
    牧灵: "muling",
};

const JEWELRY_ATTR_MAP = {
    "max-mana": { id: "manaBonus", name: "法力加成", icon: "shield", iconColor: "#3b82f6" },
    "max-stamina": { id: "staminaBonus", name: "体力加成", icon: "heart", iconColor: "#dc2626" },
    "attack-damage": { id: "baseAttack", name: "基础攻击", icon: "sword", iconColor: "#b8722e" },
    "critical-strike-power": { id: "critDamage", name: "暴击伤害", icon: "sword", iconColor: "#b8722e" },
    "critical-strike-chance": { id: "critRate", name: "暴击几率", icon: "sword", iconColor: "#b8722e" },
    "pvp-damage-reduction": { id: "pvpDamageReduction", name: "PVP伤害减免", icon: "shield", iconColor: "#3b82f6" },
    "pve-damage-reduction": { id: "pveDamageReduction", name: "PVE伤害减免", icon: "shield", iconColor: "#3b82f6" },
    "max-health": { id: "healthBonus", name: "生命加成", icon: "heart", iconColor: "#dc2626" },
    defense: { id: "damageReduction", name: "防御减伤", icon: "shield", iconColor: "#3b82f6" },
    "pve-damage": { id: "pveAttack", name: "PVE攻击", icon: "sword", iconColor: "#b8722e" },
};

function detectQualityFromLore(lore) {
    if (!lore || !Array.isArray(lore)) return null;
    const text = lore.join(" ");
    for (const [symbol, quality] of Object.entries(ZITI_QUALITY_MAP)) {
        if (text.includes(symbol)) return quality;
    }
    return null;
}

function detectJobFromLore(lore) {
    if (!lore || !Array.isArray(lore)) return null;
    const text = cleanText(lore.join(" "));
    for (const [jobId, config] of Object.entries(JOB_CONFIG)) {
        if (text.includes(config.name)) return jobId;
    }
    return null;
}

function detectJobFromRequiredClass(requiredClass) {
    if (!Array.isArray(requiredClass)) return null;
    const text = requiredClass.join(" ");
    for (const [jobId, config] of Object.entries(JOB_CONFIG)) {
        if (text.includes(config.name)) return jobId;
    }
    return null;
}

function detectTypeFromLore(lore) {
    if (!lore || !Array.isArray(lore)) return "";
    for (const line of lore) {
        const cleaned = cleanText(line);
        const match = cleaned.match(/类型[:：]\s*(.+)/);
        if (match) return match[1].trim();
    }
    return "";
}

function resolveImage(relativeUrl) {
    const filePath = path.join(PUBLIC_DIR, relativeUrl);
    if (fs.existsSync(filePath)) return "/" + relativeUrl.replace(/\\/g, "/");
    return null;
}

module.exports = {
    ROOT,
    RAW_CONFIG_DIR,
    OUTPUT_DIR,
    PUBLIC_DIR,
    loadYaml,
    writeJson,
    cleanText,
    ZITI_QUALITY_MAP,
    QUALITY_NAME,
    JOB_CONFIG,
    EQUIPMENT_SLOT_MAP,
    ARMOR_STAT_MAP,
    WEAPON_STAT_MAP,
    SET_PINYIN_MAP,
    SET_EFFECTS,
    GEM_GROUP_MAP,
    GEM_STAT_NAME,
    GEM_YAML_STAT_MAP,
    JEWELRY_SLOT_MAP,
    JEWELRY_SET_PINYIN,
    JEWELRY_ATTR_MAP,
    detectQualityFromLore,
    detectJobFromLore,
    detectJobFromRequiredClass,
    detectTypeFromLore,
    resolveImage,
};
