<script setup lang="ts">
    import { computed } from "vue";
    import { data } from "@data/equipment.data";

    const { jobs, equipments } = data;

    interface SetGroup {
        setId: string;
        setName: string;
        quality: string;
        items: typeof equipments;
        effects: typeof equipments[number]["setEffects"];
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
                    <article v-for="item in set.items" :key="item.id" class="card" :class="`job-${jobId}`">
                        <header class="card-header">
                            <h3 class="card-title">{{ item.name }}</h3>
                            <div class="badges">
                                <span class="badge">{{ item.slotName }}</span>
                                <span class="badge quality">{{ item.quality }}</span>
                            </div>
                        </header>
                        <div class="stats">
                            <div v-for="stat in item.stats" :key="stat.id" class="stat">
                                <span class="stat-name">{{ stat.name }}</span>
                                <span class="stat-value"> {{ stat.value }}{{ stat.unit ?? "" }} </span>
                            </div>
                        </div>
                        <div class="slots">
                            <span>附魔槽 {{ item.enchantSlots }}</span>
                            <span>宝石槽 {{ item.gemSlots }}</span>
                        </div>
                    </article>
                    <article v-if="Object.keys(set.effects).length" class="card set-effects-card" :class="`job-${jobId}`">
                        <header class="card-header">
                            <h3 class="card-title">{{ set.setName }} 套装</h3>
                            <span class="badge quality">{{ set.quality }}</span>
                        </header>
                        <div class="stats">
                            <template v-for="(effects, count) in set.effects" :key="count">
                                <div v-for="effect in effects" :key="effect.id" class="stat">
                                    <span class="stat-name">{{ effect.name }}</span>
                                    <span class="stat-value"> {{ effect.value > 0 ? "+" : "" }}{{ effect.value }}{{ effect.unit ?? "" }} </span>
                                </div>
                            </template>
                        </div>
                        <div class="slots">
                            <span>{{ Object.keys(set.effects).join("、") }} 件套效果</span>
                        </div>
                    </article>
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
        grid-template-columns: repeat(5, minmax(0, 1fr));
        gap: 8px;
    }
    .card {
        --card-base: rgba(255, 255, 255, 0.72);
        display: flex;
        flex-direction: column;
        background: var(--card-base);
        border: 1px solid rgba(0, 0, 0, 0.08);
        border-radius: 12px;
        padding: 14px;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
    }
    .card.job-zhanshi {
        background: color-mix(in srgb, var(--job-zhanshi) 5%, var(--card-base));
    }
    .card.job-sheshou {
        background: color-mix(in srgb, var(--job-sheshou) 5%, var(--card-base));
    }
    .card.job-mushi {
        background: color-mix(in srgb, var(--job-mushi) 5%, var(--card-base));
    }
    .card.job-cike {
        background: color-mix(in srgb, var(--job-cike) 5%, var(--card-base));
    }
    .card.job-fashi {
        background: color-mix(in srgb, var(--job-fashi) 5%, var(--card-base));
    }
    @media (max-width: 1100px) {
        .items-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        .set-effects-card {
            grid-column: 1 / -1;
        }
    }
    @media (max-width: 480px) {
        .items-grid {
            grid-template-columns: 1fr;
        }
    }
    .card-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 10px;
        margin-bottom: 10px;
    }
    .card-title {
        font-size: 0.9375rem;
        margin: 0;
        color: #1a1612;
    }
    .badges {
        display: flex;
        gap: 5px;
        flex-shrink: 0;
        margin-top: 3.5px;
    }
    .badge {
        font-size: 0.75rem;
        padding: 2px 7px;
        border-radius: 999px;
        background: rgba(0, 0, 0, 0.05);
        color: #5c4d3d;
        white-space: nowrap;
    }
    .badge.quality {
        background: rgba(212, 137, 58, 0.12);
        color: #b8722e;
    }
    .stats {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 6px;
        margin-bottom: 10px;
    }
    .set-effects-card .stats {
        grid-template-columns: 1fr;
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
