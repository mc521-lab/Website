import { s } from "velite";

export const gallery_pet_schema = s
    .object({
        basic: s.object({
            name: s.string(),
            maxLevel: s.number().optional(),
        }),
        effects: s.object({
            ExperienceThreshold: s.array(s.union([s.number(), s.string(), s.null()])),
            MaxHealth: s.array(s.union([s.number(), s.string(), s.null()])),
            Regeneration: s.array(s.union([s.number(), s.string(), s.null()])),
            ResistanceModifier: s.array(s.union([s.number(), s.string(), s.null()])),
            RespawnCooldown: s.array(s.union([s.number(), s.string(), s.null()])),
        }),
        variants: s.array(s.string()).optional(),
    })
    .transform((data, { meta }) => {
        const segments = meta.path
            .replace(/\.yml$/, "")
            .replace(/\\/g, "/")
            .split("/");
        const nameFromPath = segments.at(-1) ?? "UNKNOWN";
        const typeFromPath = segments.at(-2) ?? "UNKNOWN";

        return {
            id: `${typeFromPath}-${nameFromPath}`.toLowerCase(),
            ...data,
            variants: data.variants ?? [],
        };
    });
