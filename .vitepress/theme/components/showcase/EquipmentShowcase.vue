<script setup lang="ts">
    import { computed, ref } from "vue";
    import { data } from "@data/armor.data";
    import EquipmentCard from "./EquipmentCard.vue";
    import Icon from "../Icon.vue";

    const { jobs, armors } = data;

    const selectedJob = ref<string>("all");
    const selectedQuality = ref<string>("all");

    interface SetGroup {
        setId: string;
        setName: string;
        quality: string;
        items: typeof armors;
        effects: (typeof armors)[number]["setEffects"];
    }

    const qualityOptions = computed(() => {
        const qualities = new Set<string>();
        for (const item of armors) {
            qualities.add(item.quality);
        }
        const order = ["D", "C", "B", "A", "S"];
        return Array.from(qualities).sort((a, b) => order.indexOf(a) - order.indexOf(b));
    });

    const filteredArmors = computed(() => {
        return armors.filter((item: (typeof armors)[number]) => {
            const jobMatch = selectedJob.value === "all" || item.jobId === selectedJob.value;
            const qualityMatch = selectedQuality.value === "all" || item.quality === selectedQuality.value;
            return jobMatch && qualityMatch;
        });
    });

    const byJob = computed(() => {
        const groups: Record<string, SetGroup[]> = {};
        for (const item of filteredArmors.value) {
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

    function setEffectIcon(name: string) {
        switch (name) {
            case "护甲数值":
                return "lucide:shield";
            case "法力上限":
                return "lucide:droplets";
            case "盔甲韧性":
                return "lucide:shield-check";
            case "耐力上限":
            case "生命上限":
                return "lucide:heart";
            case "额外生命":
                return "lucide:heart-plus";
            case "闪避率":
                return "lucide:wind";
            case "防御减伤":
                return "lucide:shield-minus";
            case "技能冷却":
                return "lucide:hourglass";
            case "远程减免":
                return "lucide:arrow-down-circle";
            case "移速加成":
                return "lucide:wind";
            default:
                return "lucide:sparkles";
        }
    }

    function setEffectIconColor(name: string) {
        switch (name) {
            case "护甲数值":
                return "#3b82f6";
            case "法力上限":
                return "#60a5fa";
            case "盔甲韧性":
                return "#22c55e";
            case "耐力上限":
            case "生命上限":
            case "额外生命":
                return "#ef4444";
            case "闪避率":
                return "#14b8a6";
            case "防御减伤":
                return "#f97316";
            case "技能冷却":
                return "#8b5cf6";
            case "远程减免":
                return "#f97316";
            case "移速加成":
                return "#14b8a6";
            default:
                return "#b8722e";
        }
    }
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
            <div class="filter-group">
                <span class="filter-label">
                    <Icon name="lucide:award" :size="16" />
                    品质
                </span>
                <div class="filter-pills quality-pills">
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
        <div v-for="(sets, jobId) in byJob" :key="jobId" class="job-group">
            <h2 class="group-title">{{ jobMap[jobId] ?? jobId }}</h2>
            <div class="items-grid">
                <template v-for="set in sets" :key="set.setId">
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
                            <div v-for="(effects, count) in set.effects" :key="count" class="set-effect-group">
                                <span class="set-effect-count">{{ count }} 件套</span>
                                <div v-for="effect in effects" :key="effect.id" class="set-effect-pill">
                                    <Icon :name="setEffectIcon(effect.name)" :size="14" :style="{ color: setEffectIconColor(effect.name) }" />
                                    <span class="set-effect-value">
                                        {{ effect.name }} {{ effect.value > 0 ? "+" : "" }}{{ effect.value }}{{ effect.unit ?? "" }}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <Icon name="lucide:arrow-down" :size="18" class="set-effects-arrow" />
                    </div>
                    <EquipmentCard
                        v-for="item in set.items"
                        :key="item.id"
                        :item="item" />
                </template>
            </div>
        </div>
        <div v-if="Object.keys(byJob).length === 0" class="empty-state">
            <Icon name="lucide:search-x" :size="32" />
            <p>没有符合条件的装备</p>
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
    .filter-pills.quality-pills {
        gap: 16px;
    }
    .filter-pill.quality {
        width: 34px;
        height: 34px;
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
    .items-grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 10px;
    }
    .set-effects-bar {
        grid-column: 1 / -1;
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 10px 14px;
        border-radius: var(--radius-xl);
        background: rgba(255, 250, 242, 0.95);
        border: 1px solid rgba(0, 0, 0, 0.08);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    }
    .set-effects-bar.job-zhanshi {
        border-color: color-mix(in srgb, var(--job-zhanshi) 25%, rgba(0, 0, 0, 0.08));
    }
    .set-effects-bar.job-sheshou {
        border-color: color-mix(in srgb, var(--job-sheshou) 25%, rgba(0, 0, 0, 0.08));
    }
    .set-effects-bar.job-mushi {
        border-color: color-mix(in srgb, var(--job-mushi) 25%, rgba(0, 0, 0, 0.08));
    }
    .set-effects-bar.job-cike {
        border-color: color-mix(in srgb, var(--job-cike) 25%, rgba(0, 0, 0, 0.08));
    }
    .set-effects-bar.job-fashi {
        border-color: color-mix(in srgb, var(--job-fashi) 25%, rgba(0, 0, 0, 0.08));
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
    .set-effect-group {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 6px 10px;
    }
    .set-effect-pill {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 5px 10px;
        border-radius: 8px;
        background: rgba(184, 114, 46, 0.12);
        color: #1a1612;
        font-size: 0.8125rem;
    }
    .set-effect-count {
        font-weight: 600;
        color: #5c4d3d;
        white-space: nowrap;
    }
    .set-effect-value {
        white-space: nowrap;
    }
    .set-effects-arrow {
        flex-shrink: 0;
        color: #b8722e;
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

</style>
