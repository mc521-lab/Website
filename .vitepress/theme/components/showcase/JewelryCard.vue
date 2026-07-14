<script setup lang="ts">
    import { computed } from "vue";
    import type { WikiJewelry } from "../../../types/wiki";
    import Icon from "../Icon.vue";

    const props = defineProps<{
        item: WikiJewelry;
    }>();

    const attributeHeader = computed(() => `随机${props.item.randomMin}~${props.item.randomMax}个属性`);
</script>

<template>
    <article class="jewelry-card" :class="[`job-${item.jobId}`, { 'is-treasure': item.slotType === '秘宝' }]">
        <div v-if="item.slotType === '秘宝'" class="treasure-ribbon">
            <span class="ribbon-star-wrap">
                <Icon name="lucide:star" :size="13" class="ribbon-star" />
            </span>
        </div>
        <header class="card-header">
            <h3 class="card-title">{{ item.name }}</h3>
            <span class="card-badge">
                <div class="attributes-header">
                    <Icon name="lucide:sparkles" :size="16" class="header-icon" />
                    <span>{{ attributeHeader }}</span>
                </div>
            </span>
        </header>

        <div class="card-body">
            <div class="icon-frame">
                <img v-if="item.image" :src="item.image" :alt="item.name" class="item-image" />
                <Icon v-else name="lucide:gem" :size="40" class="icon-gem" />
            </div>

            <div class="attributes">
                <div v-for="attr in item.attributes" :key="attr.id" class="attribute-row">
                    <div class="attribute-label">
                        <Icon :name="`lucide:${attr.icon}`" :size="16" :style="{ '--icon-color': attr.iconColor }" class="attr-icon" />
                        <span>{{ attr.name }}</span>
                    </div>
                    <span class="attribute-value">{{ attr.min }} ~ {{ attr.max }}</span>
                </div>
            </div>
        </div>

        <div class="card-footer">
            <span class="footer-line" />
            <Icon name="lucide:sparkles" :size="14" class="footer-icon" />
            <span class="footer-line" />
        </div>
    </article>
</template>

<style scoped>
    .jewelry-card {
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 14px;
        padding: 16px;
        border-radius: var(--radius-xl);
        background: rgba(255, 250, 242, 0.95);
        border: 1px solid rgba(0, 0, 0, 0.08);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        transition:
            transform 0.15s ease,
            box-shadow 0.15s ease;
    }

    .treasure-ribbon {
        position: absolute;
        top: 0;
        right: 0;
        width: 90px;
        height: 90px;
        overflow: hidden;
        pointer-events: none;
        border-radius: 0 var(--radius-xl) 0 0;
    }

    .treasure-ribbon::before {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        width: 150px;
        height: 22px;
        background: linear-gradient(90deg, #f8dfb0 0%, #e6b35a 100%);
        transform-origin: top right;
        transform: rotate(45deg) translate(48px, 23px);
        box-shadow: 0 2px 6px rgba(139, 106, 45, 0.25);
    }

    .ribbon-star-wrap {
        position: absolute;
        top: 15px;
        right: 15px;
        z-index: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 18px;
        height: 18px;
    }

    .ribbon-star-wrap::before,
    .ribbon-star-wrap::after {
        content: '';
        position: absolute;
        width: 2px;
        height: 2px;
        border-radius: 50%;
        background: #ffffff;
        box-shadow: 0 0 2px rgba(255, 255, 255, 0.9);
    }

    .ribbon-star-wrap::before {
        top: 1px;
        left: 0;
    }

    .ribbon-star-wrap::after {
        bottom: 2px;
        right: 1px;
    }

    .ribbon-star {
        color: #ffffff;
        filter: drop-shadow(0 1px 2px rgba(139, 106, 45, 0.35));
    }

    .ribbon-star :deep(path) {
        fill: currentColor;
    }

    .jewelry-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
    }

    .jewelry-card.job-zhanshi {
        border-color: color-mix(in srgb, var(--job-zhanshi) 25%, rgba(0, 0, 0, 0.08));
    }
    .jewelry-card.job-sheshou {
        border-color: color-mix(in srgb, var(--job-sheshou) 25%, rgba(0, 0, 0, 0.08));
    }
    .jewelry-card.job-mushi {
        border-color: color-mix(in srgb, var(--job-mushi) 25%, rgba(0, 0, 0, 0.08));
    }
    .jewelry-card.job-cike {
        border-color: color-mix(in srgb, var(--job-cike) 25%, rgba(0, 0, 0, 0.08));
    }
    .jewelry-card.job-fashi {
        border-color: color-mix(in srgb, var(--job-fashi) 25%, rgba(0, 0, 0, 0.08));
    }

    .jewelry-card.is-treasure {
        background: linear-gradient(
            135deg,
            rgba(255, 252, 244, 0.98) 0%,
            rgba(255, 247, 225, 0.96) 50%,
            rgba(255, 252, 244, 0.98) 100%
        );
        border-color: rgba(212, 175, 55, 0.35);
        box-shadow:
            0 2px 8px rgba(0, 0, 0, 0.06),
            0 0 18px rgba(212, 175, 55, 0.12);
    }

    .jewelry-card.is-treasure:hover {
        box-shadow:
            0 6px 16px rgba(0, 0, 0, 0.1),
            0 0 26px rgba(212, 175, 55, 0.18);
    }

    .jewelry-card.is-treasure .card-badge {
        background: rgba(212, 175, 55, 0.16);
        color: #8a6d1f;
    }

    .jewelry-card.is-treasure .icon-frame {
        border-color: rgba(212, 175, 55, 0.35);
        background: rgba(255, 255, 255, 0.65);
        box-shadow: inset 0 0 10px rgba(212, 175, 55, 0.08);
    }

    .jewelry-card.is-treasure .header-icon,
    .jewelry-card.is-treasure .footer-icon {
        color: #d4af37;
    }

    .jewelry-card.is-treasure .footer-line {
        background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.35), transparent);
    }

    .card-header {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .card-title {
        margin: 0;
        font-family: var(--font-heading);
        font-size: 1.25rem;
        font-weight: 600;
        color: #1a1612;
    }

    .card-badge {
        flex-shrink: 0;
        font-size: 0.75rem;
        padding: 3px 10px;
        border-radius: var(--radius-full);
        background: rgba(184, 114, 46, 0.12);
        color: #8c5523;
    }

    .card-body {
        display: flex;
        gap: 14px;
        align-items: stretch;
    }

    .icon-frame {
        flex-shrink: 0;
        width: 72px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--radius-lg);
        border: 2px solid rgba(184, 114, 46, 0.25);
        background: rgba(255, 255, 255, 0.5);
    }

    .icon-gem {
        color: #b8722e;
    }

    .item-image {
        width: 80%;
        height: 80%;
        object-fit: contain;
    }

    .attributes {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .attributes-header {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 0.8125rem;
        color: #5c4d3d;
        padding: 0 4px;
    }

    .header-icon {
        color: #d4893a;
    }

    .attribute-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        padding: 7px 10px;
        border-radius: var(--radius-md);
        background: rgba(0, 0, 0, 0.04);
        font-size: 0.8125rem;
    }

    .attribute-label {
        display: flex;
        align-items: center;
        gap: 6px;
        color: #5c4d3d;
        min-width: 0;
    }

    .attribute-label .attr-icon {
        color: var(--icon-color);
    }

    /* .attribute-label .attr-icon :deep(path) {
        fill: var(--icon-color);
    } */

    .attribute-label span {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .attribute-value {
        flex-shrink: 0;
        font-weight: 500;
        color: #1a1612;
    }

    .card-footer {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-top: auto;
    }

    .footer-line {
        flex: 1;
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(184, 114, 46, 0.35), transparent);
    }

    .footer-icon {
        color: #d4893a;
        flex-shrink: 0;
    }

    @media (max-width: 480px) {
        .card-body {
            flex-direction: column;
            align-items: center;
        }

        .icon-frame {
            width: 64px;
            height: 64px;
        }

        .attribute-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
        }
    }
</style>
