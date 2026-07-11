<script setup lang="ts">
    import { Icon as IconifyIcon } from "@iconify/vue";

    const props = defineProps<{
        name?: string;
        size?: number | string;
    }>();

    const DefaultSize = 20;

    if (!props.name) {
        throw new Error("IllegalArgumentException: Icon name is required");
    }
</script>

<template>
    <IconifyIcon class="jtg-icon" :icon="name!" :width="size ?? DefaultSize" :height="size ?? DefaultSize" />
</template>

<style scoped>
    .jtg-icon {
        display: inline-block;
        flex-shrink: 0;
        vertical-align: middle;
    }
</style>
