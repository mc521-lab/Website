import { defineLoader } from "vitepress";
import raw from "./raw/jewelries.json";
import type { WikiJewelries } from "../types/wiki";

export default defineLoader({
    watch: ["./raw/jewelries.json"],
    load(): WikiJewelries {
        return raw as WikiJewelries;
    },
});
