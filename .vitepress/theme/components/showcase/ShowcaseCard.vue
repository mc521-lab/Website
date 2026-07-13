<script setup lang="ts">
    import Icon from "../Icon.vue";

    const props = defineProps<{
        title: string;
        badge?: string;
        image?: string;
        icon?: string;
    }>();
</script>

<template>
    <article :class="['showcase-card', title.includes('秘宝') ? 'treasure' : '']">
        <header class="card-header">
            <h3 class="card-title">{{ title }}</h3>
            <slot name="badge">
                <span v-if="badge" class="badge">{{ badge }}</span>
            </slot>
        </header>
        <div class="card-divider" />
        <div class="card-body">
            <div class="card-media">
                <img v-if="image" :src="image" :alt="title" class="media-image" />
                <Icon v-else :name="icon ?? 'lucide:box'" :size="36" />
            </div>
            <div class="card-content">
                <slot />
            </div>
        </div>
    </article>
</template>

<style scoped>
    .showcase-card {
        display: flex;
        flex-direction: column;
        background: var(--card-base, rgba(255, 255, 255, 0.72));
        border: 1px solid rgba(0, 0, 0, 0.08);
        border-radius: 12px;
        padding: 12px;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
        overflow: hidden;
    }
    .treasure {
        grid-column: span 3;
        background: color-mix(in srgb, var(--card-mix) 5%, var(--card-base, rgba(255, 255, 255, 0.72)));
    }
    .card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        margin-bottom: 8px;
    }
    .card-title {
        font-size: 0.9375rem;
        margin: 0;
        color: #1a1612;
        text-align: left;
    }
    .badge {
        font-size: 0.75rem;
        padding: 2px 8px;
        border-radius: 999px;
        background: rgba(0, 0, 0, 0.05);
        color: #5c4d3d;
        white-space: nowrap;
        flex-shrink: 0;
    }
    .card-divider {
        height: 1px;
        background: rgba(0, 0, 0, 0.08);
        margin-bottom: 10px;
    }
    .card-body {
        display: flex;
        gap: 12px;
        align-items: flex-start;
    }
    .card-media {
        width: 64px;
        height: 64px;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 10px;
        background: rgba(0, 0, 0, 0.04);
        color: #7c6b55;
    }
    .media-image {
        width: 85%;
        height: 85%;
        object-fit: contain;
        border-radius: 8px;
    }
    .card-content {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 5px;
    }
</style>
