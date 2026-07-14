<script setup lang="ts">
    import type { WikiEquipment } from "../../../types/wiki";
    import Icon from "../Icon.vue";

    const props = defineProps<{
        item: WikiEquipment;
    }>();

    function statIcon(name: string) {
        switch (name) {
            case "护甲数值":
                return "lucide:shield";
            case "法力上限":
                return "lucide:droplets";
            case "盔甲韧性":
                return "lucide:shield-check";
            case "耐力上限":
                return "lucide:heart";
            case "闪避率":
                return "lucide:wind";
            case "防御减伤":
                return "lucide:shield-minus";
            case "额外生命":
                return "lucide:heart-plus";
            default:
                return "lucide:activity";
        }
    }

    function statIconColor(name: string) {
        switch (name) {
            case "护甲数值":
                return "#3b82f6";
            case "法力上限":
                return "#60a5fa";
            case "盔甲韧性":
                return "#22c55e";
            case "耐力上限":
                return "#ef4444";
            case "闪避率":
                return "#14b8a6";
            case "防御减伤":
                return "#f97316";
            case "额外生命":
                return "#ef4444";
            default:
                return "#b8722e";
        }
    }
</script>

<template>
    <article class="equipment-card" :class="`job-${item.jobId}`">
        <header class="card-header">
            <div class="title-group">
                <h3 class="card-title">{{ item.name }}</h3>
            </div>
            <div class="quality-badge" :class="`quality-${item.quality}`">
                <span>{{ item.quality }}</span>
            </div>
        </header>

        <div class="card-body">
            <div class="image-frame">
                <img v-if="item.image" :src="item.image" :alt="item.name" class="equipment-image" />
                <Icon v-else name="lucide:shield" :size="44" class="equipment-icon" />
            </div>

            <div class="stats">
                <div v-for="stat in item.stats" :key="stat.id" class="stat-row">
                    <div class="stat-label">
                        <Icon :name="statIcon(stat.name)" :size="16" :style="{ color: statIconColor(stat.name) }" />
                        <span>{{ stat.name }}</span>
                    </div>
                    <span class="stat-value">{{ stat.value }}{{ stat.unit ?? "" }}</span>
                </div>
            </div>
        </div>

        <div class="card-footer">
            <span>附魔容量 {{ item.enchantSlots }}</span>
            <span class="footer-divider" />
            <span>宝石槽位 {{ item.gemSlots }}</span>
        </div>
    </article>
</template>

<style scoped>
    .equipment-card {
        display: flex;
        flex-direction: column;
        gap: 14px;
        padding: 16px 18px;
        border-radius: var(--radius-xl);
        background: rgba(255, 250, 242, 0.95);
        border: 1px solid rgba(0, 0, 0, 0.08);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        transition:
            transform 0.15s ease,
            box-shadow 0.15s ease;
    }

    .equipment-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
    }

    .equipment-card.job-zhanshi {
        border-color: color-mix(in srgb, var(--job-zhanshi) 25%, rgba(0, 0, 0, 0.08));
    }
    .equipment-card.job-sheshou {
        border-color: color-mix(in srgb, var(--job-sheshou) 25%, rgba(0, 0, 0, 0.08));
    }
    .equipment-card.job-mushi {
        border-color: color-mix(in srgb, var(--job-mushi) 25%, rgba(0, 0, 0, 0.08));
    }
    .equipment-card.job-cike {
        border-color: color-mix(in srgb, var(--job-cike) 25%, rgba(0, 0, 0, 0.08));
    }
    .equipment-card.job-fashi {
        border-color: color-mix(in srgb, var(--job-fashi) 25%, rgba(0, 0, 0, 0.08));
    }

    .card-header {
        position: relative;
        display: flex;
        align-items: flex-start;
        justify-content: center;
        gap: 16px;
    }

    .title-group {
        display: flex;
        flex-direction: column;
        gap: 2px;
        min-width: 0;
        margin-inline: auto;
    }

    .card-title {
        margin: 0;
        font-family: var(--font-heading);
        font-size: 1.375rem;
        font-weight: 600;
        color: #1a1612;
    }

    .slot-name {
        font-size: 0.75rem;
        color: #7c6b55;
    }

    .quality-badge {
        position: absolute;
        top: 0;
        right: 0;   
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

    .quality-badge span {
        font-size: 0.75rem;
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
        gap: 14px;
        align-items: stretch;
    }

    .image-frame {
        flex: 0 0 72px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--radius-lg);
        border: 2px solid rgba(184, 114, 46, 0.25);
        background: rgba(255, 255, 255, 0.5);
    }

    .equipment-image {
        width: 85%;
        height: 85%;
        object-fit: contain;
    }

    .equipment-icon {
        color: #b8722e;
    }

    .stats {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
    }

    .stat-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        padding: 9px 4px;
        font-size: 0.8125rem;
        border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    }

    .stat-row:last-child {
        border-bottom: none;
    }

    .stat-label {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #5c4d3d;
    }

    .stat-value {
        flex-shrink: 0;
        font-weight: 500;
        color: #1a1612;
    }

    .card-footer {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        font-size: 0.8125rem;
        color: #7c6b55;
        padding-top: 6px;
        border-top: 1px solid rgba(0, 0, 0, 0.06);
    }

    .footer-divider {
        width: 1px;
        height: 14px;
        background: rgba(0, 0, 0, 0.15);
    }

    @media (max-width: 480px) {
        .card-body {
            flex-direction: column;
            align-items: center;
        }
    }
</style>
