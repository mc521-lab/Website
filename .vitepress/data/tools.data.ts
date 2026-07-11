import { defineLoader } from "vitepress";
import raw from "./raw/tools.json";
import type { WikiTools } from "../types/wiki";

export default defineLoader({
    watch: ["./raw/tools.json"],
    load(): WikiTools {
        return raw as WikiTools;
    },
});
