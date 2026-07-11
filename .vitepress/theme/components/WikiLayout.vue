<script setup lang="ts">
    import { useData } from "vitepress";
    import { Content } from "vitepress";
    import TopBar from "./TopBar.vue";
    import WikiSidebar from "./WikiSidebar.vue";

    const { frontmatter } = useData();
</script>

<template>
    <TopBar />

    <div class="wiki-page">
        <div class="wiki-layout">
            <WikiSidebar />

            <main class="wiki-main">
                <header class="wiki-header">
                    <h1 class="wiki-title">{{ frontmatter.title || "文档" }}</h1>
                    <p v-if="frontmatter.description" class="wiki-description">{{ frontmatter.description }}</p>
                </header>

                <div class="vp-doc wiki-content">
                    <Content />
                </div>
            </main>
        </div>
    </div>
</template>

<style scoped>
    .wiki-page {
        position: relative;
        box-sizing: border-box;
        height: 100vh;
        max-height: 100vh;
        padding: 64px 0 0 0;
        overflow: hidden;
        background-image: url(/images/background.png);
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
    }

    .wiki-page::before {
        content: "";
        position: fixed;
        inset: 0;
        background: radial-gradient(ellipse at center, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, 0.6) 100%);
        z-index: 0;
        pointer-events: none;
    }

    .wiki-layout {
        height: 100%;
        position: relative;
        z-index: 1;
        display: grid;
        grid-template-columns: 280px minmax(0, 1fr);
    }

    .wiki-main {
        min-width: 0;
        height: 100%;
        overflow-y: auto;
        background: rgba(255, 250, 242, 0.9);
        padding: var(--space-6);
        color: #1a1612;
    }

    .wiki-header {
        margin-bottom: var(--space-5);
    }

    .wiki-title {
        font-family: var(--font-heading);
        font-size: var(--font-size-h2);
        font-weight: var(--font-weight-h2);
        color: #1a1612;
        margin: 0 0 var(--space-2);
    }

    .wiki-description {
        font-size: var(--font-size-body);
        color: #7c6b55;
        margin: 0;
        line-height: var(--line-height-body);
    }

    .wiki-content {
        color: #1a1612;
    }

    /* Light-theme overrides for VitePress markdown inside wiki panels */
    .wiki-main :deep(.vp-doc h1),
    .wiki-main :deep(.vp-doc h2),
    .wiki-main :deep(.vp-doc h3),
    .wiki-main :deep(.vp-doc h4) {
        color: #1a1612;
        border-color: rgba(0, 0, 0, 0.08);
    }

    .wiki-main :deep(.vp-doc p),
    .wiki-main :deep(.vp-doc li),
    .wiki-main :deep(.vp-doc td),
    .wiki-main :deep(.vp-doc th) {
        color: #1a1612;
    }

    .wiki-main :deep(.vp-doc a) {
        color: var(--accent);
    }

    .wiki-main :deep(.vp-doc a:hover) {
        color: var(--accent-hover);
    }

    .wiki-main :deep(.vp-doc blockquote) {
        color: #7c6b55;
        border-left-color: var(--accent);
        background: rgba(0, 0, 0, 0.04);
    }

    .wiki-main :deep(.vp-doc code) {
        color: #1a1612;
        background: rgba(0, 0, 0, 0.08);
    }

    .wiki-main :deep(.vp-doc div[class*="language-"]) {
        background: rgba(0, 0, 0, 0.06);
    }

    .wiki-main :deep(.vp-doc table),
    .wiki-main :deep(.vp-doc .vp-table) {
        color: #1a1612;
    }

    .wiki-main :deep(.vp-doc th),
    .wiki-main :deep(.vp-doc td) {
        color: #1a1612 !important;
        background-color: transparent !important;
        border-color: rgba(0, 0, 0, 0.08) !important;
    }

    .wiki-main :deep(.vp-doc th) {
        background-color: rgba(0, 0, 0, 0.06) !important;
    }

    .wiki-main :deep(.vp-doc tr),
    .wiki-main :deep(.vp-doc .vp-table tr) {
        background-color: transparent !important;
    }

    .wiki-main :deep(.vp-doc tr:nth-child(2n)),
    .wiki-main :deep(.vp-doc .vp-table tr:nth-child(2n)) {
        background-color: rgba(0, 0, 0, 0.03) !important;
    }

    .wiki-main :deep(.vp-doc hr) {
        border-top-color: rgba(0, 0, 0, 0.08);
    }

    @media (max-width: 900px) {
        .wiki-layout {
            grid-template-columns: minmax(0, 1fr);
        }

        .wiki-main {
            padding: var(--space-5);
        }
    }
</style>
