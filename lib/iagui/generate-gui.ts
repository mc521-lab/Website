import { GuiButtonConfig } from "@/types/iagui";
import { generateGuiButtons } from "./generate-buttons";

interface generateGuiProps {
    id: string;
    name: string;
    descriptions: string[];
    map: string[][];
    palette: Record<string, GuiButtonConfig>;
    overlapStyle?: React.CSSProperties;
}
export function generateGui({ id, name, descriptions, map, palette, overlapStyle }: generateGuiProps) {
    return {
        id,
        name,
        descriptions,
        igconfig: {
            id,
            overlapStyle,
            buttons: generateGuiButtons(map, palette),
        },
    };
}
