<script setup lang="ts">
    import { computed } from "vue";
    import { useData } from "vitepress";
    import TopBar from "./TopBar.vue";
    import HomeHero from "./HomeHero.vue";
    import WikiLayout from "./WikiLayout.vue";

    const { frontmatter, page } = useData();
    const isWiki = computed(() => (page.value.relativePath ?? "").startsWith("wiki/"));
</script>

<template>
    <TopBar v-if="!isWiki" />
    <HomeHero v-if="frontmatter.home" />
    <WikiLayout v-else-if="isWiki" />
    <main v-else class="page-main">
        <div class="page-container">
            <Content />
        </div>
    </main>
</template>

<style scoped>
    .page-main {
        min-height: 100vh;
        padding: 88px var(--space-5) var(--space-8);
        background: var(--color-background);
    }

    .page-container {
        max-width: 900px;
        margin: 0 auto;
    }
</style>
