import { defineCollection, defineContentConfig, z } from "@nuxt/content";

export default defineContentConfig({
    collections: {
        wiki: defineCollection({
            // 匹配 content/wiki 下所有文件，包括多级目录
            type: "page",
            source: "wiki/**/*.md",
            schema: z.object({
                // 路径
                slug: z.string(),
                // 标题
                title: z.string(),
                // 索引
                index: z.number(),
            }),
        }),
    },
});
