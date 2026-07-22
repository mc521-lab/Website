<script setup lang="ts">
    import { computed, ref } from "vue";
    import { data } from "@data/materials.data";
    import type { WikiMaterial } from "../../../types/wiki";
    import MaterialCard from "./MaterialCard.vue";
    import Icon from "../Icon.vue";

    const { materials } = data;

    const searchQuery = ref("");
    const selectedType = ref<string>("all");
    const selectedQuality = ref<string>("all");

    const QUALITY_ORDER = ["D", "C", "B", "A", "S"];

    const typeOptions = computed(() => {
        const types = new Set<string>();
        for (const item of materials) {
            if (item.type) types.add(item.type);
        }
        return Array.from(types).sort();
    });

    const qualityOptions = computed(() => {
        const qualities = new Set<string>();
        for (const item of materials) {
            if (item.quality) qualities.add(item.quality);
        }
        return Array.from(qualities).sort((a, b) => QUALITY_ORDER.indexOf(a) - QUALITY_ORDER.indexOf(b));
    });

    const filteredMaterials = computed(() => {
        const query = searchQuery.value.trim().toLowerCase();
        return materials.filter((item: WikiMaterial) => {
            const typeMatch = selectedType.value === "all" || item.type === selectedType.value;
            const qualityMatch = selectedQuality.value === "all" || item.quality === selectedQuality.value;
            const searchMatch =
                !query ||
                item.name.toLowerCase().includes(query) ||
                item.id.toLowerCase().includes(query) ||
                item.type.toLowerCase().includes(query);
            return typeMatch && qualityMatch && searchMatch;
        });
    });

    const byType = computed(() => {
        const groups: Record<string, typeof materials> = {};
        for (const item of filteredMaterials.value) {
            const key = item.type || "其他";
            groups[key] ??= [];
            groups[key].push(item);
        }
        return groups;
    });

    const typeOrder = computed(() => {
        const preferred = ["材料", "货币", "宠食", "道具"];
        const present = Object.keys(byType.value);
        return preferred.filter((t) => present.includes(t)).concat(present.filter((t) => !preferred.includes(t)));
    });
</script>

<template>
    <section class="showcase">
        <div class="filter-bar">
            <div class="filter-group filter-search">
                <Icon name="lucide:search" :size="16" class="search-icon" />
                <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="搜索名称、ID 或类型..."
                    class="search-input" />
            </div>
            <div class="filter-row">
                <div class="filter-group">
                    <span class="filter-label">
                        <Icon name="lucide:tag" :size="16" />
                        类型
                    </span>
                    <div class="filter-pills">
                        <button
                            class="filter-pill"
                            :class="{ active: selectedType === 'all' }"
                            @click="selectedType = 'all'">
                            全部
                        </button>
                        <button
                            v-for="type in typeOptions"
                            :key="type"
                            class="filter-pill"
                            :class="{ active: selectedType === type }"
                            @click="selectedType = type">
                            {{ type }}
                        </button>
                    </div>
                </div>
                <div class="filter-group">
                    <span class="filter-label">
                        <Icon name="lucide:award" :size="16" />
                        品质
                    </span>
                    <div class="filter-pills">
                        <button
                            class="filter-pill"
                            :class="{ active: selectedQuality === 'all' }"
                            @click="selectedQuality = 'all'">
                            全部
                        </button>
                        <button
                            v-for="quality in qualityOptions"
                            :key="quality"
                            class="filter-pill quality"
                            :class="[`quality-${quality}`, { active: selectedQuality === quality }]"
                            @click="selectedQuality = quality">
                            <span class="pill-text">{{ quality }}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div v-for="type in typeOrder" :key="type" class="group">
            <h2 class="group-title">{{ type }}</h2>
            <div class="grid">
                <MaterialCard v-for="item in byType[type]" :key="item.id" :item="item" />
            </div>
        </div>

        <div v-if="Object.keys(byType).length === 0" class="empty-state">
            <Icon name="lucide:search-x" :size="32" />
            <p>没有符合条件的材料</p>
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
        flex-direction: column;
        gap: 12px;
        padding: 12px 14px;
        border-radius: var(--radius-xl);
        background: rgba(255, 250, 242, 0.95);
        border: 1px solid rgba(0, 0, 0, 0.08);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        margin-bottom: -32px;
    }

    .filter-row {
        display: flex;
        flex-wrap: wrap;
        gap: 10px 20px;
    }

    .filter-group {
        display: flex;
        align-items: center;
        gap: 12px;
        flex-wrap: wrap;
    }

    .filter-search {
        width: 100%;
        position: relative;
    }

    .search-icon {
        position: absolute;
        left: 12px;
        color: #7c6b55;
    }

    .search-input {
        width: 100%;
        padding: 8px 12px 8px 36px;
        border-radius: 8px;
        border: 1px solid rgba(0, 0, 0, 0.08);
        background: rgba(255, 255, 255, 0.6);
        color: #1a1612;
        font-size: 0.875rem;
        outline: none;
        transition:
            background 0.15s ease,
            border-color 0.15s ease;
    }

    .search-input::placeholder {
        color: #9c8b75;
    }

    .search-input:focus {
        background: rgba(255, 255, 255, 0.9);
        border-color: rgba(184, 114, 46, 0.4);
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
        gap: 8px;
    }

    .filter-pill {
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

    .filter-pill.quality {
        width: 36px;
        height: 36px;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 6px;
        transform: rotate(45deg);
    }

    .filter-pill.quality .pill-text {
        transform: rotate(-45deg);
        font-size: 0.8125rem;
        font-weight: 700;
    }

    .filter-pill.quality.quality-D.active {
        background: linear-gradient(135deg, #b0b5bd 0%, #7a828a 100%);
        color: #ffffff;
        border-color: transparent;
        text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
    }
    .filter-pill.quality.quality-C.active {
        background: linear-gradient(135deg, #e8e4cc 0%, #c4c0a8 100%);
        color: #5c4d3d;
        border-color: transparent;
        text-shadow: 0 1px 0 rgba(255, 255, 255, 0.4);
    }
    .filter-pill.quality.quality-B.active {
        background: linear-gradient(135deg, #d48c4a 0%, #8f5a26 100%);
        color: #ffffff;
        border-color: transparent;
        text-shadow: 0 1px 1px rgba(0, 0, 0, 0.25);
    }
    .filter-pill.quality.quality-A.active {
        background: linear-gradient(135deg, #e8e8e8 0%, #a8a8a8 100%);
        color: #1a1612;
        border-color: transparent;
        text-shadow: 0 1px 0 rgba(255, 255, 255, 0.35);
    }
    .filter-pill.quality.quality-S.active {
        background: linear-gradient(135deg, #f4e08a 0%, #d4af37 100%);
        color: #1a1612;
        border-color: transparent;
        text-shadow: 0 1px 0 rgba(255, 255, 255, 0.35);
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
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 14px;
    }

    @media (max-width: 1100px) {
        .grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }
    }

    @media (max-width: 640px) {
        .filter-row {
            flex-direction: column;
            align-items: flex-start;
        }
    }

    @media (max-width: 480px) {
        .grid {
            grid-template-columns: 1fr;
        }
    }
</style>
