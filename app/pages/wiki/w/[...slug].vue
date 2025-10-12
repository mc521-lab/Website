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

    onMounted(() => {
        const proseEl = document.getElementById("wiki-content");
        if (!proseEl) return;
        proseEl.querySelectorAll("code").forEach((element) => {
            element.style.cursor = "pointer";
            element.onclick = () => {
                if (!element.textContent) return;
                copy(element.textContent);
            };
        });
    });
</script>

<template>
    <div class="hero min-h-screen">
        <div class="hero-overlay"></div>
        <div class="hero-content text-neutral-content text-left w-full max-w-full mt-22 lg:mt-18">
            <section class="hidden lg:grid lg:grid-cols-12 lg:gap-x-8 w-full lg:px-8">
                <section class="col-span-3">
                    <ScrollView width="100%" height="80vh" class="overflow-y-auto">
                        <WikiTreeNodeItem :treeData="treeData" />
                    </ScrollView>
                </section>

                <section class="col-span-7 w-full font-no-pixel">
                    <ScrollView width="100%" height="85vh" class="overflow-y-auto">
                        <h1 class="text-5xl text-neutral-content font-bold mb-6 pb-4 border-b-neutral-content/20 border-b-1">{{ data?.title }}</h1>
                        <ContentRenderer v-if="data" :value="data" class="prose max-w-full w-full" id="wiki-content" />
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
                                class="opacity-50 hover:opacity-100 hover:underline underline-offset-5 transition-all duration-150 ease-in-out cursor-pointer"
                                @click="smoothScrollTo(item.id)">
                                {{ item.text }}
                            </li>
                        </ul>
                    </div>
                </section>
            </section>
            <section class="w-full font-no-pixel lg:hidden">
                <h1 class="text-3xl text-neutral-content font-bold mb-6 pb-4 border-b-neutral-content/20 border-b-1">{{ data?.title }}</h1>
                <ContentRenderer v-if="data" :value="data" class="prose max-w-full w-full" id="wiki-content" />
            </section>
        </div>
    </div>
</template>

<style scoped lang="scss">
    :deep(.prose) {
        *:not(code, pre, [style*="color:"]),
        li::marker {
            // Static Color instead of var(--color-base-content)
            // due to background need light foreground.
            color: var(--color-neutral-content);
        }

        p,
        li {
            font-size: 1.1rem !important;
        }

        p {
            margin-top: 0 !important;
            margin-bottom: 0 !important;
        }

        ol {
            margin-bottom: 0 !important;
        }

        b {
            font-weight: bolder !important;
        }

        a {
            text-underline-offset: 0.3rem;
        }

        hr {
            border-color: var(--color-neutral-content);
            margin-top: 1.5rem;
            margin-bottom: 1.5rem;
        }

        h1 > a,
        h2 > a,
        h3 > a,
        h4 > a,
        h5 > a,
        h6 > a {
            text-decoration: none !important;
        }

        h1 > a,
        h2 > a {
            font-weight: bolder !important;
        }
    }
</style>
