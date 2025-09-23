<script setup lang="ts">
    interface AlertProps {
        message: string;
        level: "info" | "success" | "warning" | "error";
        duration?: number; // 毫秒，默认 3000
    }
    const props = defineProps<AlertProps>();

    const visible = ref(true);

    // 自动关闭
    onMounted(() => {
        const timeout = props.duration ?? 3000;
        setTimeout(() => {
            visible.value = false;
        }, timeout);
    });

    function close() {
        visible.value = false;
    }
</script>

<template>
    <Transition
        enter-active-class="transition-opacity duration-150 ease-in-out"
        leave-active-class="transition-opacity duration-150 ease-in-out"
        enter-from-class="opacity-0"
        leave-to-class="opacity-0">
        <div v-if="visible">
            <!-- info -->
            <div v-if="props.level === 'info'" class="alert alert-info">
                <span class="font-bold translate-y-0.25">{{ props.message }}</span>
            </div>

            <!-- success -->
            <div v-else-if="props.level === 'success'" class="alert alert-success">
                <span class="font-bold translate-y-0.25">{{ props.message }}</span>
            </div>

            <!-- warning -->
            <div v-else-if="props.level === 'warning'" class="alert alert-warning">
                <span class="font-bold translate-y-0.25">{{ props.message }}</span>
            </div>

            <!-- error -->
            <div v-else-if="props.level === 'error'" class="alert alert-error">
                <span class="font-bold translate-y-0.25">{{ props.message }}</span>
            </div>
        </div>
    </Transition>
</template>
