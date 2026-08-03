import { s } from "velite";

export const gallery_equipment_jewelry_data = {
    name: "GalleryEquipmentJewelryData",
    pattern: "gallery/_data/equipment/jewelries/**/*.yml",
    schema: s
        .object({
            basic: s.object({
                name: s.string().max(32),
                special: s.boolean(),
            }),
            modifiers: s
                .object({
                    entries: s.record(
                        s.object({
                            probability: s.number().min(0).max(1),
                            stats: s.array(
                                s.object({
                                    effect: s.string(),
                                    min: s.number(),
                                    max: s.number(),
                                })
                            ),
                        })
                    ),
                })
                .optional(),
        })
        .transform((data, { meta }) => {
            // 路径示例: gallery/_data/equipment/jewelries/ZHANSHI/jiezhizuo.yml
            const segments = meta.path.replace(/\.yml$/, "").split("\\");
            const positionFromPath = segments.at(-1) ?? "";
            const jobFromPath = segments.at(-2)?.toLowerCase() ?? "";

            return {
                id: `${jobFromPath}-${positionFromPath}`.toLowerCase(),
                job: jobFromPath,
                position: positionFromPath,
                ...data,
            };
        }),
};
