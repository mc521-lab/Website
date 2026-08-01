import { s } from "velite";

export const changelog_navigation = {
    name: "ChangelogNavigation",
    pattern: "changelog/_navigation/**/*.yml",
    schema: s.object({
        title: s.string(),
        order: s.number().default(0),
        items: s.array(
            s.object({
                title: s.string(),
                href: s.string(),
                icon: s.string().optional(),
                type: s.string().optional(),
                order: s.number().default(0),
            })
        ),
    }),
};

export const changelog_content = {
    name: "ChangelogContent",
    pattern: "changelog/_pages/**/*.mdx",
    schema: s
        .object({
            title: s.string().max(99),
            description: s.string().optional(),
            date: s.string().optional(),
            type: s.string().optional(),
            version: s.string().optional(),
            metadata: s.metadata(),
            order: s.number().default(0),
            slug: s.path(),
            excerpt: s.excerpt(),
            body: s.mdx(),
        })
        .transform((doc) => ({
            ...doc,
            slug: doc.slug.replace("changelog/_pages/", ""),
        })),
};
