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
import * as gallery_items_data from "./configs/velite/gallery/chore";
import * as gallery_pet_data from "./configs/velite/gallery/mcpet";
import * as gallery_skin_data from "./configs/velite/gallery/skin";
import * as gallery_deco_data from "./configs/velite/gallery/deco";
import * as gallery_sdv_data from "./configs/velite/gallery/sdv";

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
        ...gallery_items_data,
        ...gallery_pet_data,
        ...gallery_skin_data,
        ...gallery_deco_data,
        ...gallery_sdv_data,
    },
});
