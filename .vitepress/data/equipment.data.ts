import { defineLoader } from "vitepress";
import raw from "./raw/equipment.json";
import type { WikiEquipments } from "../types/wiki";

export default defineLoader({
    watch: ["./raw/equipment.json"],
    load(): WikiEquipments {
        return raw as WikiEquipments;
    },
});
