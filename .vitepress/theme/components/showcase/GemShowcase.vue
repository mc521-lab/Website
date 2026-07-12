<script setup lang="ts">
    import { data } from "@data/gems.data";
    import type { WikiGemQuality, WikiGemQualityFeature } from "../../../types/wiki";
    import Icon from "../Icon.vue";

    const { gems } = data;

    const qualityOrder = ["c", "b", "a", "s"];

    function formatValue(value: number | number[] | null | undefined): string {
        if (value === undefined || value === null) return "-";
        if (Array.isArray(value)) {
            const [min, max] = value;
            if (min === null && max === null) return "-";
            if (max === null || max === undefined) return `${min}+`;
            if (min === null || min === undefined) return `~ ${max}`;
            return `${min} ~ ${max}`;
        }
        return String(value);
    }

    function sortedQualitys(qualitys: WikiGemQuality[]): WikiGemQuality[] {
        return qualitys.slice().sort((a, b) => qualityOrder.indexOf(a.id) - qualityOrder.indexOf(b.id));
    }

    function findFeatureValue(
        quality: WikiGemQuality,
        featureId: string,
    ): number | number[] | null | undefined {
        return quality.features.find((f: WikiGemQualityFeature) => f.id === featureId)?.value;
    }

    function featureSubtitle(gem: (typeof gems)[number]): string {
        return gem.features.map((f: (typeof gem.features)[number]) => f.name).join(" / ");
    }
</script>

<template>
    <section class="showcase">
        <article v-for="gem in gems" :key="gem.id" class="gem-card">
            <div class="gem-media">
                <div class="gem-placeholder" :style="{ backgroundColor: gem.symbolColor }">
                    <Icon name="lucide:diamond" :size="28" />
                </div>
            </div>
            <div class="gem-content">
                <header class="gem-header">
                    <h3 class="gem-title" :style="{ color: gem.symbolColor }">{{ gem.name }}</h3>
                </header>
                <p class="gem-subtitle">{{ featureSubtitle(gem) }}</p>
            </div>
            <div class="gem-body">
                <div v-for="q in sortedQualitys(gem.qualitys)" :key="q.id" class="quality-block">
                    <div class="quality-header">
                        <span class="quality-name">{{ q.name }}</span>
                        <span class="quality-desc">{{ q.description }}</span>
                    </div>
                    <div class="quality-features">
                        <div v-for="feature in gem.features" :key="feature.id" class="feature-row">
                            <span class="feature-name">{{ feature.name }}</span>
                            <span class="feature-value">{{ formatValue(findFeatureValue(q, feature.id)) }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    </section>
</template>

<style scoped>
    .showcase {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 14px;
    }
    @media (max-width: 1100px) {
        .showcase {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }
    }
    @media (max-width: 640px) {
        .showcase {
            grid-template-columns: 1fr;
        }
    }
    .gem-card {
        display: grid;
        grid-template-columns: auto 1fr;
        grid-template-rows: auto auto;
        gap: 12px;
        background: rgba(255, 255, 255, 0.72);
        border: 1px solid rgba(0, 0, 0, 0.08);
        border-radius: 12px;
        padding: 14px;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
        overflow: hidden;
    }
    .gem-media {
        grid-column: 2;
        grid-row: 1;
        justify-self: end;
    }
    .gem-placeholder {
        width: 64px;
        height: 64px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 10px;
        color: rgba(255, 255, 255, 0.95);
        box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.08);
    }
    .gem-content {
        grid-column: 1;
        grid-row: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
    }
    .gem-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-top: 4px;
    }
    .gem-title {
        font-size: 1.3206rem;
        margin: 0;
        font-weight: 600;
    }
    .gem-subtitle {
        font-size: 0.8125rem;
        color: #7c6b55;
        margin: 0;
    }
    .gem-body {
        grid-column: 1 / -1;
        grid-row: 2;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    .quality-block {
        display: flex;
        flex-direction: column;
        gap: 6px;
        padding: 10px 12px;
        border-radius: 8px;
        background: rgba(0, 0, 0, 0.04);
    }
    .quality-header {
        display: flex;
        justify-content: space-between;
        gap: 8px;
        font-size: 0.8125rem;
    }
    .quality-name {
        color: #1a1612;
        font-weight: 600;
        flex-shrink: 0;
    }
    .quality-desc {
        color: #7c6b55;
        text-align: right;
    }
    .quality-features {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }
    .feature-row {
        display: flex;
        justify-content: space-between;
        gap: 8px;
        font-size: 0.75rem;
    }
    .feature-name {
        color: #7c6b55;
    }
    .feature-value {
        color: #1a1612;
        font-weight: 500;
        text-align: right;
        flex-shrink: 0;
    }
</style>
