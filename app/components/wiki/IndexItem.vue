<script setup lang="ts">
    defineProps<{
        icon: string;
        title: string;
        description: string;
    }>();
</script>

<template>
    <div class="card bg-base-100 cursor-pointer hover:shadow-[0_0_4px_2px]! hover:shadow-base-content/75">
        <div class="card-body py-6">
            <h2 class="card-title"><Icon :name="$props.icon" size="22" class="mb-0.5" /> {{ $props.title }}</h2>
            <p class="text-left">{{ $props.description }}</p>
        </div>
    </div>
</template>
