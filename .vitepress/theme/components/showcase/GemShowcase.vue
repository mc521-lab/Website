<script setup lang="ts">
    import { data } from "@data/gems.data";
    import GemCard from "./GemCard.vue";

    const { gems } = data;
</script>

<template>
    <section class="showcase">
        <div class="grid">
            <GemCard v-for="gem in gems" :key="gem.id" :item="gem" />
        </div>
    </section>
</template>

<style scoped>
    .showcase {
        display: flex;
        flex-direction: column;
        gap: 32px;
    }

    .grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 16px;
    }
</style>
