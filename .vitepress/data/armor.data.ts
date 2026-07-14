import { defineLoader } from "vitepress";
import raw from "./raw/equipment.json";
import type { WikiArmorData } from "../types/wiki";

export default defineLoader({
    watch: ["./raw/equipment.json"],
    load(): WikiArmorData {
        return {
            colors: raw.colors,
            jobs: raw.jobs,
            armors: raw.equipments,
        } as WikiArmorData;
    },
});
