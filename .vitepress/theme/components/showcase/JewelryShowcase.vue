<script setup lang="ts">
    import { computed } from "vue";
    import { data } from "@data/jewelries.data";

    const { manifest, jewelries } = data;

    const byJob = computed(() => {
        const groups: Record<string, typeof jewelries> = {};
        for (const item of jewelries) {
            groups[item.jobId] ??= [];
            groups[item.jobId].push(item);
        }
        return groups;
    });

    const jobMap = computed(() => {
        const map: Record<string, string> = {};
        for (const job of manifest.metadata.jobEntries) {
            map[job.id] = job.name;
        }
        return map;
    });

    function formatValue(value: number[]): string {
        if (!Array.isArray(value)) return String(value);
        return value.join(" ~ ");
    }
</script>

<template>
    <section class="showcase">
        <div v-for="(list, jobId) in byJob" :key="jobId" class="group">
            <h2 class="group-title" :class="`job-${jobId}`">
                {{ jobMap[jobId] ?? jobId }}
            </h2>
            <div class="grid">
                <article v-for="item in list" :key="item.id" class="card" :class="{ treasure: item.isTreasure }">
                    <header class="card-header">
                        <h3 class="card-title">{{ item.name }}</h3>
                        <span class="badge">{{ item.slotType }}</span>
                    </header>
                    <div class="features">
                        <div v-for="feature in item.features" :key="feature.id" class="feature">
                            <div class="feature-name">{{ feature.name }}</div>
                            <div class="feature-values">
                                <span v-for="value in feature.values" :key="value.id" class="value-tag">
                                    {{ value.name }} {{ formatValue(value.value) }}
                                </span>
                            </div>
                        </div>
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
        padding-left: 12px;
        border-left: 4px solid;
        color: #1a1612;
    }
    .group-title.job-zhanshi {
        border-left-color: var(--job-zhanshi);
    }
    .group-title.job-sheshou {
        border-left-color: var(--job-sheshou);
    }
    .group-title.job-mushi {
        border-left-color: var(--job-mushi);
    }
    .group-title.job-cike {
        border-left-color: var(--job-cike);
    }
    .group-title.job-fashi {
        border-left-color: var(--job-fashi);
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
    .card.treasure {
        border-color: rgba(184, 114, 46, 0.55);
        box-shadow: 0 1px 4px rgba(184, 114, 46, 0.1);
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
    .features {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
    .feature {
        background: rgba(0, 0, 0, 0.04);
        border-radius: 8px;
        padding: 8px;
    }
    .feature-name {
        font-size: 0.75rem;
        color: #7c6b55;
        margin-bottom: 4px;
    }
    .feature-values {
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
    }
    .value-tag {
        font-size: 0.75rem;
        padding: 2px 7px;
        border-radius: 6px;
        background: rgba(255, 255, 255, 0.6);
        color: #1a1612;
    }
</style>
