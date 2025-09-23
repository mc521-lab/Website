<script setup lang="ts">
    import { onMounted, onUnmounted, watch, useTemplateRef, ref } from "vue";
    import { gsap } from "gsap";
    import { ScrollTrigger } from "gsap/ScrollTrigger";

    gsap.registerPlugin(ScrollTrigger);

    interface AnimatedContentProps {
        distance?: number;
        direction?: "vertical" | "horizontal";
        reverse?: boolean;
        duration?: number;
        ease?: string | ((progress: number) => number);
        initialOpacity?: number;
        animateOpacity?: boolean;
        scale?: number;
        threshold?: number;
        delay?: number;
        className?: string;
        manual?: boolean;
    }

    const props = withDefaults(defineProps<AnimatedContentProps>(), {
        distance: 100,
        direction: "vertical",
        reverse: false,
        duration: 0.8,
        ease: "power3.out",
        initialOpacity: 0,
        animateOpacity: true,
        scale: 1,
        threshold: 0.1,
        delay: 0,
        className: "",
        manual: false,
    });

    const emit = defineEmits<{
        complete: [];
    }>();

    const containerRef = useTemplateRef<HTMLDivElement>("containerRef");
    const isAnimating = ref(!props.manual);

    const animate = () => {
        const el = containerRef.value;
        if (!el) return;

        const axis = props.direction === "horizontal" ? "x" : "y";
        const offset = props.reverse ? -props.distance : props.distance;
        const startPct = (1 - props.threshold) * 100;

        gsap.set(el, {
            [axis]: offset,
            scale: props.scale,
            opacity: props.animateOpacity ? props.initialOpacity : 1,
        });

        gsap.to(el, {
            [axis]: 0,
            scale: 1,
            opacity: 1,
            duration: props.duration,
            ease: props.ease,
            delay: props.delay,
            onComplete: () => emit("complete"),
            scrollTrigger: props.manual
                ? undefined
                : {
                      trigger: el,
                      start: `top ${startPct}%`,
                      toggleActions: "play none none none",
                      once: true,
                  },
        });

        isAnimating.value = true;
    };

    defineExpose({ animating: animate });

    onMounted(() => {
        if (!props.manual) {
            animate();
        } else {
            const el = containerRef.value;
            if (el) {
                const axis = props.direction === "horizontal" ? "x" : "y";
                const offset = props.reverse ? -props.distance : props.distance;
                gsap.set(el, {
                    [axis]: offset,
                    scale: props.scale,
                    opacity: props.animateOpacity ? props.initialOpacity : 1,
                });
            }
        }
    });

    watch(
        () => [
            props.distance,
            props.direction,
            props.reverse,
            props.duration,
            props.ease,
            props.initialOpacity,
            props.animateOpacity,
            props.scale,
            props.threshold,
            props.delay,
            props.manual,
        ],
        () => {
            const el = containerRef.value;
            if (!el) return;

            ScrollTrigger.getAll().forEach((t) => t.kill());
            gsap.killTweensOf(el);

            if (!props.manual || isAnimating.value) {
                animate();
            } else {
                const axis = props.direction === "horizontal" ? "x" : "y";
                const offset = props.reverse ? -props.distance : props.distance;
                gsap.set(el, {
                    [axis]: offset,
                    scale: props.scale,
                    opacity: props.animateOpacity ? props.initialOpacity : 1,
                });
            }
        },
        { deep: true }
    );

    onUnmounted(() => {
        const el = containerRef.value;
        if (el) {
            ScrollTrigger.getAll().forEach((t) => t.kill());
            gsap.killTweensOf(el);
        }
    });
</script>

<template>
    <div ref="containerRef" :class="`animated-content ${props.className}`">
        <slot />
    </div>
</template>
