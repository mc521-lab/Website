import { s } from "velite";

export const gallery_sword_data = {
    name: "GallerySwordData",
    pattern: "gallery/_data/sword/**/*.yml",
    schema: s
        .object({
            basic: s.object({
                name: s.string().max(32),
                quality: s.enum(["D", "C", "B", "A", "S"]),
                job: s.enum(["cike", "fashi", "mushi", "sheshou", "zhanshi"]),
                image: s.string().optional(), // 对应 base.image
            }),
            // 战斗属性
            value: s
                .object({
                    durable: s.number().positive(), // max-item-damage
                    "attack-damage": s.number().nonnegative(),
                    "attack-speed": s.number().positive(),
                    "critical-strike-power": s.number().nonnegative(),
                    "critical-strike-chance": s.number().nonnegative(),
                })
                .optional(),
            gem: s.object({
                count: s.number().int().nonnegative(), // weapon-card
                volume: s.number().int().nonnegative(), // weapon-swordvolume
                lock: s.number().int().nonnegative().optional(), // weapon-max-card - weapon-card
            }),
        })
        .transform((data, { meta }) => {
            const segments = meta.path.replace(/\.yml$/, "").split("/");
            const qualityFromPath = segments.at(-1) ?? data.basic.quality;
            const jobFromPath = segments.at(-2)?.toLowerCase() ?? data.basic.job;

            return {
                id: `${jobFromPath}-${qualityFromPath}`.toLowerCase(),
                ...data,
            };
        }),
};
