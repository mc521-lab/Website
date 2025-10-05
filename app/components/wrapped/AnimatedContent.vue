<script setup lang="ts">
    import AnimatedContent from "../vuebits/animations/AnimatedContent.vue";

    // Props
    interface AnimatedContentProps {
        distance?: number;
        direction?: "vertical" | "horizontal";
        reverse?: boolean;
        duration?: number;
        ease?: string;
        initialOpacity?: number;
        animateOpacity?: boolean;
        scale?: number;
        threshold?: number;
        delay?: number;
        manual?: boolean;
    }
    const props = withDefaults(defineProps<AnimatedContentProps>(), {
        distance: 25,
        direction: "vertical",
        reverse: false,
        duration: 0.5,
        ease: "power3.out",
        initialOpacity: 0,
        animateOpacity: true,
        scale: 1,
        threshold: 0.1,
        delay: 0,
        manual: false,
    });

    // Emit
    const emit = defineEmits(["complete"]);

    // Expose
    const animatedContentRef = ref<typeof AnimatedContent>();
    defineExpose({
        animating: () => {
            animatedContentRef.value?.animating();
        },
    });
</script>

<template>
    <AnimatedContent
        ref="animatedContentRef"
        :distance="props.distance"
        :direction="props.direction"
        :reverse="props.reverse"
        :duration="props.duration"
        :ease="props.ease"
        :initial-opacity="props.initialOpacity"
        :animate-opacity="props.animateOpacity"
        :scale="props.scale"
        :threshold="props.threshold"
        :delay="props.delay"
        :manual="props.manual"
        @complete="emit('complete')">
        <slot></slot>
    </AnimatedContent>
</template>
