import { defineConfig } from "velite";
// wiki
import { wiki_navigation, wiki_content } from "./configs/velite/wiki";
// changelog
import { changelog_navigation, changelog_content } from "./configs/velite/changelog";
// tools
import { tools_navigation } from "./configs/velite/tools/_navigation";
// gallery
import { gallery_navigation } from "./configs/velite/gallery/_navigation";
import * as gallery_equipment_data from "./configs/velite/gallery/equipment";

export default defineConfig({
    collections: {
        // wiki
        wiki_navigation,
        wiki_content,

        // changelog
        changelog_navigation,
        changelog_content,

        // tools
        tools_navigation,

        // gallery
        gallery_navigation,
        ...gallery_equipment_data,
    },
});
