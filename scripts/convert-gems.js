const {
    loadYaml,
    writeJson,
    GEM_GROUP_MAP,
    GEM_STAT_NAME,
    GEM_YAML_STAT_MAP,
} = require("./lib/shared");

const QUALITIES = ["C", "B", "A", "S"];

function describeRoll(min, max) {
    if (min === max) {
        return min === 1 ? "随机一个属性" : `随机${min}个属性`;
    }
    if (min === 1 && max === 2) return "随机一到两个属性";
    return `随机${min}到${max}个属性`;
}

function convertGems() {
    const gemStone = loadYaml("gem_stone.yml");
    const modifiers = loadYaml("baoshi_modifiers.yml");

    // 按 BS_FX / C 分组
    const groups = {};
    for (const [itemId, entry] of Object.entries(gemStone)) {
        const parts = itemId.split("_");
        if (parts.length < 3) continue;
        const quality = parts[parts.length - 1];
        const groupKey = parts.slice(0, -1).join("_");
        if (!groups[groupKey]) groups[groupKey] = {};
        groups[groupKey][quality] = entry;
    }

    const gems = [];

    for (const [groupKey, groupInfo] of Object.entries(GEM_GROUP_MAP)) {
        const entries = groups[groupKey] || {};
        const qualitys = [];

        for (const q of QUALITIES) {
            const entry = entries[q];
            if (!entry) continue;

            const modGroup = entry.modifiers?.c_modifiers || {};
            const rollMin = modGroup.min ?? 1;
            const rollMax = modGroup.max ?? 1;
            const modRefs = modGroup.modifiers || {};

            const features = [];
            for (const modId of Object.keys(modRefs)) {
                const modDef = modifiers[modId];
                if (!modDef) continue;
                for (const [statKey, range] of Object.entries(modDef.stats || {})) {
                    const featureId = GEM_YAML_STAT_MAP[statKey];
                    if (!featureId) continue;
                    features.push({
                        id: featureId,
                        value: [range.min, range.max],
                    });
                }
            }

            qualitys.push({
                id: q.toLowerCase(),
                name: `${q} 级`,
                description: describeRoll(rollMin, rollMax),
                features,
            });
        }

        gems.push({
            id: groupInfo.id,
            name: groupInfo.name,
            symbolColor: groupInfo.color,
            description: "",
            image: null,
            features: groupInfo.featureIds.map((fid) => ({
                id: fid,
                name: GEM_STAT_NAME[fid] || fid,
            })),
            qualitys,
        });
    }

    const filePath = writeJson("gems.json", { gems });
    console.log(`[gems] wrote ${gems.length} groups -> ${filePath}`);
}

module.exports = { run: convertGems };

if (require.main === module) {
    convertGems();
}
