<script setup lang="ts">
    import { gsap } from "gsap";
    import { nextTick, onBeforeUpdate, onMounted, onUnmounted, ref, watch, type VNodeRef } from "vue";

    type CardNavLink = {
        label: string;
        href?: string;
        ariaLabel: string;
        target?: string;
    };

    export type CardNavItem = {
        label: string;
        bgColor: string;
        textColor: string;
        links: CardNavLink[];
    };

    export interface CardNavProps {
        logoAlt?: string;
        items: CardNavItem[];
        buttonText: string;
        className?: string;
        ease?: string;
        baseColor?: string;
        menuColor?: string;
        buttonBgColor?: string;
        buttonTextColor?: string;
    }

    const props = withDefaults(defineProps<CardNavProps>(), {
        logoAlt: "Logo",
        className: "",
        ease: "power3.out",
        baseColor: "#fff",
    });

    const isHamburgerOpen = ref(false);
    const isExpanded = ref(false);

    const menuBtnRef = ref<HTMLDivElement | null>(null);
    const navRef = ref<HTMLDivElement | null>(null);
    const cardsRef = ref<HTMLDivElement[]>([]);
    const tlRef = ref<gsap.core.Timeline | null>(null);

    const setCardRef =
        (i: number): VNodeRef =>
        (el) => {
            if (el && el instanceof HTMLDivElement) {
                cardsRef.value[i] = el;
            }
        };

    onBeforeUpdate(() => {
        cardsRef.value = [];
    });

    const calculateHeight = () => {
        const navEl = navRef.value;
        if (!navEl) return 260;

        const isMobile = window.matchMedia("(max-width: 768px)").matches;
        if (isMobile) {
            const contentEl = navEl.querySelector(".card-nav-content") as HTMLElement;
            if (contentEl) {
                const wasVisible = contentEl.style.visibility;
                const wasPosition = contentEl.style.position;
                const wasHeight = contentEl.style.height;

                contentEl.style.visibility = "visible";
                contentEl.style.position = "static";
                contentEl.style.height = "auto";

                const topBar = 60;
                const padding = 16;
                const contentHeight = contentEl.scrollHeight;

                contentEl.style.visibility = wasVisible;
                contentEl.style.position = wasPosition;
                contentEl.style.height = wasHeight;

                return topBar + contentHeight + padding;
            }
        }
        return 260;
    };

    const createTimeline = () => {
        const navEl = navRef.value;
        if (!navEl) return null;

        gsap.set(navEl, { height: 60, overflow: "hidden" });
        gsap.set(cardsRef.value, { y: 50, opacity: 0 });

        const tl = gsap.timeline({ paused: true });

        tl.to(navEl, {
            height: calculateHeight,
            duration: 0.4,
            ease: props.ease,
        });

        tl.to(cardsRef.value, { y: 0, opacity: 1, duration: 0.4, ease: props.ease, stagger: 0.08 }, "-=0.1");

        return tl;
    };

    const toggleMenu = () => {
        const tl = tlRef.value;
        if (!tl) return;
        if (!isExpanded.value) {
            isHamburgerOpen.value = true;
            isExpanded.value = true;
            nextTick(() => {
                tl.play(0);
            });
        } else {
            isHamburgerOpen.value = false;
            tl.eventCallback("onReverseComplete", () => {
                isExpanded.value = false;
                tl.eventCallback("onReverseComplete", null);
            });
            tl.reverse();
        }
    };

    const handleResize = () => {
        if (!tlRef.value) return;

        if (isExpanded.value) {
            const newHeight = calculateHeight();
            gsap.set(navRef.value, { height: newHeight });

            tlRef.value.kill();
            const newTl = createTimeline();
            if (newTl) {
                newTl.progress(1);
                tlRef.value = newTl;
            }
        } else {
            tlRef.value.kill();
            tlRef.value = createTimeline();
        }
    };

    onMounted(() => {
        tlRef.value = createTimeline();
        window.addEventListener("resize", handleResize);
    });

    onUnmounted(() => {
        tlRef.value?.kill();
        tlRef.value = null;
        window.removeEventListener("resize", handleResize);
    });

    watch(
        () => [props.ease, props.items],
        () => {
            nextTick(() => {
                if (tlRef.value) tlRef.value.kill();
                tlRef.value = createTimeline();
            });
        }
    );
</script>

<template>
    <section class="fixed backdrop-blur-sm w-full h-[95px] md:h-[110px] z-[99] py-[1.2em] md:py-[1.5em]">
        <div :class="`card-nav-container absolute left-1/2 -translate-x-1/2 w-[90%] max-w-[800px] ${props.className}`">
            <nav
                ref="navRef"
                :class="['card-nav block h-[60px] p-0 rounded-xl shadow-md relative overflow-hidden will-change-[height]', { open: isExpanded }]"
                :style="{ backgroundColor: props.baseColor }">
                <div class="card-nav-top top-0 z-[2] absolute inset-x-0 flex justify-between items-center p-2 px-[1.1rem] h-[60px]">
                    <div
                        ref="menuBtnRef"
                        :class="[
                            'hamburger-menu group h-full flex flex-col items-center justify-center cursor-pointer gap-[6px] order-2 md:order-none',
                            { open: isHamburgerOpen },
                        ]"
                        @click="toggleMenu"
                        role="button"
                        :aria-label="isExpanded ? 'Close menu' : 'Open menu'"
                        tabindex="0"
                        :style="{ color: props.menuColor || '#000' }">
                        <div
                            :class="[
                                'hamburger-line w-[30px] h-[2px] bg-current transition-[transform,opacity,margin] duration-300 ease-linear [transform-origin:50%_50%] group-hover:opacity-75',
                                { 'translate-y-[4px] rotate-45': isHamburgerOpen },
                            ]" />
                        <div
                            :class="[
                                'hamburger-line w-[30px] h-[2px] bg-current transition-[transform,opacity,margin] duration-300 ease-linear [transform-origin:50%_50%] group-hover:opacity-75',
                                { '-translate-y-[4px] -rotate-45': isHamburgerOpen },
                            ]" />
                    </div>

                    <div
                        class="md:top-1/2 md:left-1/2 md:absolute flex items-center order-1 md:order-none md:-translate-x-1/2 md:-translate-y-1/2 logo-container text-base-content"
                        @click="$router.push('/')">
                        <svg
                            viewBox="0 0 169.357 48"
                            class="h-[28px] logo"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlns:xlink="http://www.w3.org/1999/xlink"
                            width="169.357193"
                            height="48.000000"
                            fill="none"
                            customFrame="#000000">
                            <path
                                d="M60.8068 48C61.1574 47.2648 61.5164 46.3543 61.884 45.2685Q62.4355 43.6399 62.8458 41.6265C63.128 40.2757 63.3631 38.8309 63.5512 37.292C63.7478 35.7446 63.8461 34.1501 63.8461 32.5087L63.8461 2.30831L82.0305 2.30831C81.9535 1.88939 81.8552 1.48758 81.7355 1.10286C81.6158 0.709591 81.5047 0.341972 81.4021 0L91.9562 0C92.1956 0.589901 92.4563 1.35934 92.7384 2.30831L108.871 2.30831L108.871 8.60486L71.3609 8.60486L71.3609 32.8293Q71.3609 38.6513 70.7326 42.2549C70.3137 44.6487 69.7708 46.5637 69.1039 48L60.8068 48ZM126.525 4.61662C127.243 6.25808 127.88 7.81833 128.436 9.29735L137.002 9.29735Q135.797 6.50174 134.745 4.21908C134.044 2.6973 133.343 1.29094 132.642 0L124.448 0C125.115 1.42773 125.807 2.9666 126.525 4.61662ZM149.108 26.8149Q150.134 27.4689 151.186 28.046L161.637 28.046L161.637 35.4967C161.637 36.8303 161.505 38.1042 161.24 39.3182C160.983 40.5236 160.624 41.6607 160.162 42.7294C159.709 43.798 159.201 44.7769 158.636 45.666C158.081 46.5552 157.508 47.3332 156.918 48L166.318 48C166.839 47.1622 167.293 46.226 167.677 45.1916C168.062 44.1571 168.378 43.0884 168.626 41.9856C168.874 40.8827 169.058 39.7799 169.178 38.677Q169.357 37.0227 169.357 35.4967L169.357 1.03874L137.849 1.03874L137.849 6.97622L161.637 6.97622L161.637 27.8279C159.962 26.8191 158.273 25.7462 156.572 24.6091C154.87 23.4635 153.336 22.3692 151.968 21.3262C153.584 19.7788 155.118 18.1117 156.572 16.3249C158.025 14.5381 159.243 12.6487 160.227 10.6567L145.877 10.6567L146.672 9.18194L139.106 9.18194C138.336 10.6524 137.361 12.264 136.182 14.0166C135.01 15.7692 133.762 17.3978 132.437 18.9025L137.733 18.9025Q138.631 19.6334 139.542 20.3003C140.157 20.7363 140.764 21.1809 141.363 21.634C140.661 22.1982 139.96 22.7411 139.259 23.2626C138.558 23.7841 137.832 24.3014 137.079 24.8143C136.327 25.3187 135.54 25.836 134.72 26.366C133.899 26.8875 132.997 27.4475 132.014 28.046L132.014 10.8619L124.243 10.8619L124.243 48L132.014 48L132.014 28.046L142.619 28.046C143.953 27.3791 145.406 26.5028 146.979 25.417Q148.082 26.148 149.108 26.8149ZM44.4349 10.6054L44.4349 1.10286L4.14213 1.10286L4.14213 7.5533L12.5546 7.5533L12.1314 10.6054L1.35934 10.6054L1.35934 17.0174L11.0799 17.0174L10.4515 20.0566L3.83436 20.0566L3.83436 26.5712L8.77157 26.5712Q6.98905 32.8806 4.74486 38.1384Q2.51349 43.3834 0 48L8.82287 48C9.6265 46.4953 10.4301 44.8752 11.2338 43.1397Q12.4392 40.5493 13.6062 37.5485L13.6062 48L45.1659 48L45.1659 29.4053L16.3377 29.4053C16.4745 28.9522 16.5942 28.4905 16.6968 28.0203C16.8079 27.5415 16.9319 27.0585 17.0687 26.5712L44.4349 26.5712L44.4349 17.0174L47.9487 17.0174L47.9487 10.6054L44.4349 10.6054ZM20.4798 9.11782C20.5482 8.60486 20.6209 8.08335 20.6978 7.5533L36.343 7.5533L36.343 10.6054L20.2746 10.6054C20.343 10.1181 20.4114 9.62223 20.4798 9.11782ZM94.2132 22.0572L94.2132 17.2225L87.3267 17.7483L87.3267 11.8108L107.922 10.1822L107.922 16.171L101.407 16.6968L101.407 22.0572L108.768 22.0572L108.768 28.1485L101.407 28.1485L101.407 33.5089L107.871 33.5089L107.871 39.6003L87.6986 39.6003L87.6986 33.5089L94.2132 33.5089L94.2132 28.1485L86.9677 28.1485L86.9677 22.0572L94.2132 22.0572ZM71.4635 47.9487C72.0962 46.4782 72.7075 44.965 73.2974 43.409C73.8958 41.8531 74.4729 40.2885 75.0286 38.7155C75.5928 37.1338 76.1186 35.5822 76.6059 34.0604C77.1018 32.5386 77.5592 31.0938 77.9781 29.7259L72.8357 29.7259C73.7419 27.657 74.5797 25.5752 75.3492 23.4806C76.1272 21.3775 76.8111 19.377 77.401 17.479L72.6818 17.479L72.6818 11.1312L86.4419 11.1312C85.946 13.0206 85.3219 15.175 84.5696 17.5944C83.8173 20.0053 82.988 22.4205 82.0817 24.84L86.5445 24.84Q85.5442 28.7769 84.1721 33.2396C83.2658 36.2148 82.304 39.1387 81.2867 42.0112L109.076 42.0112L109.076 47.9487L71.4635 47.9487ZM141.863 16.9148C142.059 16.6668 142.243 16.4018 142.414 16.1197L150.288 16.1197C149.869 16.607 149.36 17.1584 148.762 17.774Q147.877 18.6973 146.877 19.5309C146.424 19.2145 145.996 18.8939 145.594 18.5691C145.193 18.2356 144.851 17.9279 144.569 17.6457L141.26 17.6457C141.465 17.3978 141.666 17.1542 141.863 16.9148ZM36.343 17.0174L36.343 20.0566L18.646 20.0566C18.7486 19.5693 18.8512 19.0735 18.9538 18.5691C19.0649 18.0561 19.1547 17.5389 19.2231 17.0174L36.343 17.0174ZM158.701 43.486L158.701 29.1488L134.848 29.1488L134.848 43.486L158.701 43.486ZM151.34 37.8691L142.209 37.8691L142.209 34.6118L151.34 34.6118L151.34 37.8691ZM37.1381 41.6521L21.5314 41.6521L21.5314 35.8686L37.1381 35.8686L37.1381 41.6521Z"
                                fill="currentColor"
                                fill-rule="evenodd" />
                        </svg>
                    </div>

                    <a href="https://qm.qq.com/q/nLEPToNgpq" target="_blank">
                        <button
                            type="button"
                            class="btn hidden md:inline-flex px-4 py-2 border-0 rounded-[calc(0.75rem-0.2rem)] h-full font-medium transition-colors duration-300 cursor-pointer card-nav-cta-button"
                            :style="{
                                backgroundColor: props.buttonBgColor,
                                color: props.buttonTextColor,
                            }">
                            {{ props.buttonText }}
                        </button>
                    </a>
                </div>

                <div
                    :class="[
                        'card-nav-content absolute left-0 right-0 top-[60px] bottom-0 p-2 flex flex-col items-stretch gap-2 justify-start z-[1] md:flex-row md:items-end md:gap-[12px]',
                        isExpanded ? 'visible pointer-events-auto' : 'invisible pointer-events-none',
                    ]"
                    :aria-hidden="!isExpanded">
                    <div
                        v-for="(item, idx) in (props.items || []).slice(0, 3)"
                        :key="`${item.label}-${idx}`"
                        :ref="setCardRef(idx)"
                        class="relative flex flex-col flex-[1_1_auto] md:flex-[1_1_0%] gap-2 p-[12px_16px] rounded-[calc(0.75rem-0.2rem)] min-w-0 h-auto md:h-full min-h-[60px] md:min-h-0 select-none nav-card"
                        :style="{ backgroundColor: item.bgColor, color: item.textColor }">
                        <div class="font-normal text-[18px] md:text-[22px] tracking-[-0.5px] nav-card-label">
                            {{ item.label }}
                        </div>
                        <div class="flex flex-col gap-[2px] mt-auto nav-card-links">
                            <NuxtLink
                                v-for="(lnk, i) in item.links"
                                :key="`${lnk.label}-${i}`"
                                class="inline-flex items-center gap-[6px] hover:opacity-75 text-[15px] md:text-[16px] no-underline transition-opacity duration-300 cursor-pointer nav-card-link"
                                :href="lnk.href"
                                :aria-label="lnk.ariaLabel"
                                @click="menuBtnRef?.click()"
                                :target="lnk.target || ''">
                                {{ lnk.label }}
                            </NuxtLink>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    </section>
</template>
