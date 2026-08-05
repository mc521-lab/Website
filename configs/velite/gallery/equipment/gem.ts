import { s } from "velite";

export const gallery_equipment_gem_data = {
    name: "GalleryEquipmentGemData",
    pattern: "gallery/_data/equipment/gem/**/*.yml",
    schema: s
        .object({
            basic: s.object({
                name: s.string().max(32),
                quality: s.enum(["C", "B", "A", "S"]),
            }),
            gem: s
                .object({
                    "success-rate": s.number().nonnegative().optional(), // 安装成功率（0–100）
                    consume: s.number().int().nonnegative().optional(), // 消耗容量（gemstone-consume）
                })
                .optional(),
            modifiers: s
                .object({
                    min: s.number().int().nonnegative().optional(), // 组生效最少修饰符数
                    max: s.number().int().nonnegative().optional(), // 组生效最多修饰符数
                    entries: s
                        .record(
                            s.object({
                                probability: s.number().min(0).max(1), // 触发概率 0.0–1.0
                                effect: s.string(), // 属性键，如 max-health
                                min: s.number(),
                                max: s.number(),
                            })
                        )
                        .optional(),
                })
                .optional(),
        })
        .transform((data, { meta }) => {
            // 路径解析：gallery/_data/equipment/gem/fx/c.yml → type=fx, quality=c
            const segments = meta.path
                .replace(/\.yml$/, "")
                .replace(/\\/g, "/")
                .split("/");
            const qualityFromPath = (segments.at(-1) ?? data.basic.quality).toLowerCase();
            const typeFromPath = (segments.at(-2) ?? "unknown").toLowerCase();

            return {
                id: `${typeFromPath}-${qualityFromPath}`,
                type: typeFromPath,
                ...data,
                basic: {
                    ...data.basic,
                    // 以路径品质为准，并统一为大写以匹配页面枚举
                    quality: qualityFromPath.toUpperCase() as "C" | "B" | "A" | "S",
                },
            };
        }),
};
