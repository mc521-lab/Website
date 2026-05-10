import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { codeToHtml } from "shiki";
import {
    loadDirConfig,
    getCategoryTitle,
    getCategoryOrder,
    getItemTitle,
    getItemOrder,
    isItemHidden,
    isCategoryExpanded,
    WIKI_DIR,
} from "./wiki-config";

const EXTENSION = ".mdx";

export interface WikiDoc {
    slug: string;
    title: string;
    category: string;
    categoryFolder: string;
    content: string;
    frontmatter: Record<string, unknown>;
    order: number;
}

// 从文件路径提取 slug
function getSlug(filePath: string): string {
    const relativePath = path.relative(WIKI_DIR, filePath);
    return relativePath.replace(/\\/g, "/").replace(EXTENSION, "");
}

// 递归获取所有 markdown 文件
async function getAllMarkdownFiles(dir: string): Promise<string[]> {
    const files: string[] = [];
    const items = await fs.readdir(dir, { withFileTypes: true });

    for (const item of items) {
        const fullPath = path.join(dir, item.name);

        if (item.isDirectory()) {
            files.push(...(await getAllMarkdownFiles(fullPath)));
        } else if (item.name.endsWith(EXTENSION) || item.name.endsWith(".md")) {
            // 跳过 README.md
            if (item.name.toLowerCase() === "readme.md") continue;
            files.push(fullPath);
        }
    }

    return files;
}

// 获取所有 wiki 文档
export async function getAllWikis(): Promise<WikiDoc[]> {
    const files = await getAllMarkdownFiles(WIKI_DIR);

    const wikis = await Promise.all(
        files.map(async (file) => {
            const slug = getSlug(file);
            const raw = await fs.readFile(file, "utf-8");
            const { data, content } = matter(raw);

            // 解析 slug 获取分类文件夹和文件名
            const slugParts = slug.split("/");
            const categoryFolder = slugParts[0];
            const fileName = slugParts[slugParts.length - 1] + EXTENSION;

            // 加载分类配置
            const categoryPath = path.join(WIKI_DIR, categoryFolder);
            const categoryConfig = await loadDirConfig(categoryPath);

            // 获取标题和排序（只使用 config.yml 中的配置）
            const title = getItemTitle(fileName, categoryConfig);
            const order = getItemOrder(fileName, categoryConfig);
            const categoryTitle = getCategoryTitle(categoryFolder, categoryConfig);

            return {
                slug,
                title,
                category: categoryTitle,
                categoryFolder,
                content,
                frontmatter: data,
                order,
            };
        })
    );

    return wikis;
}

// 根据 slug 获取单个文档
export async function getWikiBySlug(slug: string): Promise<WikiDoc | null> {
    const filePath = path.join(WIKI_DIR, `${slug}${EXTENSION}`);

    try {
        const raw = await fs.readFile(filePath, "utf-8");
        const { data, content } = matter(raw);

        // 解析 slug 获取分类文件夹和文件名
        const slugParts = slug.split("/");
        const categoryFolder = slugParts[0];
        const fileName = slugParts[slugParts.length - 1] + EXTENSION;

        // 加载分类配置
        const categoryPath = path.join(WIKI_DIR, categoryFolder);
        const categoryConfig = await loadDirConfig(categoryPath);

        // 获取标题和排序（只使用 config.yml 中的配置）
        const title = getItemTitle(fileName, categoryConfig);
        const order = getItemOrder(fileName, categoryConfig);
        const categoryTitle = getCategoryTitle(categoryFolder, categoryConfig);

        return {
            slug,
            title,
            category: categoryTitle,
            categoryFolder,
            content,
            frontmatter: data,
            order,
        };
    } catch {
        return null;
    }
}

// 按分类组织文档
export async function getWikisByCategory(): Promise<{
    grouped: Record<string, WikiDoc[]>;
    sortedCategories: Array<{
        folderName: string;
        title: string;
        order: number;
        expanded: boolean;
    }>;
}> {
    const wikis = await getAllWikis();
    const grouped: Record<string, WikiDoc[]> = {};

    // 按分类文件夹分组
    for (const wiki of wikis) {
        const key = wiki.categoryFolder;
        if (!grouped[key]) {
            grouped[key] = [];
        }
        grouped[key].push(wiki);
    }

    // 对每个分类内的文档排序
    Object.keys(grouped).forEach((key) => {
        grouped[key].sort((a, b) => a.order - b.order);
    });

    // 获取分类信息并排序
    const items = await fs.readdir(WIKI_DIR, { withFileTypes: true });
    const categories: Array<{
        folderName: string;
        title: string;
        order: number;
        expanded: boolean;
    }> = [];

    for (const item of items) {
        if (item.isDirectory()) {
            const dirPath = path.join(WIKI_DIR, item.name);
            const config = await loadDirConfig(dirPath);

            // 只包含有文档的分类
            if (grouped[item.name] && grouped[item.name].length > 0) {
                categories.push({
                    folderName: item.name,
                    title: getCategoryTitle(item.name, config),
                    order: getCategoryOrder(item.name, config),
                    expanded: isCategoryExpanded(config),
                });
            }
        }
    }

    // 按 order 排序分类
    categories.sort((a, b) => a.order - b.order);

    return { grouped, sortedCategories: categories };
}

// Shiki 代码高亮 - 返回处理后的 HTML 字符串
export async function highlightCode(code: string, lang: string = "text") {
    const html = await codeToHtml(code, {
        lang,
        theme: "github-dark",
    });

    // 移除 Shiki 添加的 style 属性和 script 标签
    // 这样可以避免 React 的 style prop 类型错误和 script 标签警告
    return (
        html
            // .replace(/style="[^"]*"/g, "")
            .replace(/class="shiki"/g, 'class="shiki font-mono"')
            .replace(/<script[^>]*>[\s\S]*?<\/script>/g, "")
    );
}
