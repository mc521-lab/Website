import { s } from "velite";

export const wiki_navigation = {
    name: "WikiNavigation",
    pattern: "wiki/_navigation/**/*.yml",
    schema: s.object({
        /** 分组标题 */
        title: s.string(),
        /** 分组排序 (可选, 默认 0) */
        order: s.number().default(0),
        /** 是否默认展开 (可选, 默认 false) */
        defaultExpanded: s.boolean().default(false),
        /** 分组图标 (可选, Iconify 图标标识符) */
        icon: s.string().optional(),
        /** 菜单项列表 */
        items: s.array(
            s.object({
                /** 菜单项标题 */
                title: s.string(),
                /** 菜单项路径 */
                href: s.string(),
                /** 菜单项图标 (可选, Iconify 图标标识符) */
                icon: s.string().optional(),
                /** 菜单项排序 (可选, 默认 0) */
                order: s.number().default(0),
            })
        ),
    }),
};

export const wiki_content = {
    name: "WikiContent",
    pattern: "wiki/_pages/**/*.mdx",
    schema: s
        .object({
            /** 页面标题 */
            title: s.string().max(99),
            /** 页面描述 (可选) */
            description: s.string().optional(),
            /** 页面元数据 */
            metadata: s.metadata().optional(),
            /** 页面排序 (可选, 默认 0) */
            order: s.number().default(0),
            /** 页面路径 */
            slug: s.path(),
            /** 页面摘要 */
            excerpt: s.excerpt().optional(),
            /** 页面是否没有任何子标题 */
            nosubtitle: s.boolean().default(false),
            /** 页面内容 (mdx 正文) */
            body: s.mdx(),
        })
        .transform((doc) => ({
            ...doc,
            slug: doc.slug.replace("wiki/_pages/", ""),
        })),
};
