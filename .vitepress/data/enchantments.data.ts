import { defineLoader } from "vitepress";
import raw from "./raw/enchantments.json";
import type { WikiEnchants } from "../types/wiki";

export default defineLoader({
    watch: ["./raw/enchantments.json"],
    load(): WikiEnchants {
        return raw as WikiEnchants;
    },
});