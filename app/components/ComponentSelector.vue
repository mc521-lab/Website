<script setup lang="ts">
    import { computed } from "vue";

    interface ComponentSelectorProps {
        modelValue: string;
        noConfig?: boolean;
        forceConfig?: boolean;
    }

    // 接收父组件传来的 v-model
    const props = defineProps<ComponentSelectorProps>();
    const emit = defineEmits<{
        (e: "update:modelValue", value: string): void;
    }>();

    // 用 computed 做一个双向代理
    const selected = computed({
        get: () => props.modelValue,
        set: (val) => emit("update:modelValue", val),
    });
</script>

<template>
    <section class="flex items-center gap-3">
        <div class="cs-item">
            <input type="radio" name="radio-7" class="radio radio-sm" v-model="selected" value="ignore" :disabled="forceConfig" />
            <span :class="{ 'opacity-50': forceConfig }">不添加</span>
        </div>

        <div class="cs-item">
            <input type="radio" name="radio-7" class="radio radio-sm radio-success" v-model="selected" value="add" :disabled="forceConfig" />
            <span :class="{ 'opacity-50': forceConfig }">自定义</span>
        </div>

        <div class="cs-item" :class="{ 'cursor-not-allowed': noConfig }">
            <input type="radio" name="radio-7" class="radio radio-sm radio-warning" v-model="selected" value="config" :disabled="noConfig" />
            <span :class="{ 'opacity-50': noConfig }">使用预设</span>
        </div>
    </section>
</template>

<style scoped>
    .cs-item {
        display: inline-flex;
        align-items: center;
        gap: var(--spacing);
    }
</style>
