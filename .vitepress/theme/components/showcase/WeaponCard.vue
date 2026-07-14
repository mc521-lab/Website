<script setup lang="ts">
    import type { WikiEquipment } from "../../../types/wiki";
    import Icon from "../Icon.vue";

    const props = defineProps<{
        item: WikiEquipment;
    }>();

    function statIcon(name: string) {
        switch (name) {
            case "基础伤害":
                return "lucide:sword";
            case "攻击速度":
                return "lucide:swords";
            case "暴击伤害":
            case "暴击概率":
                return "lucide:target";
            default:
                return "lucide:activity";
        }
    }
</script>

<template>
    <article class="weapon-card" :class="`job-${item.jobId}`">
        <header class="card-header">
            <h3 class="card-title">{{ item.name }}</h3>
            <div class="quality-badge" :class="`quality-${item.quality}`">
                <span>{{ item.quality }}</span>
            </div>
        </header>

        <div class="card-body">
            <div class="image-frame">
                <img v-if="item.image" :src="item.image" :alt="item.name" class="weapon-image" />
                <Icon v-else name="lucide:sword" :size="48" class="weapon-icon" />
            </div>

            <div class="stats">
                <div v-for="stat in item.stats" :key="stat.id" class="stat-row">
                    <div class="stat-label">
                        <Icon :name="statIcon(stat.name)" :size="16" />
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
    .weapon-card {
        display: flex;
        flex-direction: column;
        gap: 14px;
        padding: 16px 12px;
        border-radius: var(--radius-xl);
        background: rgba(255, 250, 242, 0.95);
        border: 1px solid rgba(0, 0, 0, 0.08);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        transition:
            transform 0.15s ease,
            box-shadow 0.15s ease;
    }

    .weapon-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
    }

    .weapon-card.job-zhanshi {
        border-color: color-mix(in srgb, var(--job-zhanshi) 25%, rgba(0, 0, 0, 0.08));
    }
    .weapon-card.job-sheshou {
        border-color: color-mix(in srgb, var(--job-sheshou) 25%, rgba(0, 0, 0, 0.08));
    }
    .weapon-card.job-mushi {
        border-color: color-mix(in srgb, var(--job-mushi) 25%, rgba(0, 0, 0, 0.08));
    }
    .weapon-card.job-cike {
        border-color: color-mix(in srgb, var(--job-cike) 25%, rgba(0, 0, 0, 0.08));
    }
    .weapon-card.job-fashi {
        border-color: color-mix(in srgb, var(--job-fashi) 25%, rgba(0, 0, 0, 0.08));
    }

    .card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        width: 85%;
    }

    .card-title {
        margin: 0;
        font-family: var(--font-heading);
        font-size: 1.375rem;
        font-weight: 600;
        color: #1a1612;
    }

    .quality-badge {
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

    .weapon-image {
        width: 85%;
        height: 85%;
        object-fit: contain;
    }

    .weapon-icon {
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
        width: 80%;
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
 