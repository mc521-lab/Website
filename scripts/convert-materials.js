const {
    loadYaml,
    writeJson,
    cleanText,
    detectQualityFromLore,
    detectTypeFromLore,
    resolveImage,
} = require("./lib/shared");

function isSeparatorLine(str) {
    return /^[━\-=]+$/u.test(str.trim());
}

function classifyLoreLine(line) {
    const cleaned = cleanText(line);
    if (!cleaned) return { type: "empty", text: "" };
    if (isSeparatorLine(cleaned)) return { type: "separator", text: "" };

    // 用途行："用途: ..."
    if (/^用途[:：]/.test(cleaned)) {
        return { type: "usage", text: cleaned.replace(/^用途[:：]\s*/, "").trim() };
    }

    // 时限行
    if (/^有效使用期限[:：]/.test(cleaned)) {
        return { type: "limit", text: cleaned };
    }

    // 效果 / 使用方式行（仅保留真正的使用触发，设置说明进 description）
    if (/^食用后/.test(cleaned) || /^右键使用/.test(cleaned)) {
        return { type: "effect", text: cleaned };
    }

    // 兑换 / 集齐行
    if (/集齐\d+个/.test(cleaned) || /即可兑换/.test(cleaned)) {
        return { type: "exchange", text: cleaned };
    }

    // 获取方式行（如果未来 YAML 中出现）
    if (/^获取方式[:：]/.test(cleaned) || /^来源[:：]/.test(cleaned)) {
        return { type: "source", text: cleaned.replace(/^(获取方式|来源)[:：]\s*/, "").trim() };
    }

    return { type: "description", text: cleaned };
}

function extractLoreSections(lore) {
    if (!lore || !Array.isArray(lore)) {
        return { description: "", usage: "", effect: "", limit: "", exchange: "", source: "" };
    }

    const descriptionLines = [];
    const usageLines = [];
    const effectLines = [];
    const limitLines = [];
    const exchangeLines = [];
    const sourceLines = [];

    for (let i = 0; i < lore.length; i++) {
        // 第一行固定是品质/类型信息，跳过
        if (i === 0) continue;

        const { type, text } = classifyLoreLine(lore[i]);
        if (type === "empty" || type === "separator") continue;

        if (type === "description") descriptionLines.push(text);
        else if (type === "usage") usageLines.push(text);
        else if (type === "effect") effectLines.push(text);
        else if (type === "limit") limitLines.push(text);
        else if (type === "exchange") exchangeLines.push(text);
        else if (type === "source") sourceLines.push(text);
    }

    return {
        description: descriptionLines.join("\n"),
        usage: usageLines.join("\n"),
        effect: effectLines.join("\n"),
        limit: limitLines.join("\n"),
        exchange: exchangeLines.join("\n"),
        source: sourceLines.join("\n"),
    };
}

function convertMaterials() {
    const data = loadYaml("material.yml");
    const materials = [];

    for (const [id, entry] of Object.entries(data)) {
        const base = entry.base || {};
        const lore = Array.isArray(base.lore) ? base.lore : [];
        if (lore.length === 0) continue; // 跳过无 lore 的占位条目（如 KONG）

        const name = cleanText(base.name || id);
        const quality = detectQualityFromLore(lore) || "";
        const type = detectTypeFromLore(lore);
        const { description, usage, effect, limit, exchange, source } = extractLoreSections(lore);
        const image = resolveImage(`wiki/item/materials/${id}.png`);

        materials.push({
            id,
            name,
            quality,
            type,
            description,
            usage,
            effect,
            limit,
            exchange,
            source,
            image,
        });
    }

    const filePath = writeJson("materials.json", { materials });
    console.log(`[materials] wrote ${materials.length} entries -> ${filePath}`);
}

module.exports = { run: convertMaterials };

if (require.main === module) {
    convertMaterials();
}
