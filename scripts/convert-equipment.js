const {
    loadYaml,
    writeJson,
    cleanText,
    JOB_CONFIG,
    EQUIPMENT_SLOT_MAP,
    ARMOR_STAT_MAP,
    WEAPON_STAT_MAP,
    SET_PINYIN_MAP,
    SET_EFFECTS,
    detectQualityFromLore,
    detectJobFromLore,
    resolveImage,
} = require("./lib/shared");

const QUALITY_ORDER = ["D", "C", "B", "A", "S"];
const JOB_ORDER = ["zhanshi", "fashi", "cike", "mushi", "sheshou"];
const SLOT_ORDER = ["helmet", "chestplate", "leggings", "boots", "weapon"];

function detectSlot(entry) {
    const base = entry.base || {};
    const id = entry._key || "";

    // 优先使用 equippable-slot
    if (base["equippable-slot"]) {
        const slot = base["equippable-slot"];
        if (slot === "head") return "helmet";
        if (slot === "chest") return "chestplate";
        if (slot === "legs") return "leggings";
        if (slot === "feet") return "boots";
    }

    // 按 ID 后缀匹配
    const upperId = id.toUpperCase();
    for (const [slotKey, info] of Object.entries(EQUIPMENT_SLOT_MAP)) {
        for (const suffix of info.suffixes) {
            if (upperId.endsWith(suffix.toUpperCase())) {
                return info.slot;
            }
        }
    }

    return "";
}

function extractSetName(name) {
    const cleaned = cleanText(name);
    for (const setName of Object.keys(SET_PINYIN_MAP)) {
        if (cleaned.startsWith(setName)) return setName;
    }
    return "";
}

function detectJobAndQuality(entry) {
    const base = entry.base || {};
    const lore = base.lore || [];
    let jobId = detectJobFromLore(lore);
    let quality = detectQualityFromLore(lore);

    // 从 ID 兜底
    const id = (entry._key || "").toUpperCase();
    if (!jobId) {
        for (const [jid, config] of Object.entries(JOB_CONFIG)) {
            if (id.startsWith(config.prefix)) {
                jobId = jid;
                break;
            }
        }
    }
    if (!quality) {
        const match = id.match(/_(D|C|B|A|S)_/);
        if (match) quality = match[1];
    }

    return { jobId, quality };
}

function buildArmorStats(base) {
    const stats = [];
    for (const [key, mapping] of Object.entries(ARMOR_STAT_MAP)) {
        const value = base[key];
        if (value === undefined || value === null) continue;
        stats.push({
            id: mapping.id,
            name: mapping.name,
            value,
        });
    }
    return stats;
}

function buildWeaponStats(base) {
    const stats = [];
    for (const [key, mapping] of Object.entries(WEAPON_STAT_MAP)) {
        const value = base[key];
        if (value === undefined || value === null) continue;
        stats.push({
            id: mapping.id,
            name: mapping.name,
            value,
            ...(mapping.unit ? { unit: mapping.unit } : {}),
        });
    }
    return stats;
}

function buildGemSlotDetails(quality) {
    // A/S 品质固定模板：前两个可用，第三个待打孔
    if (quality !== "A" && quality !== "S") return undefined;
    return [
        { id: "gem1", name: "宝石槽位", requireDrill: false },
        { id: "gem2", name: "宝石槽位", requireDrill: false },
        { id: "gem3", name: "待打孔", requireDrill: true },
    ];
}

function convertEquipmentEntries(data, isWeapon) {
    const items = [];

    for (const [key, entry] of Object.entries(data)) {
        entry._key = key;
        const base = entry.base || {};
        const name = cleanText(base.name || key);
        const slot = detectSlot(entry);
        if (!slot) continue;

        const { jobId, quality } = detectJobAndQuality(entry);
        if (!jobId || !quality) continue;

        const job = JOB_CONFIG[jobId];
        const setName = extractSetName(base.name || key);
        const setPinyin = SET_PINYIN_MAP[setName] || "unknown";
        const id = `${jobId}_${setPinyin}_${slot}`;

        const stats = isWeapon ? buildWeaponStats(base) : buildArmorStats(base);

        let enchantSlots;
        let gemSlots;
        if (isWeapon) {
            enchantSlots = base["weapon-swordvolume"] ?? 4;
            gemSlots = base["weapon-max-card"] ?? base["weapon-card"] ?? 2;
        } else {
            enchantSlots = 4;
            gemSlots = base["weapon-swordvolume"] ?? 2;
        }

        const item = {
            id,
            name,
            slot,
            slotName: EQUIPMENT_SLOT_MAP[slot]?.slotName || slot,
            quality,
            applicableClass: job.name,
            setName,
            stats,
            enchantSlots,
            gemSlots,
            materials: [],
            jobId,
            jobName: job.name,
            jobColor: job.color,
            setEffects: SET_EFFECTS[jobId]?.[quality]?.effects || {},
        };

        if (!isWeapon) {
            item.setId = `${jobId}_${setPinyin}_set`;
        }

        const gemSlotDetails = buildGemSlotDetails(quality);
        if (gemSlotDetails) {
            item.gemSlotDetails = gemSlotDetails;
        }

        const image = resolveImage(`wiki/item/equipment/${id}.png`);
        if (image) item.image = image;

        items.push(item);
    }

    return items;
}

function sortEquipment(items) {
    return items.sort((a, b) => {
        const jobA = JOB_ORDER.indexOf(a.jobId);
        const jobB = JOB_ORDER.indexOf(b.jobId);
        if (jobA !== jobB) return jobA - jobB;

        const qualityA = QUALITY_ORDER.indexOf(a.quality);
        const qualityB = QUALITY_ORDER.indexOf(b.quality);
        if (qualityA !== qualityB) return qualityA - qualityB;

        const slotA = SLOT_ORDER.indexOf(a.slot);
        const slotB = SLOT_ORDER.indexOf(b.slot);
        return slotA - slotB;
    });
}

function convertEquipment() {
    const armorData = loadYaml("armor.yml");
    const swordData = loadYaml("sword.yml");

    const armors = sortEquipment(convertEquipmentEntries(armorData, false));
    const weapons = sortEquipment(convertEquipmentEntries(swordData, true));

    const colors = {
        version: "1.0",
        type: "color_config",
        jobs: {},
    };
    for (const [id, config] of Object.entries(JOB_CONFIG)) {
        colors.jobs[id] = { id, name: config.name, symbolColor: config.color };
    }

    const jobs = JOB_ORDER.map((id) => ({
        id,
        name: JOB_CONFIG[id].name,
        entryPrefix: `equipment/${id}`,
    }));

    const filePath = writeJson("equipment.json", {
        colors,
        jobs,
        equipments: armors,
        weapons,
    });

    console.log(`[equipment] wrote ${armors.length} armors and ${weapons.length} weapons -> ${filePath}`);
}

module.exports = { run: convertEquipment };

if (require.main === module) {
    convertEquipment();
}
