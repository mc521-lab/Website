<script setup lang="ts">
    import { computed } from "vue";
    import { data } from "@data/tools.data";
    import type { WikiToolCategory } from "../../../types/wiki";
    import ShowcaseCard from "./ShowcaseCard.vue";

    const { categories, tools } = data;

    const byCategory = computed(() => {
        const groups: Record<string, typeof tools> = {};
        for (const tool of tools) {
            groups[tool.category] ??= [];
            groups[tool.category].push(tool);
        }
        return groups;
    });

    function categoryName(id: string): string {
        return categories.find((c: WikiToolCategory) => c.id === id)?.name ?? id;
    }

    function categoryIcon(id: string): string {
        return categories.find((c: WikiToolCategory) => c.id === id)?.icon ?? "lucide:wrench";
    }

    function toolBadge(tool: (typeof tools)[number]): string | undefined {
        if (tool.trial) return "体验版";
        if (tool.unbreakable) return "无限耐久";
        return undefined;
    }
</script>

<template>
    <section class="showcase">
        <div v-for="(list, categoryId) in byCategory" :key="categoryId" class="group">
            <h2 class="group-title">
                <span class="icon">{{ categoryIcon(categoryId) }}</span>
                {{ categoryName(categoryId) }}
            </h2>
            <div class="grid">
                <ShowcaseCard
                    v-for="tool in list"
                    :key="tool.id"
                    class="card"
                    :title="tool.name"
                    :badge="toolBadge(tool)"
                    icon="lucide:wrench">
                    <p class="card-desc">{{ tool.description }}</p>
                    <div v-if="tool.enchants.length" class="enchants">
                        <span v-for="(ench, idx) in tool.enchants" :key="idx" class="ench-tag">
                            {{ ench.name }} {{ ench.level }}
                        </span>
                    </div>
                    <dl class="meta-list">
                        <div v-if="tool.maxDurability" class="meta-row">
                            <dt>耐久</dt>
                            <dd>{{ tool.maxDurability }}</dd>
                        </div>
                        <div v-if="tool.timeLimit" class="meta-row">
                            <dt>时限</dt>
                            <dd>{{ tool.timeLimit }}</dd>
                        </div>
                    </dl>
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
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 1.25rem;
        margin-bottom: 16px;
        color: #1a1612;
    }
    .icon {
        font-size: 1.1rem;
    }
    .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 14px;
    }
    .card {
        width: 100%;
    }
    :deep(.badge.trial) {
        background: rgba(245, 158, 11, 0.1);
        color: #b45309;
        border-color: rgba(245, 158, 11, 0.3);
    }
    :deep(.badge.permanent) {
        background: rgba(59, 130, 246, 0.1);
        color: #2563eb;
        border-color: rgba(59, 130, 246, 0.3);
    }
    .card-desc {
        font-size: 0.8125rem;
        color: #5c4d3d;
        line-height: 1.5;
        margin: 0;
    }
    .enchants {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
    }
    .ench-tag {
        font-size: 0.75rem;
        padding: 2px 7px;
        border-radius: 6px;
        background: rgba(0, 0, 0, 0.04);
        color: #1a1612;
    }
    .meta-list {
        display: flex;
        flex-direction: column;
        gap: 6px;
        margin: 0;
    }
    .meta-row {
        display: flex;
        gap: 8px;
        font-size: 0.8125rem;
    }
    .meta-row dt {
        color: #7c6b55;
    }
    .meta-row dd {
        margin: 0;
        color: #1a1612;
    }
</style>
