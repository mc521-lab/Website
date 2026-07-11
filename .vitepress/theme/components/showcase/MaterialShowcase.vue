<script setup lang="ts">
    import { computed } from "vue";
    import { data } from "@data/materials.data";

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
</script>

<template>
    <section class="showcase">
        <div v-for="(list, typeName) in byType" :key="typeName" class="group">
            <h2 class="group-title">{{ typeName }}</h2>
            <div class="grid">
                <article v-for="item in list" :key="item.id" class="card">
                    <header class="card-header">
                        <h3 class="card-title">{{ item.name }}</h3>
                        <span class="badge">{{ item.quality }}</span>
                    </header>
                    <p class="card-desc">{{ item.description }}</p>
                    <div v-if="item.effect" class="effect"><strong>效果：</strong>{{ item.effect }}</div>
                    <div v-if="item.source" class="source"><strong>来源：</strong>{{ item.source }}</div>
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
        font-size: 1.25rem;
        margin-bottom: 16px;
        color: #1a1612;
    }
    .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
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
        justify-content: space-between;
        gap: 10px;
        margin-bottom: 10px;
    }
    .card-title {
        font-size: 0.9375rem;
        margin: 0;
        color: #1a1612;
    }
    .badge {
        font-size: 0.75rem;
        padding: 2px 7px;
        border-radius: 999px;
        background: rgba(0, 0, 0, 0.05);
        color: #5c4d3d;
        white-space: nowrap;
    }
    .card-desc {
        font-size: 0.875rem;
        color: #5c4d3d;
        line-height: 1.5;
        margin-bottom: 12px;
        white-space: pre-line;
    }
    .effect,
    .source {
        font-size: 0.8125rem;
        line-height: 1.5;
        color: #1a1612;
    }
    .effect strong,
    .source strong {
        color: #7c6b55;
        font-weight: 500;
    }
    .effect {
        margin-bottom: 6px;
    }
</style>
