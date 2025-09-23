<script setup lang="ts">
    import type { IWrappedAnimatedContent } from "~/components/WrappedAnimatedContent.vue";
    import ProfileCard from "~/components/vuebits/components/ProfileCard.vue";

    const ani1 = ref<IWrappedAnimatedContent>();
    const ani2 = ref<IWrappedAnimatedContent>();

    onMounted(() => {
        ani1.value?.animating();
    });
</script>

<template>
    <div class="hero min-h-screen">
        <div class="hero-overlay"></div>
        <div class="hero-content text-neutral-content w-full max-w-7xl flex-col">
            <WrappedAnimatedContent ref="ani1" manual @complete="ani2?.animating()">
                <h1 class="text-4xl lg:text-[3.1vw] mt-24 lg:mt-8">我们的团队</h1>
            </WrappedAnimatedContent>
            <WrappedAnimatedContent ref="ani2" manual>
                <section class="flex flex-col md:flex-row justify-start items-start gap-4 lg:gap-16 lg:-mb-16">
                    <ProfileCard
                        name="CC"
                        title="服主"
                        avatar-url="/images/staffs/CC.png"
                        icon-url="/images/staffs/DevIconPattern.png"
                        grain-url="/images/staffs/Grain.webp"
                        :show-user-info="false"
                        :show-behind-gradient="true"
                        :enable-tilt="true" />
                    <ProfileCard
                        name="凌云"
                        title="技术客服"
                        avatar-url="/images/staffs/LingyunAwA.png"
                        icon-url="/images/staffs/DevIconPattern.png"
                        grain-url="/images/staffs/Grain.webp"
                        :show-user-info="false"
                        :show-behind-gradient="true"
                        :enable-tilt="true" />
                    <ProfileCard
                        name="零壹"
                        title="小游戏主管"
                        avatar-url="/images/staffs/FBK_Lynn.png"
                        icon-url="/images/staffs/DevIconPattern.png"
                        grain-url="/images/staffs/Grain.webp"
                        :show-user-info="false"
                        :show-behind-gradient="true"
                        :enable-tilt="true" />
                </section>
            </WrappedAnimatedContent>
        </div>
    </div>
</template>
