import fs from "fs/promises";
import path from "path";
import yaml from "js-yaml";

export const WIKI_DIR = path.join(process.cwd(), "content", "wiki");
const CONFIG_FILENAME = "config.yml";

// 判断是否为开发环境
const isDev = process.env.NODE_ENV === "development";

export interface WikiItemConfig {
    title?: string;
    order?: number;
    hidden?: boolean;
}

export interface WikiDirConfig {
    title?: string;
    order?: number;
    expanded?: boolean; // 默认是否展开
    items?: Record<string, WikiItemConfig>;
}

// 缓存配置（仅在生产环境使用）
const configCache = new Map<string, WikiDirConfig>();

/**
 * 读取目录下的 config.yml 文件
 */
export async function loadDirConfig(dirPath: string): Promise<WikiDirConfig | null> {
    // 开发模式下禁用缓存，生产环境启用缓存
    if (!isDev && configCache.has(dirPath)) {
        return configCache.get(dirPath)!;
    }

    const configPath = path.join(dirPath, CONFIG_FILENAME);

    try {
        const content = await fs.readFile(configPath, "utf-8");
        const config = yaml.load(content) as WikiDirConfig;

        // 生产环境缓存配置
        if (!isDev) {
            configCache.set(dirPath, config);
        }

        return config;
    } catch {
        // 文件不存在或解析失败
        return null;
    }
}

/**
 * 清除配置缓存（用于开发环境热更新）
 */
export function clearConfigCache(): void {
    configCache.clear();
}

/**
 * 获取 wiki 根目录下的所有子目录（一级分类）
 */
export async function getWikiCategories(): Promise<
    Array<{
        folderName: string;
        config: WikiDirConfig | null;
    }>
> {
    const items = await fs.readdir(WIKI_DIR, { withFileTypes: true });
    const categories: Array<{ folderName: string; config: WikiDirConfig | null }> = [];

    for (const item of items) {
        if (item.isDirectory()) {
            const dirPath = path.join(WIKI_DIR, item.name);
            const config = await loadDirConfig(dirPath);
            categories.push({
                folderName: item.name,
                config,
            });
        }
    }

    return categories;
}

/**
 * 获取分类的显示标题
 */
export function getCategoryTitle(folderName: string, config: WikiDirConfig | null): string {
    if (config?.title) {
        return config.title;
    }
    // 默认：移除数字前缀，将连字符替换为空格，首字母大写
    return folderName
        .replace(/^\d+-/, "")
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * 获取分类的排序值
 */
export function getCategoryOrder(folderName: string, config: WikiDirConfig | null): number {
    if (config?.order !== undefined) {
        return config.order;
    }
    // 默认：从文件夹名提取数字前缀
    const match = folderName.match(/^(\d+)-/);
    return match ? parseInt(match[1], 10) : 999;
}

/**
 * 获取子项（文件或文件夹）的显示标题
 */
export function getItemTitle(itemName: string, parentConfig: WikiDirConfig | null): string {
    // 优先使用 config.yml 中的配置
    const itemConfig = parentConfig?.items?.[itemName];
    if (itemConfig?.title) {
        return itemConfig.title;
    }

    // 默认：移除数字前缀，将连字符替换为空格，首字母大写
    const baseName = itemName.replace(/\.mdx?$/, "");
    return baseName
        .replace(/^\d+-/, "")
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * 获取子项的排序值
 */
export function getItemOrder(itemName: string, parentConfig: WikiDirConfig | null): number {
    const itemConfig = parentConfig?.items?.[itemName];
    if (itemConfig?.order !== undefined) {
        return itemConfig.order;
    }
    // 默认：从文件名提取数字前缀
    const match = itemName.match(/^(\d+)-/);
    return match ? parseInt(match[1], 10) : 999;
}

/**
 * 检查子项是否被隐藏
 */
export function isItemHidden(itemName: string, parentConfig: WikiDirConfig | null): boolean {
    return parentConfig?.items?.[itemName]?.hidden === true;
}

/**
 * 获取分类是否默认展开
 */
export function isCategoryExpanded(config: WikiDirConfig | null): boolean {
    // 默认展开，除非明确设置为 false
    return config?.expanded !== false;
}

/**
 * 递归获取目录下的所有 markdown 文件
 */
export async function getAllMarkdownFiles(
    dir: string,
    parentSlug: string = ""
): Promise<
    Array<{
        filePath: string;
        slug: string;
        category: string;
    }>
> {
    const files: Array<{ filePath: string; slug: string; category: string }> = [];
    const items = await fs.readdir(dir, { withFileTypes: true });

    for (const item of items) {
        const fullPath = path.join(dir, item.name);

        if (item.isDirectory()) {
            // 递归获取子目录中的文件
            const subFiles = await getAllMarkdownFiles(fullPath, parentSlug ? `${parentSlug}/${item.name}` : item.name);
            files.push(...subFiles);
        } else if (item.name.endsWith(".mdx") || item.name.endsWith(".md")) {
            // 跳过 README.md
            if (item.name.toLowerCase() === "readme.md") continue;

            const slug = parentSlug ? `${parentSlug}/${item.name.replace(/\.mdx?$/, "")}` : item.name.replace(/\.mdx?$/, "");
            const category = parentSlug ? parentSlug.split("/")[0] : "";

            files.push({
                filePath: fullPath,
                slug,
                category,
            });
        }
    }

    return files;
}
