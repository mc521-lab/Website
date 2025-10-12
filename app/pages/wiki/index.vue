<script setup lang="ts">
    import type { IWrappedAnimatedContent } from "~/types";

    const ani1 = ref<IWrappedAnimatedContent>();
    const ani2 = ref<IWrappedAnimatedContent>();

    onMounted(() => {
        ani1.value!.animating();
    });
</script>

<template>
    <div class="hero min-h-screen">
        <div class="hero-overlay"></div>
        <div class="hero-content text-neutral-content text-center flex-col">
            <WrappedAnimatedContent ref="ani1" class="mt-26 lg:mt-0" manual @complete="ani2?.animating()">
                <VuebitsAnimationsSplitText
                    text="Wikipedia | 君庭阁：1.21.8"
                    className="font-semibold text-center text-[3vw] hidden! lg:inline-block!"
                    :delay="100"
                    :duration="0.3"
                    ease="power3.out"
                    split-type="chars"
                    :from="{ opacity: 0, y: 40 }"
                    :to="{ opacity: 1, y: 0 }"
                    :threshold="0.1"
                    root-margin="-100px"
                    text-align="center" />
                <VuebitsAnimationsSplitText
                    text="Wikipedia"
                    className="font-semibold text-center text-3xl lg:hidden!"
                    :delay="100"
                    :duration="0.3"
                    ease="power3.out"
                    split-type="chars"
                    :from="{ opacity: 0, y: 40 }"
                    :to="{ opacity: 1, y: 0 }"
                    :threshold="0.1"
                    root-margin="-100px"
                    text-align="center" />
                <VuebitsAnimationsSplitText
                    text="君庭阁：1.21.8"
                    className="font-semibold text-center text-3xl lg:hidden!"
                    :delay="100"
                    :duration="0.3"
                    ease="power3.out"
                    split-type="chars"
                    :from="{ opacity: 0, y: 40 }"
                    :to="{ opacity: 1, y: 0 }"
                    :threshold="0.1"
                    root-margin="-100px"
                    text-align="center" />
            </WrappedAnimatedContent>
            <br />
            <WrappedAnimatedContent ref="ani2" class="-mt-4 lg:mt-0" manual :delay="1.1">
                <div class="flex flex-col gap-4 lg:grid lg:grid-cols-3 lg:grid-rows-2" id="wiki-index-grid">
                    <div class="tooltip tooltip-error lg:tooltip-neutral" data-tip="还在制作中！">
                        <WikiIndexItem
                            class="hover:shadow-error/75! focus:shadow-error/75! cursor-not-allowed!"
                            icon="fluent-emoji-flat:crossed-swords"
                            title="职业系统"
                            description="五大职业自由选择，各自拥有独特技能与成长路线，让每一次战斗都焕发全新可能。" />
                    </div>
                    <div class="tooltip tooltip-error lg:tooltip-neutral" data-tip="还在制作中！">
                        <WikiIndexItem
                            class="hover:shadow-error/75! cursor-not-allowed!"
                            icon="fluent-emoji-flat:gem-stone"
                            title="饰品系统"
                            description="从各式各样的饰品中搭配出最契合的组合，为角色塑造独一无二的风格与力量！" />
                    </div>
                    <div class="tooltip tooltip-error lg:tooltip-neutral" data-tip="还在制作中！">
                        <WikiIndexItem
                            class="hover:shadow-error/75! cursor-not-allowed!"
                            icon="fluent-emoji-flat:books"
                            title="附魔系统"
                            description="从数十种附魔中挑选五种，为你的装备量身定制力量！" />
                    </div>
                    <WikiIndexItem
                        class="shadow-[0_0_4px_2px]! shadow-[#FCD53F]/25 hover:shadow-[#FCD53F]/75! focus:shadow-[#FCD53F]/75!"
                        icon="fluent-emoji-flat:star"
                        title="纯新手必看教程"
                        description="这份新手教程将带你踏入冒险的第一步，了解赚钱、生存与保护家园的全部奥秘！"
                        @click="navigateToWiki('xin-shou-jiao-cheng/quan-di')" />
                    <WikiIndexItem
                        icon="fluent-emoji-flat:bookmark-tabs"
                        title="君庭阁服务器规章"
                        description="为保障所有冒险者的公平与体验，请务必遵守服务器规则！"
                        @click="navigateToWiki('gui-zhang-zhi-du/fu-wu-qi-gui-zhang')" />
                    <div class="tooltip tooltip-error lg:tooltip-neutral" data-tip="还在制作中！">
                        <WikiIndexItem
                            class="hover:shadow-error/75! cursor-not-allowed!"
                            icon="fluent-emoji-flat:atom-symbol"
                            title="更多 ..."
                            description="探索更多未知的精彩！" />
                    </div>
                </div>
            </WrappedAnimatedContent>
        </div>
    </div>
</template>
