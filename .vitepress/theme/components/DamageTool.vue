<script setup lang="ts">
import { ref, computed } from "vue";
import Icon from "./Icon.vue";

const rawDamage = ref(10);      // d
const defenseReduction = ref(0); // r
const armorValue = ref(20);     // v
const armorToughness = ref(0);  // t
const enchantmentFactor = ref(100); // k%

const piercingLevel = 0; // 默认 p = 0，未提供滑块

function calculateArmorDamage(d: number, v: number, t: number, p: number): number {
    // 当 p=0 且 v<=20 时使用化简公式
    if (p === 0 && v <= 20) {
        const threshold = 1.6 * v + 0.2 * v * t;
        if (d >= 0 && d <= threshold) {
            return (1 / (6.25 * t + 50)) * d * d + (1 - v / 25) * d;
        }
        return (1 - v / 125) * d;
    }

    // 通用公式
    const denominator = 2 + 0.25 * t;
    const inner = Math.min(20, Math.max(0.2 * v, v - d / denominator));
    const reduction = inner / 25 - 0.15 * p;
    const multiplier = Math.min(1, 1 - reduction);
    return d * multiplier;
}

const finalDamage = computed(() => {
    const armorDamage = calculateArmorDamage(rawDamage.value, armorValue.value, armorToughness.value, piercingLevel);
    const afterDefense = armorDamage * (1 - defenseReduction.value / 100);
    const afterEnchantment = afterDefense * (enchantmentFactor.value / 100);
    return Math.max(0, afterEnchantment);
});

interface SliderConfig {
    label: string;
    model: typeof rawDamage;
    min: number;
    max: number;
    step: number;
    unit: string;
    icon: string;
    description: string;
    bullets?: string[];
}

const sliders: SliderConfig[] = [
    {
        label: "攻击伤害 d",
        model: rawDamage,
        min: 0,
        max: 100,
        step: 0.5,
        unit: "",
        icon: "lucide:sword",
        description: "攻击造成的基础伤害值。",
    },
    {
        label: "防御减伤 r",
        model: defenseReduction,
        min: 0,
        max: 100,
        step: 0.5,
        unit: "%",
        icon: "lucide:shield",
        description: "技能、状态效果等带来的额外固定减伤比例。",
    },
    {
        label: "护甲数值 v",
        model: armorValue,
        min: 0,
        max: 100,
        step: 1,
        unit: "",
        icon: "lucide:shirt",
        description: "目标当前护甲值，越高提供的减伤越多。",
    },
    {
        label: "盔甲韧性 t",
        model: armorToughness,
        min: 0,
        max: 20,
        step: 0.5,
        unit: "",
        icon: "lucide:shield-check",
        description: "减少高伤害对护甲减伤的削弱影响。",
    },
    {
        label: "附魔系数 k",
        model: enchantmentFactor,
        min: 0,
        max: 100,
        step: 1,
        unit: "%",
        icon: "lucide:book-open",
        description: "附魔保护效果的生效比例，100% 完整计算，0% 不计算。",
    },
];

const activeIndex = ref(sliders.length - 1);

function clampValue(slider: SliderConfig): void {
    const parsed = Number(slider.model.value);
    const value = Number.isNaN(parsed) ? slider.min : parsed;
    slider.model.value = Math.min(slider.max, Math.max(slider.min, value));
}

function sliderProgress(slider: SliderConfig): number {
    const range = slider.max - slider.min;
    if (range === 0) return 0;
    return ((slider.model.value - slider.min) / range) * 100;
}

function sliderBackground(slider: SliderConfig): string {
    const progress = sliderProgress(slider);
    return `linear-gradient(to right, var(--color-primary) ${progress}%, rgba(255, 255, 255, 0.12) ${progress}%)`;
}
</script>

<template>
    <div class="damage-hero">
        <div class="hero-overlay" />

        <div class="damage-card">
            <h1 class="card-title">伤害计算</h1>
            <p class="card-subtitle">调整下方参数，估算护甲与附魔减免后的实际伤害</p>

            <div class="title-divider">
                <span class="divider-diamond" />
            </div>

            <div class="tool-body">
                <div class="sliders-column">
                    <div
                        v-for="(slider, index) in sliders"
                        :key="slider.label"
                        class="slider-row"
                        @mouseenter="activeIndex = index"
                        @focusin="activeIndex = index"
                    >
                        <div class="slider-top">
                            <div class="slider-icon-name">
                                <Icon :name="slider.icon" :size="18" class="slider-icon" />
                                <label class="slider-label">{{ slider.label }}</label>
                                <Icon name="lucide:info" :size="12" class="info-icon" />
                            </div>
                            <div class="slider-value-box">
                                <input
                                    v-model.number="slider.model.value"
                                    type="number"
                                    class="value-input"
                                    :min="slider.min"
                                    :max="slider.max"
                                    :step="slider.step"
                                    @blur="clampValue(slider)"
                                />
                                <span class="value-unit">{{ slider.unit }}</span>
                            </div>
                        </div>
                        <input
                            v-model.number="slider.model.value"
                            type="range"
                            class="slider-input"
                            :min="slider.min"
                            :max="slider.max"
                            :step="slider.step"
                            :style="{ background: sliderBackground(slider) }"
                        />
                        <div class="slider-range">
                            <span>{{ slider.min }}</span>
                            <span>{{ slider.max }}{{ slider.unit }}</span>
                        </div>
                    </div>
                </div>

                <div class="explanation-panel">
                    <div class="explanation-list">
                        <div
                            v-for="(slider, index) in sliders"
                            :key="slider.label"
                            class="explanation-item"
                            :class="{ active: activeIndex === index }"
                        >
                            <div class="explanation-header">
                                <Icon :name="slider.icon" :size="16" class="explanation-icon" />
                                <span class="explanation-label">{{ slider.label }}</span>
                            </div>
                            <p class="explanation-text">{{ slider.description }}</p>
                            <ul v-if="slider.bullets" class="explanation-bullets">
                                <li v-for="bullet in slider.bullets" :key="bullet">{{ bullet }}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div class="result-panel">
                <div class="result-item">
                    <span class="result-label">最终伤害</span>
                    <span class="result-number">{{ finalDamage.toFixed(2) }}</span>
                    <div class="result-disclaimer">
                        <Icon name="lucide:info" :size="12" class="disclaimer-icon" />
                        <span>以上结果仅供参考，实际数值可能因游戏版本或模组有所差异。</span>
                    </div>
                </div>
            </div>

            <a
                class="reference-link"
                href="https://zh.minecraft.wiki/w/%E7%9B%94%E7%94%B2%E6%9C%BA%E5%88%B6#%E4%BC%A4%E5%AE%B3%E5%87%8F%E5%85%8D"
                target="_blank"
                rel="noopener noreferrer"
            >
                <span class="link-content">
                    <Icon name="lucide:book-open" :size="18" class="link-icon" />
                    <span class="link-text">查看 Minecraft Wiki：盔甲机制 · 伤害减免</span>
                </span>
                <Icon name="lucide:chevron-right" :size="18" class="link-chevron" />
            </a>
        </div>
    </div>
</template>

<style scoped>
.damage-hero {
    position: relative;
    width: 100vw;
    margin-left: calc(-50vw + 50%);
    min-height: calc(100vh - var(--vp-nav-height, 64px));
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-4) var(--space-5);
    background: url("/images/background.png") center / cover no-repeat;
    box-sizing: border-box;
}

.hero-overlay {
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at center, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, 0.6) 100%);
    pointer-events: none;
}

.damage-card {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 920px;
    background: rgba(12, 10, 8, 0.96);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(212, 137, 58, 0.22);
    border-radius: var(--radius-xl);
    padding: var(--space-5);
    box-shadow:
        0 24px 60px rgba(0, 0, 0, 0.5),
        inset 0 1px 0 rgba(255, 255, 255, 0.05);
    box-sizing: border-box;
}

.card-title {
    font-family: var(--font-heading);
    font-size: var(--font-size-h2);
    font-weight: var(--font-weight-h2);
    color: #fff;
    text-align: center;
    margin: 0 0 var(--space-1) 0;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
}

.card-subtitle {
    font-size: var(--font-size-body);
    color: rgba(255, 250, 242, 0.75);
    text-align: center;
    margin: var(--space-2) 0 var(--space-3) 0;
}

.title-divider {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    margin-bottom: var(--space-4);
    color: rgba(212, 137, 58, 0.6);
}

.title-divider::before,
.title-divider::after {
    content: "";
    flex: 1;
    height: 1px;
    max-width: 120px;
    background: linear-gradient(to right, transparent, rgba(212, 137, 58, 0.45), transparent);
}

.title-divider::after {
    background: linear-gradient(to left, transparent, rgba(212, 137, 58, 0.45), transparent);
}

.divider-diamond {
    width: 6px;
    height: 6px;
    background: rgba(212, 137, 58, 0.55);
    transform: rotate(45deg);
    flex-shrink: 0;
}

.tool-body {
    display: grid;
    grid-template-columns: 1.1fr 0.9fr;
    gap: var(--space-4);
    margin-bottom: var(--space-4);
}

.sliders-column {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
}

.slider-row {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    padding: var(--space-2) var(--space-3);
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: var(--radius-lg);
    transition: border-color 0.15s, background 0.15s;
}

.slider-row:hover {
    background: rgba(0, 0, 0, 0.28);
    border-color: rgba(212, 137, 58, 0.2);
}

.slider-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-3);
}

.slider-icon-name {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    min-width: 0;
}

.slider-icon {
    color: var(--color-primary);
}

.slider-label {
    font-size: var(--font-size-body);
    color: rgba(255, 250, 242, 0.95);
    font-weight: 500;
    white-space: nowrap;
}

.info-icon {
    color: rgba(255, 250, 242, 0.35);
    flex-shrink: 0;
}

.slider-value-box {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2px;
    min-width: 68px;
    height: 28px;
    padding: 0 var(--space-2);
    background: rgba(0, 0, 0, 0.35);
    border: 1px solid rgba(212, 137, 58, 0.35);
    border-radius: var(--radius-md);
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.3);
}

.value-input {
    width: 4.5ch;
    min-width: 4.5ch;
    max-width: 100%;
    font-family: var(--font-mono);
    font-size: var(--font-size-mono);
    color: #fff;
    background: transparent;
    border: none;
    text-align: right;
    padding: 0;
    outline: none;
    -moz-appearance: textfield;
    appearance: textfield;
}

.value-input::-webkit-outer-spin-button,
.value-input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.value-unit {
    font-family: var(--font-mono);
    font-size: var(--font-size-mono);
    color: rgba(255, 250, 242, 0.6);
}

.slider-input {
    width: 100%;
    height: 5px;
    margin: 0;
    border-radius: var(--radius-full);
    outline: none;
    -webkit-appearance: none;
    appearance: none;
    cursor: pointer;
}

.slider-input::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: var(--radius-full);
    background: var(--color-primary);
    border: 2px solid rgba(0, 0, 0, 0.6);
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
    transition: transform 0.15s, background 0.15s;
}

.slider-input::-webkit-slider-thumb:hover {
    transform: scale(1.15);
    background: var(--color-primary-hover);
}

.slider-input::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: var(--radius-full);
    background: var(--color-primary);
    border: 2px solid rgba(0, 0, 0, 0.6);
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
    cursor: pointer;
    transition: transform 0.15s, background 0.15s;
}

.slider-input::-moz-range-thumb:hover {
    transform: scale(1.15);
    background: var(--color-primary-hover);
}

.slider-range {
    display: flex;
    justify-content: space-between;
    font-size: var(--font-size-caption);
    color: rgba(255, 250, 242, 0.5);
}

.explanation-panel {
    display: flex;
    flex-direction: column;
    padding: var(--space-2);
    background: rgba(0, 0, 0, 0.18);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: var(--radius-lg);
}

.explanation-list {
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: var(--space-2);
}

.explanation-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    padding: var(--space-2);
    background: rgba(0, 0, 0, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: var(--radius-md);
    transition: border-color 0.15s, background 0.15s;
}

.explanation-item.active {
    background: rgba(212, 137, 58, 0.1);
    border-color: rgba(212, 137, 58, 0.35);
}

.explanation-header {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    margin-bottom: 2px;
}

.explanation-icon {
    color: var(--color-primary);
}

.explanation-label {
    font-size: var(--font-size-caption);
    font-weight: 500;
    color: rgba(255, 250, 242, 0.95);
}

.explanation-text {
    margin: 0;
    font-size: var(--font-size-caption);
    line-height: 1.4;
    color: rgba(255, 250, 242, 0.65);
}

.explanation-bullets {
    margin: var(--space-1) 0 0 0;
    padding-left: var(--space-3);
    font-size: var(--font-size-caption);
    line-height: 1.4;
    color: rgba(255, 250, 242, 0.65);
}

.explanation-bullets li {
    margin-bottom: 0;
}

.result-panel {
    margin-bottom: var(--space-4);
}

.result-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    padding: var(--space-4);
    background: rgba(212, 137, 58, 0.1);
    border: 1px solid rgba(212, 137, 58, 0.35);
    border-radius: var(--radius-lg);
    box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.05),
        0 4px 16px rgba(0, 0, 0, 0.2);
}

.result-label {
    font-size: var(--font-size-caption);
    color: rgba(255, 250, 242, 0.8);
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.result-number {
    font-family: var(--font-mono);
    font-size: var(--font-size-h2);
    font-weight: var(--font-weight-h2);
    color: var(--color-primary);
    text-shadow: 0 2px 12px rgba(212, 137, 58, 0.25);
}

.result-disclaimer {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-1);
    margin-top: var(--space-1);
    font-size: var(--font-size-caption);
    color: rgba(255, 250, 242, 0.5);
    text-align: center;
}

.disclaimer-icon {
    color: rgba(255, 250, 242, 0.4);
    flex-shrink: 0;
}

.reference-link {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    width: 100%;
    height: 40px;
    padding: 0 var(--space-3);
    border: 1px solid rgba(212, 137, 58, 0.3);
    border-radius: var(--radius-md);
    background: rgba(0, 0, 0, 0.2);
    color: rgba(255, 250, 242, 0.9);
    font-family: var(--font-family-base);
    font-size: var(--font-size-body);
    font-weight: 500;
    text-decoration: none;
    cursor: pointer;
    transition:
        background 0.15s,
        border-color 0.15s,
        color 0.15s;
    box-sizing: border-box;
}

.reference-link:hover {
    background: rgba(212, 137, 58, 0.12);
    border-color: rgba(212, 137, 58, 0.6);
    color: #fff;
}

.link-content {
    grid-column: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    min-width: 0;
}

.link-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.link-icon {
    color: var(--color-primary);
    flex-shrink: 0;
}

.link-chevron {
    grid-column: 3;
    justify-self: end;
    color: rgba(212, 137, 58, 0.7);
}

@media (max-width: 840px) {
    .tool-body {
        grid-template-columns: 1fr;
    }

    .explanation-panel {
        order: -1;
    }
}

@media (max-width: 720px) {
    .damage-card {
        padding: var(--space-5);
    }

    .slider-row {
        padding: var(--space-3);
    }
}
</style>
