<script setup lang="ts">
    import { computed, ref } from "vue";
    import { data } from "@data/weapon.data";
    import type { WikiEquipment } from "../../../types/wiki";
    import WeaponCard from "./WeaponCard.vue";
    import Icon from "../Icon.vue";

    const { jobs, weapons } = data;

    const selectedJob = ref<string>("all");

    const filteredWeapons = computed(() => {
        if (selectedJob.value === "all") return weapons;
        return weapons.filter((item: WikiEquipment) => item.jobId === selectedJob.value);
    });

    const byJob = computed(() => {
        const groups: Record<string, typeof weapons> = {};
        for (const item of filteredWeapons.value) {
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
        <div class="filter-bar">
            <div class="filter-group">
                <span class="filter-label">
                    <Icon name="lucide:user" :size="16" />
                    职业
                </span>
                <div class="filter-pills">
                    <button
                        class="filter-pill"
                        :class="{ active: selectedJob === 'all' }"
                        @click="selectedJob = 'all'">
                        全部
                    </button>
                    <button
                        v-for="job in jobs"
                        :key="job.id"
                        class="filter-pill"
                        :class="{ active: selectedJob === job.id }"
                        @click="selectedJob = job.id">
                        {{ job.name }}
                    </button>
                </div>
            </div>
        </div>
        <div v-for="(list, jobId) in byJob" :key="jobId" class="group">
            <h2 class="group-title">{{ jobMap[jobId] ?? jobId }}</h2>
            <div class="grid">
                <WeaponCard
                    v-for="item in list"
                    :key="item.id"
                    class="card"
                    :class="`job-${jobId}`"
                    :item="item" />
            </div>
        </div>
        <div v-if="Object.keys(byJob).length === 0" class="empty-state">
            <Icon name="lucide:search-x" :size="32" />
            <p>没有符合条件的武器</p>
        </div>
    </section>
</template>

<style scoped>
    .showcase {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .filter-bar {
        display: flex;
        flex-wrap: wrap;
        gap: 10px 20px;
        padding: 12px 14px;
        border-radius: var(--radius-xl);
        background: rgba(255, 250, 242, 0.95);
        border: 1px solid rgba(0, 0, 0, 0.08);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        margin-bottom: -32px;
    }

    .filter-group {
        display: flex;
        align-items: center;
        gap: 12px;
        flex-wrap: wrap;
    }

    .filter-label {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 0.9375rem;
        font-weight: 500;
        color: #5c4d3d;
        flex-shrink: 0;
    }

    .filter-pills {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
    }

    .filter-pill {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 36px;
        padding: 8px 16px;
        border-radius: 8px;
        border: 1px solid rgba(0, 0, 0, 0.08);
        background: rgba(255, 255, 255, 0.6);
        color: #5c4d3d;
        font-size: 0.875rem;
        font-weight: 500;
        cursor: pointer;
        transition:
            background 0.15s ease,
            color 0.15s ease,
            border-color 0.15s ease,
            box-shadow 0.15s ease;
    }

    .filter-pill:hover {
        background: rgba(255, 255, 255, 0.9);
        border-color: rgba(184, 114, 46, 0.4);
    }

    .filter-pill.active {
        background: rgba(184, 114, 46, 0.15);
        color: #1a1612;
        border-color: rgba(184, 114, 46, 0.5);
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4);
    }

    .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
        padding: 48px 16px;
        color: #7c6b55;
        font-size: 0.9375rem;
    }

    .empty-state p {
        margin: 0;
    }
    .group-title {
        font-size: 1.25rem;
        margin-top: 8px;
        margin-bottom: 16px;
        color: #1a1612;
    }
    .grid {
        display: grid;
        grid-template-columns: repeat(5, minmax(0, 1fr));
        gap: 12px;
    }
    .card {
        width: 100%;
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
