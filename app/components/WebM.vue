<script setup lang="ts">
    defineProps<{
        src: string;
        poster?: string;
    }>();
</script>

<template>
    <video :src="src" :poster="poster" muted autoplay preload="metadata"></video>
</template>

<style scoped lang="scss">
    video {
        position: relative;
        width: 100%;
    }
</style>
