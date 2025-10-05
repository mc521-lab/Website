import { ref } from "vue";
import type { ITreeData } from "~/types";

export async function useWikiTree() {
    const items = await queryCollection("wiki").all();

    // 按 index 排序，假设 index 是数字类型
    items.sort((a, b) => (a.index ?? 0) - (b.index ?? 0));

    const root: ITreeData[] = [];
    const map = new Map<string, ITreeData>();

    items.forEach((item) => {
        const segments = item.slug.split("/");
        let currentLevel = root;
        let path = "";

        segments.forEach((seg: string, i: number) => {
            path = path ? `${path}/${seg}` : seg;
            let node = map.get(path);
            if (!node) {
                node = {
                    slug: path,
                    title: i === segments.length - 1 ? item.title : seg,
                    index: i === segments.length - 1 ? item.index : 0, // 保留叶子节点 index
                };
                map.set(path, node);
                currentLevel.push(node);
            }
            if (i < segments.length - 1) {
                if (!node.children) node.children = [];
                currentLevel = node.children;
            }
        });
    });

    // 对每个层级的 children 也按 index 排序
    function sortTree(nodes: ITreeData[]) {
        nodes.sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
        nodes.forEach((node) => node.children && sortTree(node.children));
    }
    sortTree(root);

    return ref(root);
}
