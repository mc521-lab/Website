import { defineLoader } from "vitepress";
import raw from "./raw/enchants.json";
import type { WikiEnchants } from "../types/wiki";

export default defineLoader({
    watch: ["./raw/enchants.json"],
    load(): WikiEnchants {
        return raw as WikiEnchants;
    },
});
