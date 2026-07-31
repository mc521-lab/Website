import { s } from "velite";

export const tools_navigation = {
    name: "ToolsNavigation",
    pattern: "tools/_navigation/config.yml",
    schema: s
        .record(
            s.object({
                /** 标题 */
                title: s.string(),
                /** 图标 (可选, Iconify 图标) */
                icon: s.string().optional(),
                /** 排序 (可选, 默认 0) */
                order: s.number().default(0),
                /** 路径 */
                href: s.string(),
            })
        )
        .transform((obj) => Object.values(obj)),
};

