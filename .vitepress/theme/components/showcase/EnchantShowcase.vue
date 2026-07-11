<script setup lang="ts">
    import { computed } from "vue";
    import { data } from "@data/enchants.data";

    const { enchants } = data;

    const byType = computed(() => {
        const groups: Record<string, typeof enchants> = {};
        for (const enchant of enchants) {
            const key = enchant.typeName;
            groups[key] ??= [];
            groups[key].push(enchant);
        }
        return groups;
    });
</script>

<template>
    <section class="showcase">
        <div v-for="(list, typeName) in byType" :key="typeName" class="group">
            <h2 class="group-title">{{ typeName }}</h2>
            <div class="grid">
                <article v-for="enchant in list" :key="enchant.id" class="card">
                    <header class="card-header">
                        <h3 class="card-title">{{ enchant.displayName }}</h3>
                        <span class="badge" :style="{ borderColor: enchant.rarityColor }">
                            <span class="badge-dot" :style="{ backgroundColor: enchant.rarityColor }" />
                            {{ enchant.rarityName }}
                        </span>
                    </header>
                    <p class="card-desc">{{ enchant.description }}</p>
                    <dl class="meta-list">
                        <div class="meta-row">
                            <dt>最高等级</dt>
                            <dd>{{ enchant.maxLevel }}</dd>
                        </div>
                        <div class="meta-row">
                            <dt>适用</dt>
                            <dd>{{ enchant.targets.join("、") || "-" }}</dd>
                        </div>
                        <div v-if="enchant.conflicts.length" class="meta-row">
                            <dt>冲突</dt>
                            <dd>{{ enchant.conflicts.join("、") }}</dd>
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
        transition: border-color 0.2s ease;
    }
    .card:hover {
        border-color: rgba(184, 114, 46, 0.5);
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
        display: inline-flex;
        align-items: center;
        gap: 5px;
        font-size: 0.75rem;
        padding: 2px 7px;
        border-radius: 999px;
        border: 1px solid;
        color: #5c4d3d;
        background: rgba(0, 0, 0, 0.04);
        white-space: nowrap;
    }
    .badge-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        flex-shrink: 0;
    }
    .card-desc {
        font-size: 0.875rem;
        color: #5c4d3d;
        line-height: 1.5;
        margin-bottom: 12px;
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
        flex-shrink: 0;
    }
    .meta-row dd {
        margin: 0;
        color: #1a1612;
    }
</style>
