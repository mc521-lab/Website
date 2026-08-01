import { defineConfig } from "velite";
// wiki
import { wiki_navigation, wiki_content } from "./configs/velite/wiki";
// changelog
import { changelog_navigation, changelog_content } from "./configs/velite/changelog";
// tools
import { tools_navigation } from "./configs/velite/tools/_navigation";
// gallery
import { gallery_navigation } from "./configs/velite/gallery/_navigation";
import { gallery_armor_data } from "./configs/velite/gallery/armor";
import { gallery_sword_data } from "./configs/velite/gallery/sword";
import { gallery_gem_data } from "./configs/velite/gallery/gem";
import { gallery_jewelry_data } from "./configs/velite/gallery/jewelries";

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
        gallery_armor_data,
        gallery_sword_data,
        gallery_gem_data,
        gallery_jewelry_data,
    },
});
