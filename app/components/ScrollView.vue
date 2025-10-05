<script setup lang="ts">
    defineProps<{
        height?: string; // 可选：高度，默认 300px
        width?: string; // 可选：宽度，默认 100%
    }>();

    const defaultHeight = "300px";
    const defaultWidth = "100%";
</script>

<template>
    <div :style="{ height: height || defaultHeight, width: width || defaultWidth }" class="overflow-auto p-2">
        <slot />
    </div>
</template>
