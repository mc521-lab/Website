<script setup lang="ts">
import { ref, computed } from "vue";

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
}

const sliders: SliderConfig[] = [
    { label: "原始伤害 d", model: rawDamage, min: 0, max: 100, step: 0.5, unit: "" },
    { label: "防御减伤 r", model: defenseReduction, min: 0, max: 100, step: 0.5, unit: "%" },
    { label: "护甲数值 v", model: armorValue, min: 0, max: 100, step: 1, unit: "" },
    { label: "盔甲韧性 t", model: armorToughness, min: 0, max: 20, step: 0.5, unit: "" },
    { label: "附魔系数 k", model: enchantmentFactor, min: 0, max: 100, step: 1, unit: "%" },
];

function formatValue(value: number): string {
    return Number.isInteger(value) ? value.toString() : value.toFixed(1);
}
</script>

<template>
    <div class="damage-hero">
        <div class="hero-overlay" />

        <div class="damage-card">
            <h1 class="card-title">伤害计算</h1>
            <p class="card-subtitle">调整下方参数，估算护甲与附魔减免后的实际伤害</p>

            <div class="sliders-panel">
                <div v-for="slider in sliders" :key="slider.label" class="slider-row">
                    <div class="slider-header">
                        <label class="slider-label">{{ slider.label }}</label>
                        <span class="slider-value">{{ formatValue(slider.model.value) }}{{ slider.unit }}</span>
                    </div>
                    <input
                        v-model.number="slider.model.value"
                        type="range"
                        class="slider-input"
                        :min="slider.min"
                        :max="slider.max"
                        :step="slider.step"
                    />
                    <div class="slider-range">
                        <span>{{ slider.min }}</span>
                        <span>{{ slider.max }}</span>
                    </div>
                </div>
            </div>

            <div class="result-panel">
                <div class="result-item">
                    <span class="result-label">最终伤害</span>
                    <span class="result-number">{{ finalDamage.toFixed(2) }}</span>
                </div>
            </div>

            <a
                class="reference-link"
                href="https://zh.minecraft.wiki/w/%E7%9B%94%E7%94%B2%E6%9C%BA%E5%88%B6#%E4%BC%A4%E5%AE%B3%E5%87%8F%E5%85%8D"
                target="_blank"
                rel="noopener noreferrer"
            >
                查看 Minecraft Wiki：盔甲机制 · 伤害减免
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
    padding: var(--space-5);
    background: url("/images/background.png") center / cover no-repeat;
    box-sizing: border-box;
}

.hero-overlay {
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at center, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.55) 100%);
    pointer-events: none;
}

.damage-card {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 640px;
    background: rgba(14, 11, 9, 0.96);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: var(--radius-xl);
    padding: var(--space-6);
    box-shadow: var(--shadow-4);
    box-sizing: border-box;
}

.card-title {
    font-family: var(--font-heading);
    font-size: var(--font-size-h2);
    font-weight: var(--font-weight-h2);
    color: #fff;
    text-align: center;
    margin: 0 0 var(--space-2) 0;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
}

.card-subtitle {
    font-size: var(--font-size-body);
    color: rgba(255, 250, 242, 0.95);
    text-align: center;
    margin: 0 0 var(--space-5) 0;
}

.sliders-panel {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
    margin-bottom: var(--space-5);
    padding: var(--space-5);
    background: rgba(0, 0, 0, 0.25);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: var(--radius-lg);
}

.slider-row {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
}

.slider-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-2);
}

.slider-label {
    font-size: var(--font-size-body);
    color: rgba(255, 250, 242, 0.95);
    font-weight: 500;
}

.slider-value {
    font-family: var(--font-mono);
    font-size: var(--font-size-mono);
    color: #fff;
    min-width: 64px;
    text-align: right;
}

.slider-input {
    width: 100%;
    height: 6px;
    margin: 0;
    border-radius: var(--radius-full);
    background: rgba(255, 255, 255, 0.2);
    outline: none;
    -webkit-appearance: none;
    appearance: none;
    cursor: pointer;
}

.slider-input::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: var(--radius-full);
    background: var(--color-primary);
    border: 2px solid rgba(0, 0, 0, 0.6);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
    transition: transform 0.15s, background 0.15s;
}

.slider-input::-webkit-slider-thumb:hover {
    transform: scale(1.1);
    background: var(--color-primary-hover);
}

.slider-input::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: var(--radius-full);
    background: var(--color-primary);
    border: 2px solid rgba(0, 0, 0, 0.6);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
    cursor: pointer;
    transition: transform 0.15s, background 0.15s;
}

.slider-input::-moz-range-thumb:hover {
    transform: scale(1.1);
    background: var(--color-primary-hover);
}

.slider-range {
    display: flex;
    justify-content: space-between;
    font-size: var(--font-size-caption);
    color: rgba(255, 250, 242, 0.75);
}

.result-panel {
    margin-bottom: var(--space-5);
}

.result-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-1);
    padding: var(--space-5);
    background: rgba(212, 137, 58, 0.12);
    border: 1px solid rgba(212, 137, 58, 0.3);
    border-radius: var(--radius-lg);
}

.result-label {
    font-size: var(--font-size-caption);
    color: rgba(255, 250, 242, 0.85);
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.result-number {
    font-family: var(--font-mono);
    font-size: var(--font-size-h2);
    font-weight: var(--font-weight-h2);
    color: var(--color-primary);
}

.reference-link {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: var(--size-button-md);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background: transparent;
    color: rgba(255, 250, 242, 0.95);
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
    background: var(--color-surface-container-low);
    border-color: var(--color-primary);
    color: #fff;
}

@media (max-width: 720px) {
    .damage-card {
        padding: var(--space-5);
    }
}
</style>
