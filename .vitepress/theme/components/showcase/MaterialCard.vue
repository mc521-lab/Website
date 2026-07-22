<script setup lang="ts">
    import type { WikiMaterial } from "../../../types/wiki";
    import Icon from "../Icon.vue";

    const props = defineProps<{
        item: WikiMaterial;
    }>();

    function typeIcon(type: string): string {
        switch (type) {
            case "材料":
                return "lucide:box";
            case "货币":
                return "lucide:coins";
            case "宠食":
                return "lucide:cookie";
            case "道具":
                return "lucide:package-open";
            default:
                return "lucide:help-circle";
        }
    }
</script>

<template>
    <article class="material-card">
        <header class="card-header">
            <div class="image-frame">
                <img v-if="item.image" :src="item.image" :alt="item.name" class="material-image" />
                <Icon v-else :name="typeIcon(item.type)" :size="36" class="material-icon" />
            </div>
            <div class="title-group">
                <h3 class="card-title">{{ item.name }}</h3>
                <span class="card-type">{{ item.type }}</span>
            </div>
            <div v-if="item.quality" class="quality-badge" :class="`quality-${item.quality}`">
                <span>{{ item.quality }}</span>
            </div>
        </header>

        <div class="card-body">
            <div class="info-rows">
                <div v-if="item.usage" class="info-row usage-row">
                    <div class="info-label">
                        <Icon name="lucide:hammer" :size="14" class="usage-icon" />
                        <span>{{ item.usage }}</span>
                    </div>
                </div>
                <div v-if="item.limit" class="info-row limit-row">
                    <div class="info-label">
                        <Icon name="lucide:clock" :size="14" class="limit-icon" />
                        <span>{{ item.limit }}</span>
                    </div>
                </div>
                <div v-if="item.effect" class="info-row effect-row">
                    <div class="info-label">
                        <Icon name="lucide:sparkles" :size="14" class="effect-icon" />
                        <span>{{ item.effect }}</span>
                    </div>
                </div>
                <div v-if="item.exchange" class="info-row exchange-row">
                    <div class="info-label">
                        <Icon name="lucide:repeat-2" :size="14" class="exchange-icon" />
                        <span>{{ item.exchange }}</span>
                    </div>
                </div>
                <div v-if="item.source" class="info-row source-row">
                    <div class="info-label">
                        <Icon name="lucide:map-pin" :size="14" class="source-icon" />
                        <span>{{ item.source }}</span>
                    </div>
                </div>
            </div>
            <p v-if="item.description" class="description">{{ item.description }}</p>
        </div>
    </article>
</template>

<style scoped>
    .material-card {
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 14px 16px;
        border-radius: var(--radius-xl);
        background: rgba(255, 250, 242, 0.95);
        border: 1px solid rgba(0, 0, 0, 0.08);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        transition:
            transform 0.15s ease,
            box-shadow 0.15s ease;
    }

    .material-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
    }

    .card-header {
        display: flex;
        align-items: center;
        gap: 12px;
        position: relative;
    }

    .image-frame {
        width: 56px;
        height: 56px;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--radius-lg);
        background: rgba(0, 0, 0, 0.04);
        border: 1px solid rgba(0, 0, 0, 0.08);
    }

    .material-image {
        width: 80%;
        height: 80%;
        object-fit: contain;
    }

    .material-icon {
        color: #b8722e;
    }

    .title-group {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    .card-title {
        margin: 0;
        font-family: var(--font-heading);
        font-size: 1rem;
        font-weight: 600;
        color: #1a1612;
    }

    .card-type {
        font-size: 0.75rem;
        color: #7c6b55;
    }

    .quality-badge {
        position: absolute;
        top: 0;
        right: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 5px;
        transform: rotate(45deg);
        border: 1px solid rgba(0, 0, 0, 0.12);
        box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.4),
            inset 0 -1px 0 rgba(0, 0, 0, 0.1),
            0 1px 2px rgba(0, 0, 0, 0.15);
    }

    .quality-badge span {
        font-size: 0.6875rem;
        font-weight: 700;
        transform: rotate(-45deg);
    }

    .quality-badge.quality-D {
        background: linear-gradient(135deg, #b0b5bd 0%, #7a828a 100%);
        color: #ffffff;
        text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
    }
    .quality-badge.quality-C {
        background: linear-gradient(135deg, #e8e4cc 0%, #c4c0a8 100%);
        color: #5c4d3d;
        text-shadow: 0 1px 0 rgba(255, 255, 255, 0.4);
    }
    .quality-badge.quality-B {
        background: linear-gradient(135deg, #d48c4a 0%, #8f5a26 100%);
        color: #ffffff;
        text-shadow: 0 1px 1px rgba(0, 0, 0, 0.25);
    }
    .quality-badge.quality-A {
        background: linear-gradient(135deg, #e8e8e8 0%, #a8a8a8 100%);
        color: #1a1612;
        text-shadow: 0 1px 0 rgba(255, 255, 255, 0.35);
    }
    .quality-badge.quality-S {
        background: linear-gradient(135deg, #f4e08a 0%, #d4af37 100%);
        color: #1a1612;
        text-shadow: 0 1px 0 rgba(255, 255, 255, 0.35);
    }

    .card-body {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .info-rows {
        display: flex;
        flex-direction: column;
        gap: 3px;
    }

    .description {
        margin: 0;
        margin-top: auto;
        padding-top: 6px;
        font-size: 0.75rem;
        line-height: 1.5;
        color: #9b8b78;
        font-style: italic;
        white-space: pre-line;
    }

    .info-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        padding: 7px 10px;
        border-radius: var(--radius-md);
        background: rgba(0, 0, 0, 0.04);
        font-size: 0.8125rem;
    }

    .info-label {
        display: flex;
        align-items: center;
        gap: 6px;
        color: #5c4d3d;
        min-width: 0;
        white-space: pre-line;
    }

    .usage-icon {
        color: #3b82f6;
        flex-shrink: 0;
    }

    .limit-icon {
        color: #f59e0b;
        flex-shrink: 0;
    }

    .effect-icon {
        color: #b8722e;
        flex-shrink: 0;
    }

    .exchange-icon {
        color: #d4af37;
        flex-shrink: 0;
    }

    .source-icon {
        color: #14b8a6;
        flex-shrink: 0;
    }
</style>
