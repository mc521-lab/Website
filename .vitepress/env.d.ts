/// <reference types="vitepress/client" />

declare module "@data/enchants.data" {
    import type { WikiEnchants } from "./types/wiki";
    export const data: WikiEnchants;
}

declare module "@data/equipment.data" {
    import type { WikiEquipments } from "./types/wiki";
    export const data: WikiEquipments;
}

declare module "@data/gems.data" {
    import type { WikiGems } from "./types/wiki";
    export const data: WikiGems;
}

declare module "@data/jewelries.data" {
    import type { WikiJewelries } from "./types/wiki";
    export const data: WikiJewelries;
}

declare module "@data/materials.data" {
    import type { WikiMaterials } from "./types/wiki";
    export const data: WikiMaterials;
}

declare module "@data/tools.data" {
    import type { WikiTools } from "./types/wiki";
    export const data: WikiTools;
}
