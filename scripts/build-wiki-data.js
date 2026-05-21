/**
 * Build script: compile scattered JSON files in data/wiki/item/data/
 * into single compiled JSON files under public/wiki/item/data/_compiled/
 *
 * Run: node scripts/build-wiki-data.js
 */

const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(process.cwd(), "data", "wiki", "item", "data");
const OUT_DIR = path.join(process.cwd(), "public", "wiki", "item", "data", "_compiled");

function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

function readJSON(...parts) {
    const filePath = path.join(DATA_DIR, ...parts);
    const content = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(content);
}

function writeJSON(name, data) {
    const filePath = path.join(OUT_DIR, `${name}.json`);
    const json = JSON.stringify(data);
    fs.writeFileSync(filePath, json);
    console.log(`[build-wiki-data] wrote ${filePath} (${json.length} bytes)`);
}

// =================== ENCHANTS ===================
function buildEnchants() {
    const manifest = readJSON("enchants", "manifest.json");
    const enchants = [];

    for (const id of manifest.enchants) {
        try {
            const enchant = readJSON("enchants", `${id}.json`);
            const typeInfo = manifest.types[enchant.type];
            const rarityInfo = manifest.rarities[enchant.rarity];
            enchants.push({
                ...enchant,
                typeName: typeInfo?.name,
                typeColor: typeInfo?.color,
                rarityName: rarityInfo?.name,
                rarityColor: rarityInfo?.color,
            });
        } catch (e) {
            console.warn(`[build-wiki-data] failed to load enchant ${id}:`, e.message);
        }
    }

    writeJSON("enchants", { manifest, enchants });
}

// =================== EQUIPMENT ===================
function buildEquipment() {
    const colors = readJSON("colors.json");
    const index = readJSON("equipment", "index.json");

    const slotNameMap = {
        helmet: "头盔",
        chestplate: "胸甲",
        leggings: "护腿",
        boots: "靴子",
        weapon: "武器",
    };

    const equipments = [];
    const weapons = [];

    for (const job of index.jobs) {
        const jobIndex = readJSON(job.entryPrefix, "index.json");
        const jobColor = colors.jobs[job.id]?.symbolColor ?? "#767676";

        for (const setEntry of jobIndex.sets) {
            const setPath = `${job.entryPrefix}/${setEntry.folder}`;
            const setData = readJSON(setPath, "set.json");

            for (const slot of ["helmet", "chestplate", "leggings", "boots"]) {
                try {
                    const data = readJSON(setPath, `${slot}.json`);
                    equipments.push({
                        id: data.id,
                        name: data.name,
                        slot: data.slot,
                        slotName: slotNameMap[data.slot] ?? data.slot,
                        quality: data.quality,
                        applicableClass: data.applicableClass,
                        setId: data.setId,
                        setName: setData.name,
                        image: data.image,
                        stats: data.stats,
                        enchantSlots: data.enchantSlots,
                        gemSlots: data.gemSlots,
                        gemSlotDetails: data.gemSlotDetails,
                        materials: data.materials,
                        jobId: job.id,
                        jobName: job.name,
                        jobColor,
                        setEffects: setData.setEffects,
                    });
                } catch {
                    // ignore missing slot
                }
            }

            try {
                const data = readJSON(setPath, "weapon.json");
                weapons.push({
                    id: data.id,
                    name: data.name,
                    slot: data.slot,
                    slotName: slotNameMap[data.slot] ?? data.slot,
                    quality: data.quality,
                    applicableClass: data.applicableClass,
                    setId: data.setId,
                    setName: setData.name,
                    image: data.image,
                    stats: data.stats,
                    enchantSlots: data.enchantSlots,
                    gemSlots: data.gemSlots,
                    gemSlotDetails: data.gemSlotDetails,
                    materials: data.materials,
                    jobId: job.id,
                    jobName: job.name,
                    jobColor,
                    setEffects: setData.setEffects,
                });
            } catch {
                // ignore missing weapon
            }
        }
    }

    writeJSON("equipment", { colors, jobs: index.jobs, equipments, weapons });
}

// =================== GEMS ===================
function buildGems() {
    const gemsDir = path.join(DATA_DIR, "gems");
    const gems = [];

    const files = fs.readdirSync(gemsDir).filter((f) => f.endsWith(".json"));
    for (const file of files) {
        try {
            const gem = JSON.parse(fs.readFileSync(path.join(gemsDir, file), "utf-8"));
            gems.push(gem);
        } catch (e) {
            console.warn(`[build-wiki-data] failed to load gem ${file}:`, e.message);
        }
    }

    writeJSON("gems", { gems });
}

// =================== JEWELRIES ===================
function buildJewelries() {
    const colors = readJSON("colors.json");
    const index = readJSON("jewelries", "index.json");
    const jobEntries = (index.jobs ?? []).map((j) => ({
        ...j,
        symbolColor: colors.jobs[j.id]?.symbolColor ?? "#767676",
    }));
    const jobMap = new Map(jobEntries.map((j) => [j.entryPrefix, j]));

    const slotMap = {
        bracelet: "手镯",
        gloves: "手套",
        necklace: "项链",
        ring_left: "戒指-左",
        ring_right: "戒指-右",
        treasure: "秘宝",
    };

    function resolveJewelryName(name, variables) {
        let resolved = name;
        for (const [key, value] of Object.entries(variables)) {
            resolved = resolved.replace(new RegExp(`\\{${key}\\}`, "g"), value);
        }
        return resolved;
    }

    function normalizeFeature(f) {
        if ("values" in f && Array.isArray(f.values)) {
            return {
                id: f.id,
                name: f.name,
                values: f.values ?? [],
            };
        }
        return {
            id: f.id,
            name: f.name,
            values: [{ id: f.id, name: f.name, value: f.value }],
        };
    }

    const jewelries = [];
    const entries = [];

    for (const job of jobEntries) {
        const jobDir = path.join(DATA_DIR, job.entryPrefix);
        const files = fs.readdirSync(jobDir).filter((f) => f.endsWith(".json"));

        for (const file of files) {
            const entry = `${job.entryPrefix}/${file}`;
            entries.push(entry);

            try {
                const data = JSON.parse(fs.readFileSync(path.join(jobDir, file), "utf-8"));
                const filename = file.replace(".json", "");
                const slotType = slotMap[filename] ?? filename;
                const isTreasure = slotType === "秘宝";
                const jobEntry = jobMap.get(job.entryPrefix);

                if (data.features) {
                    jewelries.push({
                        id: data.id,
                        name: data.name,
                        type: data.type,
                        applicableClass: data.applicableClass,
                        features: data.features.map(normalizeFeature),
                        jobId: jobEntry?.id,
                        jobName: jobEntry?.name,
                        jobColor: jobEntry?.symbolColor,
                        slotType,
                        isTreasure,
                        image: data.image,
                    });
                } else if (data.inherit) {
                    const baseFile = data.inherit.replace("common_", "") + ".json";
                    const baseData = readJSON("jewelries", "_common", baseFile);
                    const resolvedName = resolveJewelryName(baseData.name, data.variables);

                    jewelries.push({
                        id: data.id,
                        name: resolvedName,
                        type: baseData.type,
                        applicableClass: jobEntry?.name ?? baseData.applicableClass,
                        features: baseData.features.map(normalizeFeature),
                        jobId: jobEntry?.id,
                        jobName: jobEntry?.name,
                        jobColor: jobEntry?.symbolColor,
                        slotType,
                        isTreasure,
                        image: baseData.image,
                    });
                }
            } catch (e) {
                console.warn(`[build-wiki-data] failed to load jewelry ${entry}:`, e.message);
            }
        }
    }

    const manifest = {
        id: "jewelries",
        type: "jewelry",
        name: "饰品",
        entries,
        metadata: { jobEntries },
    };

    writeJSON("jewelries", { manifest, jewelries });
}

// =================== TOOLS ===================
function buildTools() {
    const index = readJSON("tools", "index.json");
    const categoryMap = new Map(index.categories.map((c) => [c.id, c]));

    const tools = index.tools.map((tool) => ({
        ...tool,
        categoryName: categoryMap.get(tool.category)?.name,
        categoryIcon: categoryMap.get(tool.category)?.icon,
    }));

    writeJSON("tools", { version: index.version, type: index.type, categories: index.categories, tools });
}

// =================== MATERIALS ===================
function buildMaterials() {
    const index = readJSON("materials", "index.json");
    const materialsDir = path.join(DATA_DIR, "materials");
    const materials = [];

    for (const id of index.entries ?? []) {
        try {
            const filePath = path.join(materialsDir, `${id}.json`);
            const material = JSON.parse(fs.readFileSync(filePath, "utf-8"));
            materials.push(material);
        } catch (e) {
            console.warn(`[build-wiki-data] failed to load material ${id}:`, e.message);
        }
    }

    // 保持 index.json 中的顺序，不再额外排序
    writeJSON("materials", { materials });
}

// =================== MAIN ===================
async function main() {
    ensureDir(OUT_DIR);

    console.log("[build-wiki-data] start building wiki data...");

    buildEnchants();
    buildEquipment();
    buildGems();
    buildJewelries();
    buildTools();
    buildMaterials();

    console.log("[build-wiki-data] done.");
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
