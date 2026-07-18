import { defineLoader } from "vitepress";
import raw from "./raw/gems.json";
import type { WikiGems } from "../types/wiki";

export default defineLoader({
    watch: ["./raw/gems.json"],
    load(): WikiGems {
        return raw as WikiGems;
    },
});