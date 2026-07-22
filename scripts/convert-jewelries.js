const path = require("path");
const {
    loadYaml,
    writeJson,
    cleanText,
    JOB_CONFIG,
    JEWELRY_SLOT_MAP,
    JEWELRY_SET_PINYIN,
    JEWELRY_ATTR_MAP,
    detectJobFromRequiredClass,
    resolveImage,
} = require("./lib/shared");

const JEWELRY_FILES = [
    "sp_shouzhuo.yml",
    "sp_shoutao.yml",
    "sp_xianglian.yml",
    "sp_jiezhizuo.yml",
    "sp_jiezhiyou.yml",
    "sp_mibao.yml",
];

const JOB_ORDER = ["zhanshi", "sheshou", "mushi", "cike", "fashi"];

function extractSetName(name) {
    const cleaned = cleanText(name);
    for (const setName of Object.keys(JEWELRY_SET_PINYIN)) {
        if (cleaned.startsWith(setName)) return setName;
    }
    return "";
}

function collectModifierStats(modifiers, modRefs) {
    const attributes = [];
    const seen = new Set();
    let maxDistinctStats = 0;

    for (const modId of Object.keys(modRefs)) {
        const modDef = modifiers[modId];
        if (!modDef) continue;

        const stats = modDef.stats || {};
        const mappedStats = Object.keys(stats)
            .map((key) => JEWELRY_ATTR_MAP[key])
            .filter(Boolean);

        maxDistinctStats = Math.max(maxDistinctStats, mappedStats.length);

        for (const [statKey, range] of Object.entries(stats)) {
            const mapping = JEWELRY_ATTR_MAP[statKey];
            if (!mapping) continue;
            if (seen.has(mapping.id)) continue;
            seen.add(mapping.id);

            attributes.push({
                id: mapping.id,
                name: mapping.name,
                min: range.min,
                max: range.max,
                icon: mapping.icon,
                iconColor: mapping.iconColor,
            });
        }
    }

    return { attributes, maxDistinctStats };
}

function convertJewelries() {
    const modifiers = loadYaml("shipin_modifiers.yml");
    const jewelries = [];

    for (const fileName of JEWELRY_FILES) {
        const slotInfo = JEWELRY_SLOT_MAP[path.basename(fileName, ".yml")];
        if (!slotInfo) continue;

        const data = loadYaml(fileName);
        for (const [rawKey, entry] of Object.entries(data)) {
            const base = entry.base || {};
            const name = cleanText(base.name || rawKey);
            const jobId = detectJobFromRequiredClass(base["required-class"]);
            if (!jobId) continue;

            const job = JOB_CONFIG[jobId];
            const setName = extractSetName(base.name || rawKey);
            let id;
            if (slotInfo.slotEn === "treasure") {
                const setPinyin = JEWELRY_SET_PINYIN[setName] || "unknown";
                id = `${jobId}_${setPinyin}_treasure`;
            } else {
                id = `${jobId}_${slotInfo.slotEn}`;
            }

            const spModifiers = entry.modifiers?.sp_modifiers || {};
            const randomMin = spModifiers.min ?? 1;
            const modRefs = spModifiers.modifiers || {};

            const { attributes, maxDistinctStats } = collectModifierStats(modifiers, modRefs);
            const randomMax = Math.max(randomMin, maxDistinctStats || 1);

            const image = resolveImage(`wiki/item/jewelries/${id}.png`);

            jewelries.push({
                id,
                name,
                slotType: slotInfo.slotType,
                jobId,
                jobName: job.name,
                jobColor: job.color,
                image,
                randomMin,
                randomMax,
                attributes,
            });
        }
    }

    // 按职业顺序排序
    jewelries.sort((a, b) => {
        const orderA = JOB_ORDER.indexOf(a.jobId);
        const orderB = JOB_ORDER.indexOf(b.jobId);
        if (orderA !== orderB) return orderA - orderB;
        const slotOrder = Object.values(JEWELRY_SLOT_MAP).map((s) => s.slotType);
        return slotOrder.indexOf(a.slotType) - slotOrder.indexOf(b.slotType);
    });

    const jobs = JOB_ORDER.map((id) => ({ id, name: JOB_CONFIG[id].name }));

    const filePath = writeJson("jewelries.json", { jobs, jewelries });
    console.log(`[jewelries] wrote ${jewelries.length} entries -> ${filePath}`);
}

module.exports = { run: convertJewelries };

if (require.main === module) {
    convertJewelries();
}
