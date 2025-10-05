<script setup lang="ts">
    import { useRoute, useAsyncData, createError } from "#imports";
    import type { WikiCollectionItem } from "@nuxt/content";

    const route = useRoute();
    const slugArray = route.params.slug as string[];
    const slugPath = slugArray.join("/");
    const treeData = await useWikiTree();

    const { data } = await useAsyncData<WikiCollectionItem>(`wiki-${slugPath}`, async () => {
        const doc = await queryCollection("wiki").where("slug", "=", slugPath).first();
        if (!doc) throw createError({ statusCode: 404, statusMessage: "Not Found" });
        return doc;
    });

    // 生成 TOC
    import { computed } from "vue";
    const toc = computed(() => {
        if (!data.value) return [];
        // 解析 Markdown TOC
        return (data.value.body as any)?.toc || [];
    });

    function smoothScrollTo(id: string) {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    }
</script>

<template>
    <div class="hero min-h-screen">
        <div class="hero-overlay"></div>
        <div class="hero-content text-neutral-content text-left w-full max-w-full pt-4 lg:pt-32">
            <section class="grid grid-cols-12 gap-x-8 w-full px-8">
                <section class="col-span-3">
                    <ScrollView width="100%" height="80vh" class="overflow-y-auto">
                        <WikiTreeNodeItem :treeData="treeData" />
                    </ScrollView>
                </section>

                <section class="col-span-7 w-full">
                    <ScrollView width="100%" height="80vh" class="overflow-y-auto">
                        <h1 class="text-5xl font-bold mb-4">{{ data?.title }}</h1>
                        <div class="prose max-w-full w-full">
                            <ContentRenderer v-if="data" :value="data" />
                        </div>
                    </ScrollView>
                </section>

                <section class="col-span-2">
                    <div class="p-4">
                        <h2 class="text-2xl font-bold mb-2">目录</h2>
                        <div class="divider h-0"></div>
                        <ul class="flex flex-col gap-1">
                            <li
                                v-for="(item, index) in toc.links"
                                :key="index"
                                class="opacity-50 hover:opacity-100 hover:underline transition-all duration-150 ease-in-out cursor-pointer"
                                @click="smoothScrollTo(item.id)">
                                {{ item.text }}
                            </li>
                        </ul>
                    </div>
                </section>
            </section>
        </div>
    </div>
</template>

<style>
    h1 > a,
    h2 > a,
    h3 > a,
    h4 > a,
    h5 > a,
    h6 > a {
        text-decoration: none;
    }

    code {
        user-select: initial !important;
    }
</style>
