import { s } from "velite";

export const gallery_enchants_data = {
    name: "gallery_enchants",
    pattern: "gallery/_data/enchants/**/*.yml",
    schema: s
        .object({
            basic: s.object({
                name: s.string(),
                description: s.string(),
                placeholder: s.union([s.string(), s.null()]).optional(),
                placeholders: s.record(s.string()).optional(),
                "max-level": s.number().int().positive(),
            }),
            filter: s.object({
                rarity: s.string(),
                tradeable: s.boolean(),
                discoverable: s.boolean(),
                enchantable: s.boolean().default(true),
            }),
            targets: s.array(s.string()).default([]),
            conflicts: s.array(s.string()).default([]),
        })
        .transform((data, { meta }) => {
            const segments = meta.path
                .replace(/\.yml$/, "")
                .replace(/\\/g, "/")
                .split("/");
            const id = segments.at(-1) ?? "unknown";

            return {
                id,
                slug: id,
                ...data,
            };
        }),
};
