<script setup lang="ts">
    import SplitText from "~/components/vuebits/animations/SplitText.vue";
    import type { IWrappedAnimatedContent } from "~/components/WrappedAnimatedContent.vue";

    const ani1 = ref<IWrappedAnimatedContent>();
    const ani2 = ref<IWrappedAnimatedContent>();
    const ani3 = ref<IWrappedAnimatedContent>();

    onMounted(() => {
        ani1.value!.animating();
    });
</script>

<template>
    <div class="hero min-h-screen">
        <div class="hero-overlay"></div>
        <div class="hero-content text-neutral-content text-center">
            <div>
                <WrappedAnimatedContent ref="ani1" manual @complete="ani2?.animating()">
                    <SplitText
                        text="君庭阁：1.21.8"
                        className="font-semibold text-center text-4xl lg:text-[4vw]"
                        :delay="100"
                        :duration="0.6"
                        ease="power3.out"
                        split-type="chars"
                        :from="{ opacity: 0, y: 40 }"
                        :to="{ opacity: 1, y: 0 }"
                        :threshold="0.1"
                        root-margin="-100px"
                        text-align="center" />
                </WrappedAnimatedContent>
                <WrappedAnimatedContent ref="ani2" manual @complete="ani3?.animating()">
                    <p class="text-2xl">全新改版 从零开始</p>
                </WrappedAnimatedContent>
                <br />
                <WrappedAnimatedContent ref="ani3" manual>
                    <div class="flex justify-center gap-2">
                        <NuxtLink href="/servers/1.21.8">
                            <button class="btn">了解服务器</button>
                        </NuxtLink>
                        <button class="btn">查询 Wiki</button>
                    </div>
                </WrappedAnimatedContent>
            </div>
        </div>
    </div>
</template>
