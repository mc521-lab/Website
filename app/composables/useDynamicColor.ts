import { ref, computed, onMounted, onUnmounted } from "vue";

export interface DynamicColorOptions {
    light: string;
    dark: string;
}

export const useDynamicColor = (options: DynamicColorOptions) => {
    const isDark = ref(false);
    let mediaQuery: MediaQueryList | null = null;

    const updateIsDark = () => {
        isDark.value = window.matchMedia("(prefers-color-scheme: dark)").matches;
    };

    onMounted(() => {
        mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        updateIsDark();
        mediaQuery.addEventListener("change", updateIsDark);
    });

    onUnmounted(() => {
        mediaQuery?.removeEventListener("change", updateIsDark);
    });

    const color = computed(() => (isDark.value ? options.dark : options.light));

    return {
        isDark,
        color,
    };
};
