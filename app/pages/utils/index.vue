<script setup lang="ts">
    import SplitText from "~/components/vuebits/animations/SplitText.vue";
    import type { IWrappedAnimatedContent } from "~/types";

    const ani1 = ref<IWrappedAnimatedContent>();
    const ani2 = ref<IWrappedAnimatedContent>();

    onMounted(() => {
        ani1.value?.animating();
    });

    interface ITools {
        title: string;
        desc: string | VNode;
        routerLink?: string;
        link?: string;
    }

    const tools: ITools[] = [
        {
            title: "落颜 · SkinDrop",
            desc: "轻量级 SkinRestorer 插件配套换皮肤工具",
            routerLink: "/utils/skindrop",
        },
    ];

    const openOuterLink = (link: string) => {
        window.open(link, "_blank");
    };
</script>

<template>
    <div class="hero min-h-screen">
        <div class="hero-overlay"></div>
        <div class="hero-content text-neutral-content text-center">
            <div>
                <WrappedAnimatedContent ref="ani1" manual @complete="ani2?.animating()">
                    <SplitText
                        text="实用工具"
                        className="font-semibold text-center text-3xl lg:text-[3vw]"
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
                <br />
                <WrappedAnimatedContent ref="ani2" manual :delay="0.25">
                    <div
                        class="card bg-base-100 card-md cursor-pointer"
                        v-for="tool in tools"
                        :key="tool.title"
                        @click="tool.routerLink ? $router.push(tool.routerLink) : tool.link ? openOuterLink(tool.link) : null">
                        <div class="card-body">
                            <h2 class="card-title">{{ tool.title }}</h2>
                            <p>{{ tool.desc }}</p>
                        </div>
                    </div>
                </WrappedAnimatedContent>
            </div>
        </div>
    </div>
</template>
