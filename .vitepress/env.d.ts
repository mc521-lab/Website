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
