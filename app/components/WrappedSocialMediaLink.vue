<script setup lang="ts">
    interface WrappedSocialMediaLinkProps {
        href: string;
        text: string;
    }

    const props = defineProps<WrappedSocialMediaLinkProps>();
</script>

<template>
    <a :href="props.href" target="_blank" class="ml-0.5 mr-2">{{ props.href }}</a>
    <span class="opacity-50 text-base">< 点击{{ props.text }}</span>
</template>
