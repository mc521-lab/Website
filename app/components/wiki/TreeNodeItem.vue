<script setup lang="ts">
    import type { ITreeData } from "~/types";

    const props = defineProps<{ treeData: Array<ITreeData> }>();
    const checkboxStates = reactive<Record<string, boolean>>({});

    const handleCheckboxChange = (e: Event, node: ITreeData) => {
        const target = e.target as HTMLInputElement;
        checkboxStates[node.title] = target.checked;
        localStorage.setItem(`wiki-checkbox-${node.title}`, target.checked ? "1" : "0");
    };

    onBeforeMount(() => {
        props.treeData.forEach((node) => {
            checkboxStates[node.title] = localStorage.getItem(`wiki-checkbox-${node.title}`) === "1";
            node.children?.forEach((child) => {
                checkboxStates[child.title] = localStorage.getItem(`wiki-checkbox-${child.title}`) === "1";
            });
        });
    });

    const TitleMap: Record<string, string> = {
        "xin-shou-jiao-cheng": "⭐ 纯新手必看教程",
        "gui-zhang-zhi-du": "📜 服务器规章",
    };
</script>

<template>
    <section v-for="(node, index) in treeData" :key="index" class="last:-mb-2">
        <div class="collapse collapse-arrow bg-base-100/25 border-base-300 border mb-2" v-if="node.children">
            <input type="checkbox" v-model="checkboxStates[node.title]" @change="(e) => handleCheckboxChange(e, node)" />
            <div class="collapse-title font-semibold after:start-5 after:end-auto after:-translate-y-[1.5px] pe-4 ps-12 text-neutral-content">{{ TitleMap[node.title] }}</div>
            <div class="collapse-content text-sm">
                <WikiTreeNodeItem :treeData="node.children" />
            </div>
        </div>
        <!-- <NuxtLink
            v-else
            :href="`/wiki/w/${node.slug}`"
            class="block py-2 bg-base-200/50 hover:bg-base-200 dark:bg-base-100/25 dark:hover:bg-base-100/75 text-base-content transition-all duration-150 ease-in-out rounded-md pl-2">
            {{ node.title }}
        </NuxtLink> -->
        <NuxtLink
            v-else
            :href="`/wiki/w/${node.slug}`"
            class="link link-hover underline-offset-4 text-base">
            {{ node.title }}
        </NuxtLink>
    </section>
</template>
