import { defineLoader } from "vitepress";
import raw from "./raw/equipment.json";
import type { WikiWeaponData } from "../types/wiki";

export default defineLoader({
    watch: ["./raw/equipment.json"],
    load(): WikiWeaponData {
        return {
            colors: raw.colors,
            jobs: raw.jobs,
            weapons: raw.weapons,
        } as WikiWeaponData;
    },
});
