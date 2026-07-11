import { defineLoader } from "vitepress";
import raw from "./raw/materials.json";
import type { WikiMaterials } from "../types/wiki";

export default defineLoader({
    watch: ["./raw/materials.json"],
    load(): WikiMaterials {
        return raw as WikiMaterials;
    },
});
