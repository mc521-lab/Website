import { s } from "velite";

export const gallery_items_shared_schema = s
    .object({
        basic: s.object({
            name: s.string(),
            quality: s.string().optional(),
            type: s.string().optional(),
        }),
        filter: s
            .object({
                type: s.string().optional(),
                for: s.string().optional(),
            })
            .optional(),
        usage: s.array(s.string()).optional(),
        source: s.array(s.string()).optional(),
        limit: s.array(s.string()).optional(),
    })
    .transform((data, { meta }) => {
        // 路径解析：gallery/_data/items/prop/name.yml → type=prop
        const segments = meta.path
            .replace(/\.yml$/, "")
            .replace(/\\/g, "/")
            .split("/");
        const nameFromPath = segments.at(-1) ?? "UNKNOWN";
        const typeFromPath = segments.at(-2) ?? "UNKNOWN";

        return {
            id: `${typeFromPath}-${nameFromPath}`.toLowerCase(),
            ...data,
            usage: data.usage ?? [],
            source: data.source ?? [],
            limit: data.limit ?? [],
        };
    });
