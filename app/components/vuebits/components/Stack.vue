<template>
    <div class="relative" :style="{ width: cardDimensions.width + 'px', height: cardDimensions.height + 'px', perspective: 600 }">
        <template v-for="(card, index) in cards" :key="card.id">
            <Motion
                as="div"
                class="absolute cursor-grab"
                :style="{
                    x: cardStates.get(card.id)?.x,
                    y: cardStates.get(card.id)?.y,
                    rotateX: cardStates.get(card.id)?.rotateX,
                    rotateY: cardStates.get(card.id)?.rotateY,
                }"
                drag
                :drag-constraints="{ top: 0, right: 0, bottom: 0, left: 0 }"
                :dragElastic="0.6"
                :whileTap="{ cursor: 'grabbing', scale: 1.02 }"
                :onDragEnd="(e: any, info: any) => handleDragEnd(e, info, card.id)">
                <Motion
                    as="div"
                    class="rounded-2xl overflow-hidden border-4 border-white"
                    @click="sendToBackOnClick && sendToBack(card.id)"
                    :animate="{
                        rotateZ: (cards.length - index - 1) * 4 + (randomRotation ? Math.random() * 10 - 5 : 0),
                        scale: 1 + index * 0.06 - cards.length * 0.06,
                        transformOrigin: '90% 90%',
                    }"
                    :initial="false"
                    :transition="{
                        type: 'spring',
                        stiffness: animationConfig.stiffness,
                        damping: animationConfig.damping,
                    }"
                    :style="{
                        width: cardDimensions.width + 'px',
                        height: cardDimensions.height + 'px',
                    }">
                    <img :src="card.img" :alt="`card-${card.id}`" className="w-full h-full object-cover pointer-events-none" />
                    <button
                        class="absolute bottom-4 right-4 btn btn-square opacity-75 hover:opacity-100 dark:opacity-50 dark:hover:opacity-75 transition-opacity duration-75 ease-in-out"
                        @click="emitClick(card.id)">
                        <!-- Icon from Myna UI Icons by Praveen Juge - https://github.com/praveenjuge/mynaui-icons/blob/main/LICENSE -->
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                            <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5">
                                <path
                                    d="M2.55 13.406c-.272-.373-.408-.56-.502-.92a2.5 2.5 0 0 1 0-.971c.094-.361.23-.548.502-.92C4.039 8.55 7.303 5 12 5s7.961 3.55 9.45 5.594c.272.373.408.56.502.92a2.5 2.5 0 0 1 0 .971c-.094.361-.23.548-.502.92C19.961 15.45 16.697 19 12 19s-7.961-3.55-9.45-5.594" />
                                <path d="M12 14a2 2 0 1 0 0-4a2 2 0 0 0 0 4" />
                            </g>
                        </svg>
                    </button>
                </Motion>
            </Motion>
        </template>
    </div>
</template>

<script setup lang="ts">
    import type { PanInfo } from "motion-v";
    import { Motion, useMotionValue, useTransform } from "motion-v";
    import { onBeforeMount, ref } from "vue";

    interface StackProps {
        className?: string;
        randomRotation?: boolean;
        sensitivity?: number;
        cardDimensions?: { width: number; height: number };
        cardsData: { id: number; img: string }[];
        animationConfig?: { stiffness: number; damping: number };
        sendToBackOnClick?: boolean;
    }

    const props = withDefaults(defineProps<StackProps>(), {
        randomRotation: false,
        sensitivity: 200,
        cardDimensions: () => ({ width: 208, height: 208 }),
        cardsData: () => [],
        animationConfig: () => ({ stiffness: 260, damping: 20 }),
        sendToBackOnClick: false,
    });

    const cards = ref(
        props.cardsData.length
            ? props.cardsData
            : [
                  { id: 1, img: "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?q=80&w=500&auto=format" },
                  { id: 2, img: "https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=500&auto=format" },
                  { id: 3, img: "https://images.unsplash.com/photo-1452626212852-811d58933cae?q=80&w=500&auto=format" },
                  { id: 4, img: "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?q=80&w=500&auto=format" },
              ]
    );

    type CardState = {
        x: ReturnType<typeof useMotionValue<number>>;
        y: ReturnType<typeof useMotionValue<number>>;
        rotateX: ReturnType<typeof useMotionValue<number>>;
        rotateY: ReturnType<typeof useMotionValue<number>>;
        reset: () => void;
    };

    const cardStates = new Map<number, CardState>();

    function createCardState(): CardState {
        const x = useMotionValue(0);
        const y = useMotionValue(0);

        const rotateX = useTransform(y, [-100, 100], [60, -60]);
        const rotateY = useTransform(x, [-100, 100], [-60, 60]);

        return {
            x,
            y,
            rotateX,
            rotateY,
            reset() {
                x.set(0);
                y.set(0);
            },
        };
    }

    onBeforeMount(() => {
        cards.value.forEach((card) => {
            if (!cardStates.has(card.id)) {
                cardStates.set(card.id, createCardState());
            }
        });
    });

    function getCardState(cardId: number): CardState {
        let state = cardStates.get(cardId);
        if (!state) {
            state = createCardState();
            cardStates.set(cardId, state);
        }
        return state;
    }

    function handleDragEnd(_: PointerEvent, info: PanInfo, cardId: number) {
        if (Math.abs(info.offset.x) > props.sensitivity || Math.abs(info.offset.y) > props.sensitivity) {
            sendToBack(cardId);
        } else {
            getCardState(cardId).reset();
        }
    }

    const sendToBack = (id: number) => {
        const newCards = [...cards.value];
        const index = newCards.findIndex((card) => card.id === id);
        const [card] = newCards.splice(index, 1);
        newCards.unshift(card!);
        cards.value = newCards;
    };

    const emits = defineEmits(["click"]);
    const emitClick = (id: number) => {
        emits("click", id);
    };
</script>
