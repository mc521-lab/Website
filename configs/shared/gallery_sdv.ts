import { s } from "velite";

export const gallery_sdv_schema = s
    .object({
        basic: s.object({
            name: s.string(),
            type: s.string(),
        }),
        usage: s.array(s.string()).optional(),
        source: s.array(s.string()).optional(),
        limit: s.array(s.string()).optional(),
        variants: s.array(s.string()).optional(),
    })
    .transform((data, { meta }) => {
        const segments = meta.path.replace(/\.yml$/, "").replace(/\\/g, "/").split("/");
        const nameFromPath = segments.at(-1) ?? "UNKNOWN";
        const categoryFromPath = segments.at(-2) ?? "UNKNOWN";

        return {
            id: `${categoryFromPath}-${nameFromPath}`.toLowerCase(),
            ...data,
            usage: data.usage ?? [],
            source: data.source ?? [],
            limit: data.limit ?? [],
            variants: data.variants ?? [],
        };
    });
