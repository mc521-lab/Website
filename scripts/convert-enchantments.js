const fs = require("fs");
const path = require("path");
const { RAW_CONFIG_DIR } = require("./lib/shared");

const SOURCE_FILES = ["enchantments.yml", "enchants.yml", "enchantment.yml"];

function findSourceFile() {
    for (const fileName of SOURCE_FILES) {
        const filePath = path.join(RAW_CONFIG_DIR, fileName);
        if (fs.existsSync(filePath)) return filePath;
    }
    return null;
}

function convertEnchantments() {
    const sourceFile = findSourceFile();

    if (!sourceFile) {
        console.warn(
            "[enchantments] no source YAML found in temp/raw-config (tried enchantments.yml / enchants.yml / enchantment.yml). " +
                "Skipping enchantments conversion; existing .vitepress/data/raw/enchantments.json will be kept unchanged."
        );
        return;
    }

    throw new Error(
        "Enchantments YAML source exists but conversion rules are not yet implemented. " +
            "Please update convert-enchantments.js with the proper mapping logic."
    );
}

module.exports = { run: convertEnchantments };

if (require.main === module) {
    convertEnchantments();
}
