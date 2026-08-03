import { s } from "velite";

export const gallery_navigation = {
    name: "GalleryNavigation",
    pattern: "gallery/_navigation/**/*.yml",
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
