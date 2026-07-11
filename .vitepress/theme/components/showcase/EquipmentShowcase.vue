<script setup lang="ts">
    import { computed } from "vue";
    import { data } from "@data/equipment.data";
    import ShowcaseCard from "./ShowcaseCard.vue";
    import Icon from "../Icon.vue";

    const { jobs, equipments } = data;

    interface SetGroup {
        setId: string;
        setName: string;
        quality: string;
        items: typeof equipments;
        effects: (typeof equipments)[number]["setEffects"];
    }

    const byJob = computed(() => {
        const groups: Record<string, SetGroup[]> = {};
        for (const item of equipments) {
            groups[item.jobId] ??= [];
            let setGroup = groups[item.jobId].find((g) => g.setId === item.setId);
            if (!setGroup) {
                setGroup = {
                    setId: item.setId,
                    setName: item.setName,
                    quality: item.quality,
                    items: [],
                    effects: item.setEffects,
                };
                groups[item.jobId].push(setGroup);
            }
            setGroup.items.push(item);
        }
        // Sort by quality tier: D < C < B < A < S
        const qualityOrder: Record<string, number> = { D: 0, C: 1, B: 2, A: 3, S: 4 };
        for (const jobGroups of Object.values(groups)) {
            jobGroups.sort((a, b) => (qualityOrder[a.quality] ?? 99) - (qualityOrder[b.quality] ?? 99));
        }
        return groups;
    });

    const jobMap = computed(() => {
        const map: Record<string, string> = {};
        for (const job of jobs) {
            map[job.id] = job.name;
        }
        return map;
    });
</script>

<template>
    <section class="showcase">
        <div v-for="(sets, jobId) in byJob" :key="jobId" class="job-group">
            <h2 class="group-title">{{ jobMap[jobId] ?? jobId }}</h2>
            <div class="items-grid">
                <template v-for="set in sets" :key="set.setId">
                    <ShowcaseCard
                        v-for="item in set.items"
                        :key="item.id"
                        class="card"
                        :class="`job-${jobId}`"
                        :title="item.name"
                        icon="lucide:shield">
                        <template #badge>
                            <div class="badges">
                                <span class="badge">{{ item.slotName }}</span>
                                <span class="badge quality">{{ item.quality }}</span>
                            </div>
                        </template>
                        <div class="stats">
                            <div v-for="stat in item.stats" :key="stat.id" class="stat">
                                <span class="stat-name">{{ stat.name }}</span>
                                <span class="stat-value">{{ stat.value }}{{ stat.unit ?? "" }}</span>
                            </div>
                        </div>
                        <div class="slots">
                            <span>附魔槽 {{ item.enchantSlots }}</span>
                            <span>宝石槽 {{ item.gemSlots }}</span>
                        </div>
                    </ShowcaseCard>
                    <div
                        v-if="Object.keys(set.effects).length"
                        :key="`${set.setId}-effects`"
                        class="set-effects-bar"
                        :class="`job-${jobId}`">
                        <div class="set-effects-label">
                            <Icon name="lucide:sparkles" :size="18" />
                            <span>套装效果</span>
                        </div>
                        <div class="set-effects-pills">
                            <div v-for="(effects, count) in set.effects" :key="count" class="set-effect-pill">
                                <span class="set-effect-count">{{ count }} 件套</span>
                                <span v-for="effect in effects" :key="effect.id" class="set-effect-value">
                                    {{ effect.name }} {{ effect.value > 0 ? "+" : "" }}{{ effect.value }}{{ effect.unit ?? "" }}
                                </span>
                            </div>
                        </div>
                    </div>
                </template>
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
    .items-grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 10px;
    }
    .card {
        --card-base: rgba(255, 255, 255, 0.72);
        width: 100%;
    }
    .card.job-zhanshi {
        --card-base: color-mix(in srgb, var(--job-zhanshi) 5%, rgba(255, 255, 255, 0.72));
    }
    .card.job-sheshou {
        --card-base: color-mix(in srgb, var(--job-sheshou) 5%, rgba(255, 255, 255, 0.72));
    }
    .card.job-mushi {
        --card-base: color-mix(in srgb, var(--job-mushi) 5%, rgba(255, 255, 255, 0.72));
    }
    .card.job-cike {
        --card-base: color-mix(in srgb, var(--job-cike) 5%, rgba(255, 255, 255, 0.72));
    }
    .card.job-fashi {
        --card-base: color-mix(in srgb, var(--job-fashi) 5%, rgba(255, 255, 255, 0.72));
    }
    .set-effects-bar {
        grid-column: 1 / -1;
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 10px 14px;
        border-radius: 10px;
        background: rgba(255, 255, 255, 0.72);
        border: 1px solid rgba(0, 0, 0, 0.08);
    }
    .set-effects-bar.job-zhanshi {
        background: color-mix(in srgb, var(--job-zhanshi) 5%, rgba(255, 255, 255, 0.72));
    }
    .set-effects-bar.job-sheshou {
        background: color-mix(in srgb, var(--job-sheshou) 5%, rgba(255, 255, 255, 0.72));
    }
    .set-effects-bar.job-mushi {
        background: color-mix(in srgb, var(--job-mushi) 5%, rgba(255, 255, 255, 0.72));
    }
    .set-effects-bar.job-cike {
        background: color-mix(in srgb, var(--job-cike) 5%, rgba(255, 255, 255, 0.72));
    }
    .set-effects-bar.job-fashi {
        background: color-mix(in srgb, var(--job-fashi) 5%, rgba(255, 255, 255, 0.72));
    }
    .set-effects-label {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.875rem;
        font-weight: 500;
        color: #5c4d3d;
        flex-shrink: 0;
    }
    .set-effects-pills {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        flex: 1;
        min-width: 0;
    }
    .set-effect-pill {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 6px 10px;
        padding: 6px 12px;
        border-radius: 8px;
        background: rgba(0, 0, 0, 0.55);
        color: #f5f0e8;
        font-size: 0.8125rem;
    }
    .set-effect-count {
        font-weight: 600;
        color: #e8d5c0;
        white-space: nowrap;
    }
    .set-effect-value {
        white-space: nowrap;
    }
    @media (max-width: 1100px) {
        .items-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }
    }
    @media (max-width: 640px) {
        .set-effects-bar {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
        }
    }
    @media (max-width: 480px) {
        .items-grid {
            grid-template-columns: 1fr;
        }
    }
    .badges {
        display: flex;
        gap: 5px;
        flex-shrink: 0;
    }
    :deep(.badge) {
        font-size: 0.75rem;
        padding: 2px 7px;
        border-radius: 999px;
        background: rgba(0, 0, 0, 0.05);
        color: #5c4d3d;
        white-space: nowrap;
    }
    :deep(.badge.quality) {
        background: rgba(212, 137, 58, 0.12);
        color: #b8722e;
    }
    .stats {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }
    .stat {
        display: flex;
        justify-content: space-between;
        gap: 8px;
        font-size: 0.75rem;
        padding: 5px 8px;
        border-radius: 6px;
        background: rgba(0, 0, 0, 0.04);
    }
    .stat-name {
        color: #7c6b55;
    }
    .stat-value {
        color: #1a1612;
        font-weight: 500;
        text-align: right;
        flex-shrink: 0;
    }
    .slots {
        display: flex;
        gap: 10px;
        font-size: 0.75rem;
        color: #7c6b55;
        margin-top: auto;
        padding-top: 6px;
    }
</style>
