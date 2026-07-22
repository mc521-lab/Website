/// <reference types="vitepress/client" />

interface ImportMetaEnv {
    readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

declare module "@data/weapon.data" {
    import type { WikiWeaponData } from "./types/wiki";
    export const data: WikiWeaponData;
}

declare module "@data/armor.data" {
    import type { WikiArmorData } from "./types/wiki";
    export const data: WikiArmorData;
}

declare module "@data/jewelries.data" {
    import type { WikiJewelries } from "./types/wiki";
    export const data: WikiJewelries;
}

declare module "@data/gems.data" {
    import type { WikiGems } from "./types/wiki";
    export const data: WikiGems;
}

declare module "@data/enchantments.data" {
    import type { WikiEnchants } from "./types/wiki";
    export const data: WikiEnchants;
}

declare module "@data/materials.data" {
    import type { WikiMaterials } from "./types/wiki";
    export const data: WikiMaterials;
}