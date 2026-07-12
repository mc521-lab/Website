<script setup lang="ts">
    import { computed } from "vue";
    import { data } from "@data/materials.data";
    import ShowcaseCard from "./ShowcaseCard.vue";

    const { materials } = data;

    const byType = computed(() => {
        const groups: Record<string, typeof materials> = {};
        for (const item of materials) {
            const key = item.type || "其他";
            groups[key] ??= [];
            groups[key].push(item);
        }
        return groups;
    });

    function imageUrl(path?: string): string | undefined {
        if (!path) return undefined;
        return `/wiki/itemwiki/${path}`;
    }
</script>

<template>
    <section class="showcase">
        <div v-for="(list, typeName) in byType" :key="typeName" class="group">
            <h2 class="group-title">{{ typeName }}</h2>
            <div class="grid">
                <ShowcaseCard
                    v-for="item in list"
                    :key="item.id"
                    class="card"
                    :title="item.name"
                    :badge="item.quality"
                    :image="imageUrl(item.image)"
                    icon="lucide:box">
                    <p class="card-desc">{{ item.description }}</p>
                    <div v-if="item.effect" class="meta-row">
                        <span class="meta-label">效果</span>
                        <span class="meta-value">{{ item.effect }}</span>
                    </div>
                    <div v-if="item.source" class="meta-row">
                        <span class="meta-label">来源</span>
                        <span class="meta-value">{{ item.source }}</span>
                    </div>
                </ShowcaseCard>
            </div>
        </div>
    </section>
</template>

<style scoped>
    .showcase {
        display: flex;
        flex-direction: column;
        gap: 32px;
    }
    .group-title {
        font-size: 1.25rem;
        margin-bottom: 16px;
        color: #1a1612;
    }
    .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
        gap: 14px;
    }
    .card {
        width: 100%;
    }
    .card-desc {
        font-size: 0.8125rem;
        color: #5c4d3d;
        line-height: 1.5;
        margin: 0;
        white-space: pre-line;
    }
    .meta-row {
        display: flex;
        gap: 8px;
        font-size: 0.8125rem;
        line-height: 1.5;
    }
    .meta-label {
        color: #7c6b55;
        flex-shrink: 0;
    }
    .meta-value {
        color: #1a1612;
    }
</style>
