/// <reference types="vitepress/client" />

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