import { gallery_pet_schema } from "@/configs/shared/gallery_pet";
import { gallery_items_shared_schema } from "@/configs/shared/gallery_items";

export const gallery_mcpet_pet_data = {
    name: "GalleryMCPetPetData",
    pattern: "gallery/_data/mcpet/pet/*.yml",
    schema: gallery_pet_schema,
};

export const gallery_mcpet_pet_fragment_data = {
    name: "GalleryMCPetPetFragmentData",
    pattern: "gallery/_data/mcpet/pet/fragment/*.yml",
    schema: gallery_items_shared_schema,
};

