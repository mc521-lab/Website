<script setup lang="ts">
    import type { WikiGem, WikiGemQuality } from "../../../types/wiki";
    import Icon from "../Icon.vue";

    const props = defineProps<{
        item: WikiGem;
    }>();

    function formatValue(value: number | number[] | null): string {
        if (value === null) return "?";
        if (Array.isArray(value)) {
            const [min, max] = value;
            if (min === null && max === null) return "?";
            if (max === null) return `${min}+`;
            if (min === null) return `~${max}`;
            return `${min} ~ ${max}`;
        }
        return String(value);
    }

    function qualityLabelClass(quality: WikiGemQuality): string {
        return `quality-${quality.id.toUpperCase()}`;
    }

    function featureIcon(id: string): string {
        switch (id) {
            case "critRate":
                return "lucide:target";
            case "critDamage":
                return "lucide:swords";
            case "maxMana":
            case "manaRegen":
                return "lucide:droplets";
            case "maxStamina":
            case "staminaRegen":
                return "lucide:heart-pulse";
            case "maxHealth":
            case "rescue":
                return "lucide:heart-plus";
            case "dodgeRate":
                return "lucide:wind";
            case "damageReduction":
                return "lucide:shield-minus";
            case "baseAttack":
            case "pveAttack":
                return "lucide:sword";
            default:
                return "lucide:activity";
        }
    }

    function featureIconColor(id: string): string {
        switch (id) {
            case "critRate":
            case "critDamage":
                return "#ef4444";
            case "maxMana":
            case "manaRegen":
                return "#3b82f6";
            case "maxStamina":
            case "staminaRegen":
            case "maxHealth":
            case "rescue":
                return "#ef4444";
            case "dodgeRate":
                return "#14b8a6";
            case "damageReduction":
                return "#f97316";
            case "baseAttack":
            case "pveAttack":
                return "#f97316";
            default:
                return "#b8722e";
        }
    }

    function featureName(id: string): string {
        return props.item.features.find((f) => f.id === id)?.name ?? id;
    }
</script>

<template>
    <article class="gem-card" :style="{ '--gem-color': item.symbolColor }">
        <div class="card-left">
            <div class="icon-frame">
                <img v-if="item.image" :src="item.image" :alt="item.name" class="gem-image" />
                <Icon v-else name="lucide:diamond" :size="40" class="gem-icon" />
            </div>
            <h3 class="card-title">{{ item.name }}</h3>
            <p v-if="item.description" class="card-description">{{ item.description }}</p>
        </div>

        <div class="quality-grid">
            <div
                v-for="quality in item.qualitys"
                :key="quality.id"
                class="quality-column"
                :class="qualityLabelClass(quality)">
                <div class="quality-badge">
                    <span class="quality-text">{{ quality.id.toUpperCase() }}</span>
                </div>
                <div class="quality-features">
                    <div
                        v-for="feature in quality.features"
                        :key="feature.id"
                        class="feature-cell">
                        <Icon :name="featureIcon(feature.id)" :size="14" :style="{ color: featureIconColor(feature.id) }" class="feature-icon" />
                        <span class="feature-name">{{ featureName(feature.id) }}</span>
                        <span class="feature-value">{{ formatValue(feature.value) }}</span>
                    </div>
                </div>
                <div class="quality-description">
                    <Icon name="lucide:info" :size="12" class="description-icon" />
                    <span>{{ quality.description }}</span>
                </div>
            </div>
        </div>
    </article>
</template>

<style scoped>
    .gem-card {
        display: flex;
        align-items: stretch;
        gap: 20px;
        padding: 18px 20px;
        border-radius: var(--radius-xl);
        background: rgba(255, 250, 242, 0.95);
        border: 1px solid rgba(0, 0, 0, 0.08);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        transition:
            transform 0.15s ease,
            box-shadow 0.15s ease;
    }

    .gem-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
    }

    .card-left {
        flex: 0 0 120px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 10px;
        text-align: center;
        padding-right: 16px;
        border-right: 1px solid rgba(0, 0, 0, 0.06);
    }

    .icon-frame {
        flex-shrink: 0;
        width: 64px;
        height: 64px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--radius-lg);
        border: 2px solid color-mix(in srgb, var(--gem-color) 30%, rgba(0, 0, 0, 0.08));
        background: color-mix(in srgb, var(--gem-color) 10%, rgba(255, 255, 255, 0.5));
    }

    .gem-image {
        width: 80%;
        height: 80%;
        object-fit: contain;
    }

    .gem-icon {
        color: var(--gem-color);
    }

    .gem-icon :deep(path) {
        fill: var(--gem-color);
    }

    .card-title {
        margin: 0;
        font-family: var(--font-heading);
        font-size: 1.125rem;
        font-weight: 600;
        color: #1a1612;
    }

    .card-description {
        margin: 0;
        font-size: 0.75rem;
        color: #7c6b55;
    }

    .quality-grid {
        flex: 1;
        min-width: 0;
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 12px;
    }

    .quality-column {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        padding: 12px;
        border-radius: var(--radius-lg);
        background: rgba(0, 0, 0, 0.03);
        border: 1px solid transparent;
    }

    .quality-badge {
        flex-shrink: 0;
        width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 6px;
        transform: rotate(45deg);
        border: 1px solid rgba(0, 0, 0, 0.12);
        box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.4),
            inset 0 -1px 0 rgba(0, 0, 0, 0.1),
            0 1px 2px rgba(0, 0, 0, 0.15);
    }

    .quality-text {
        font-size: 0.75rem;
        font-weight: 700;
        transform: rotate(-45deg);
    }

    .quality-column.quality-C .quality-badge {
        background: linear-gradient(135deg, #8b5a2b 0%, #4a2e18 100%);
        color: #ffffff;
        text-shadow: 0 1px 1px rgba(0, 0, 0, 0.25);
    }

    .quality-column.quality-B .quality-badge {
        background: linear-gradient(135deg, #d48c4a 0%, #8f5a26 100%);
        color: #ffffff;
        text-shadow: 0 1px 1px rgba(0, 0, 0, 0.25);
    }

    .quality-column.quality-A .quality-badge {
        background: linear-gradient(135deg, #e8e8e8 0%, #a8a8a8 100%);
        color: #1a1612;
        text-shadow: 0 1px 0 rgba(255, 255, 255, 0.35);
    }

    .quality-column.quality-S .quality-badge {
        background: linear-gradient(135deg, #f4e08a 0%, #d4af37 100%);
        color: #1a1612;
        text-shadow: 0 1px 0 rgba(255, 255, 255, 0.35);
    }

    .quality-column.quality-C {
        border-color: rgba(139, 90, 43, 0.35);
    }

    .quality-column.quality-B {
        border-color: rgba(212, 140, 74, 0.35);
    }

    .quality-column.quality-A {
        border-color: rgba(168, 168, 168, 0.35);
    }

    .quality-column.quality-S {
        border-color: rgba(212, 175, 55, 0.35);
    }

    .quality-features {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 6px;
    }

    .feature-cell {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 6px 8px;
        border-radius: var(--radius-md);
        background: rgba(0, 0, 0, 0.04);
        font-size: 0.75rem;
    }

    .feature-icon {
        flex-shrink: 0;
    }

    .feature-name {
        flex: 1;
        min-width: 0;
        color: #5c4d3d;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .feature-value {
        flex-shrink: 0;
        font-weight: 600;
        color: #1a1612;
    }

    .quality-description {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 5px;
        font-size: 0.75rem;
        color: #7c6b55;
        text-align: center;
    }

    .description-icon {
        flex-shrink: 0;
        color: #b8722e;
    }

    @media (max-width: 900px) {
        .gem-card {
            flex-direction: column;
            gap: 16px;
        }

        .card-left {
            flex: auto;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;
            text-align: left;
            padding-right: 0;
            padding-bottom: 12px;
            border-right: none;
            border-bottom: 1px solid rgba(0, 0, 0, 0.06);
        }

        .card-title {
            font-size: 1.25rem;
        }

        .quality-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }
    }

    @media (max-width: 480px) {
        .quality-grid {
            grid-template-columns: 1fr;
        }
    }
</style>
