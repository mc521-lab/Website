<script setup lang="ts">
    import { computed } from "vue";
    import { data } from "@data/tools.data";

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
        return categories.find((c) => c.id === id)?.name ?? id;
    }

    function categoryIcon(id: string): string {
        return categories.find((c) => c.id === id)?.icon ?? "🔧";
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
                <article v-for="tool in list" :key="tool.id" class="card">
                    <header class="card-header">
                        <h3 class="card-title">{{ tool.name }}</h3>
                        <span v-if="tool.trial" class="badge trial">体验版</span>
                        <span v-else-if="tool.unbreakable" class="badge permanent">无限耐久</span>
                    </header>
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
                </article>
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
        background: rgba(255, 255, 255, 0.72);
        border: 1px solid rgba(0, 0, 0, 0.08);
        border-radius: 12px;
        padding: 14px;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
    }
    .card-header {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 10px;
    }
    .card-title {
        font-size: 0.9375rem;
        margin: 0;
        color: #1a1612;
        flex: 1;
    }
    .badge {
        font-size: 0.75rem;
        padding: 2px 7px;
        border-radius: 999px;
        border: 1px solid;
        white-space: nowrap;
    }
    .badge.permanent {
        background: rgba(59, 130, 246, 0.1);
        color: #2563eb;
        border-color: rgba(59, 130, 246, 0.3);
    }
    .badge.trial {
        background: rgba(245, 158, 11, 0.1);
        color: #b45309;
        border-color: rgba(245, 158, 11, 0.3);
    }
    .card-desc {
        font-size: 0.875rem;
        color: #5c4d3d;
        line-height: 1.5;
        margin-bottom: 12px;
    }
    .enchants {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-bottom: 12px;
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
