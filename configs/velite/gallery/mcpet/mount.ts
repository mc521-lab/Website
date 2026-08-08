import { gallery_pet_schema } from "@/configs/shared/gallery_pet";
import { gallery_items_shared_schema } from "@/configs/shared/gallery_items";

export const gallery_mcpet_mount_data = {
    name: "GalleryMCPetMountData",
    pattern: "gallery/_data/mcpet/mount/*.yml",
    schema: gallery_pet_schema,
};

export const gallery_mcpet_mount_fragment_data = {
    name: "GalleryMCPetMountFragmentData",
    pattern: "gallery/_data/mcpet/mount/fragment/*.yml",
    schema: gallery_items_shared_schema,
};
