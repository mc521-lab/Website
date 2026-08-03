import { s } from "velite";

export const gallery_equipment_armor_data = {
    name: "GalleryEquipmentArmorData",
    pattern: "gallery/_data/equipment/armor/**/*.yml",
    schema: s
        .object({
            basic: s.object({
                name: s.string().max(32),
                quality: s.enum(["D", "C", "B", "A", "S"]),
                job: s.enum(["cike", "fashi", "mushi", "sheshou", "zhanshi"]),
                image: s.string().optional(), // 对应 base.image
            }),
            // 基础数值（耐久 / 护甲）
            value: s
                .object({
                    durable: s.number().positive().optional(), // max-item-damage
                    armor: s.number().nonnegative().optional(),
                    "armor-toughness": s.number().nonnegative().optional(),
                })
                .optional(),
            // 加成与特殊效果（全部可选）
            effect: s
                .object({
                    "max-health": s.number().optional(), // 最大生命加成
                    defense: s.number().optional(), // 防御减伤
                    "max-mana": s.number().optional(), // 法力加成
                    "max-stamina": s.number().optional(), // 耐力加成
                    "parry-rating": s.number().optional(), // 招架几率
                    "movement-speed": s.number().optional(), // 移速加成
                    "dodge-rating": s.number().optional(), // 闪避率
                })
                .optional(),
            gem: s
                .object({
                    count: s.number().int().nonnegative().optional(), // weapon-card
                    volume: s.number().int().nonnegative().optional(), // weapon-swordvolume
                })
                .optional(),
        })
        .transform((data, { meta }) => {
            // 路径解析：gallery/_data/equipment/armor/CIKE/A/BOOTS.yml
            // → job=CIKE, quality=A, part=BOOTS
            const segments = meta.path.replace(/\.yml$/, "").split("\\");
            const part = segments.at(-1) ?? "UNKNOWN";
            const qualityFromPath = segments.at(-2) ?? data.basic.quality;
            const jobFromPath = segments.at(-3)?.toLowerCase() ?? data.basic.job;

            return {
                id: `${jobFromPath}-${qualityFromPath}-${part}`.toLowerCase(),
                ...data,
            };
        }),
};
