<script setup lang="ts">
    import { computed } from "vue";
    import { data } from "@data/equipment.data";
    import ShowcaseCard from "./ShowcaseCard.vue";

    const { jobs, weapons } = data;

    const byJob = computed(() => {
        const groups: Record<string, typeof weapons> = {};
        for (const item of weapons) {
            groups[item.jobId] ??= [];
            groups[item.jobId].push(item);
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
        <div v-for="(list, jobId) in byJob" :key="jobId" class="group">
            <h2 class="group-title">{{ jobMap[jobId] ?? jobId }}</h2>
            <div class="grid">
                <ShowcaseCard
                    v-for="item in list"
                    :key="item.id"
                    class="card"
                    :class="`job-${jobId}`"
                    :title="item.name"
                    :badge="item.quality"
                    icon="lucide:sword">
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
        grid-template-columns: repeat(5, minmax(0, 1fr));
        gap: 12px;
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
    :deep(.badge) {
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
        padding: 5px 6px;
        border-radius: 6px;
        background: rgba(0, 0, 0, 0.04);
    }
    .stat-name {
        color: #7c6b55;
    }
    .stat-value {
        color: #1a1612;
        font-weight: 500;
    }
    .slots {
        display: flex;
        gap: 10px;
        font-size: 0.75rem;
        color: #7c6b55;
        margin-top: auto;
        padding-top: 4px;
    }
    @media (max-width: 1200px) {
        .grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
        }
    }
    @media (max-width: 768px) {
        .grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }
    }
    @media (max-width: 480px) {
        .grid {
            grid-template-columns: 1fr;
        }
    }
</style>
