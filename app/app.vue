<script setup lang="ts">
    import "~/assets/main.css";
    import DarkVeil from "~/components/vuebits/background/DarkVeil.vue";
    import AlertItem from "~/components/AlertItem.vue";
    import { ref } from "vue";

    const eventbus = useEventBus();
    const alerts = ref<{ id: number; message: string; level: "info" | "success" | "warning" | "error" }[]>([]);
    let idCounter = 0;

    eventbus.on("notify", (e) => {
        alerts.value.push({ id: idCounter++, ...e });
    });
</script>

<template>
    <NuxtLayout>
        <DarkVeil class="-z-10 fixed top-0 left-0 min-h-screen" />
        <NuxtPage />
    </NuxtLayout>
    <div class="toast">
        <AlertItem v-for="a in alerts" :key="a.id" :message="a.message" :level="a.level" />
    </div>
</template>

