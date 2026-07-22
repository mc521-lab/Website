<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue";
import { SkinViewer, IdleAnimation } from "skinview3d";

const props = defineProps<{
    skin: string | null;
}>();

const canvasRef = ref<HTMLCanvasElement | null>(null);
let viewer: SkinViewer | null = null;

function createViewer(canvas: HTMLCanvasElement): SkinViewer {
    const instance = new SkinViewer({
        canvas,
        width: 320,
        height: 400,
        enableControls: true,
    });

    instance.animation = new IdleAnimation();
    instance.animation.speed = 0.8;
    instance.autoRotate = true;
    instance.autoRotateSpeed = 0.6;
    instance.controls.enableZoom = false;
    instance.controls.enablePan = false;

    return instance;
}

function loadSkinSource(source: string | null): void {
    if (!viewer) return;
    if (source === null) {
        viewer.loadSkin(null);
        return;
    }
    viewer.loadSkin(source);
}

onMounted(() => {
    if (!canvasRef.value) return;
    viewer = createViewer(canvasRef.value);
    if (props.skin) {
        loadSkinSource(props.skin);
    }
});

onUnmounted(() => {
    viewer?.dispose();
    viewer = null;
});

watch(
    () => props.skin,
    (newSkin) => {
        loadSkinSource(newSkin);
    },
);
</script>

<template>
    <div class="skin-view-3d">
        <canvas ref="canvasRef" class="skin-canvas" />
    </div>
</template>

<style scoped>
.skin-view-3d {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: var(--space-4);
    background: rgba(0, 0, 0, 0.25);
    border-radius: var(--radius-md);
}

.skin-canvas {
    max-width: 100%;
    height: auto;
    border-radius: var(--radius-sm);
}
</style>
