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
    const manifest = readJSON("manifest.json");
    const gemCat = manifest.categories.find((c) => c.id === "gems");
    if (!gemCat) {
        console.warn("[build-wiki-data] gems category not found");
        return;
    }

    const gems = [];
    for (const entry of gemCat.entries) {
        try {
            const gem = readJSON(entry);
            gems.push(gem);
        } catch (e) {
            console.warn(`[build-wiki-data] failed to load gem ${entry}:`, e.message);
        }
    }

    writeJSON("gems", { gems });
}

// =================== JEWELRIES ===================
function buildJewelries() {
    const manifest = readJSON("manifest.json");
    const jewelryCat = manifest.categories.find((c) => c.id === "jewelries");
    if (!jewelryCat) {
        console.warn("[build-wiki-data] jewelries category not found");
        return;
    }

    const jobEntries = jewelryCat.metadata?.jobEntries ?? [];
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

    for (const entry of jewelryCat.entries) {
        try {
            const data = readJSON(entry);
            const filename = entry.split("/").pop()?.replace(".json", "") ?? "";
            const slotType = slotMap[filename] ?? filename;
            const isTreasure = slotType === "秘宝";
            const prefix = entry.split("/").slice(0, 2).join("/");
            const jobEntry = jobMap.get(prefix);

            if (data.features) {
                // JewelryData
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
                });
            } else if (data.inherit) {
                // JewelryInheritData
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
                });
            }
        } catch (e) {
            console.warn(`[build-wiki-data] failed to load jewelry ${entry}:`, e.message);
        }
    }

    writeJSON("jewelries", { manifest: jewelryCat, jewelries });
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

// =================== MAIN ===================
async function main() {
    ensureDir(OUT_DIR);

    console.log("[build-wiki-data] start building wiki data...");

    buildEnchants();
    buildEquipment();
    buildGems();
    buildJewelries();
    buildTools();

    console.log("[build-wiki-data] done.");
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
