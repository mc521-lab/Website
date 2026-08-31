import { GuiButtonConfig, GuiConfig } from "@/types/iagui";

export function generateGuiButtons(map: string[][], palette: Record<string, GuiButtonConfig>): GuiConfig["buttons"] {
    const finalConfig: GuiConfig["buttons"] = {};
    let idx = 0;

    if ("#" in palette) {
        throw new Error('Gui Button Palette key cannot use "#"');
    }

    for (const mapLine of map) {
        for (const mapItem of mapLine) {
            if (mapItem in palette) {
                finalConfig[idx] = palette[mapItem];
            }
            idx += 1;
        }
    }

    return finalConfig;
}
