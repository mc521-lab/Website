<script setup lang="ts">
    import { computed } from "vue";
    import { data } from "@data/equipment.data";

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
                <article v-for="item in list" :key="item.id" class="card" :class="`job-${jobId}`">
                    <header class="card-header">
                        <h3 class="card-title">{{ item.name }}</h3>
                        <span class="badge quality">{{ item.quality }}</span>
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
        background: var(--card-base);
        border: 1px solid rgba(0, 0, 0, 0.08);
        border-radius: 12px;
        padding: 12px;
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
    .card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        margin-bottom: 10px;
    }
    .card-title {
        font-size: 0.9375rem;
        margin: 0;
        color: #1a1612;
    }
    .badge {
        font-size: 0.75rem;
        padding: 2px 8px;
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
    .stat {
        display: flex;
        justify-content: space-between;
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
