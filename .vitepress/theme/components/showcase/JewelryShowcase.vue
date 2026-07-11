<script setup lang="ts">
    import { computed } from "vue";
    import { data } from "@data/jewelries.data";
    import type { WikiJewelryFeatureValue } from "../../../types/wiki";
    import ShowcaseCard from "./ShowcaseCard.vue";

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

    function formatFeatureValues(feature: (typeof jewelries)[number]["features"][number], isTreasure: boolean): string {
        if (isTreasure) {
            return feature.values.map((v: WikiJewelryFeatureValue) => `${v.name} ${formatValue(v.value)}`).join(" / ");
        }
        return feature.values.map((v: WikiJewelryFeatureValue) => formatValue(v.value)).join(" / ");
    }
</script>

<template>
    <section class="showcase">
        <div v-for="(list, jobId) in byJob" :key="jobId" class="group">
            <h2 class="group-title" :class="`job-${jobId}`">
                {{ jobMap[jobId] ?? jobId }}
            </h2>
            <div class="grid">
                <ShowcaseCard
                    v-for="item in list"
                    :key="item.id"
                    class="card"
                    :class="[`job-${jobId}`, { treasure: item.isTreasure }]"
                    :title="item.name"
                    :badge="item.slotType"
                    icon="lucide:gem">
                    <div v-for="feature in item.features" :key="feature.id" class="stat">
                        <span class="stat-name">{{ feature.name }}</span>
                        <span class="stat-value">{{ formatFeatureValues(feature, item.isTreasure) }}</span>
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
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 10px;
    }
    @media (max-width: 900px) {
        .grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }
    }
    @media (max-width: 480px) {
        .grid {
            grid-template-columns: 1fr;
        }
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
    .card.treasure {
        border-color: rgba(184, 114, 46, 0.55);
        box-shadow: 0 1px 4px rgba(184, 114, 46, 0.1);
    }
    .stat {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        gap: 2px 8px;
        font-size: 0.75rem;
        padding: 5px 8px;
        border-radius: 6px;
        background: rgba(0, 0, 0, 0.04);
    }
    .stat-name {
        color: #7c6b55;
        flex-shrink: 0;
    }
    .stat-value {
        color: #1a1612;
        font-weight: 500;
        text-align: right;
        min-width: 0;
        word-break: break-word;
    }
</style>
