const path = require("path");
const fs = require("fs");

const converters = [
    { name: "materials", module: "./convert-materials" },
    { name: "gems", module: "./convert-gems" },
    { name: "jewelries", module: "./convert-jewelries" },
    { name: "equipment", module: "./convert-equipment" },
    { name: "enchantments", module: "./convert-enchantments" },
];

async function main() {
    const root = path.resolve(__dirname, "..");
    const outputDir = path.join(root, ".vitepress/data/raw");

    console.log("== MC521-Lab raw-config converter ==");
    let hasError = false;

    for (const { name, module: modulePath } of converters) {
        try {
            const converter = require(modulePath);
            if (typeof converter.run !== "function") {
                console.warn(`[${name}] converter does not export a run function, skipping`);
                continue;
            }
            await converter.run();
        } catch (err) {
            hasError = true;
            console.error(`[${name}] conversion failed:`, err.message);
        }
    }

    // Validate generated JSON files
    console.log("\n== Validating generated JSON files ==");
    const files = fs.readdirSync(outputDir).filter((f) => f.endsWith(".json"));
    let invalidCount = 0;
    for (const file of files) {
        const filePath = path.join(outputDir, file);
        try {
            const content = fs.readFileSync(filePath, "utf8");
            JSON.parse(content);
            console.log(`[ok] ${file}`);
        } catch (err) {
            invalidCount++;
            console.error(`[invalid] ${file}: ${err.message}`);
        }
    }

    if (hasError || invalidCount > 0) {
        process.exit(1);
    }
    console.log("\nAll conversions completed successfully.");
}

main();
