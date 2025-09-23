<script setup lang="ts">
    import type { IWrappedAnimatedContent } from "~/components/WrappedAnimatedContent.vue";

    const ani1 = ref<IWrappedAnimatedContent>();
    const ani2 = ref<IWrappedAnimatedContent>();
    const ani3 = ref<IWrappedAnimatedContent>();
    const ani4 = ref<IWrappedAnimatedContent>();
    const ani5 = ref<IWrappedAnimatedContent>();
</script>

<template>
    <div class="hero min-h-screen">
        <div class="hero-overlay"></div>
        <div class="hero-content text-neutral-content w-full max-w-7xl flex-col items-start">
            <WrappedAnimatedContent ref="ani1" @complete="ani2?.animating()">
                <h1 class="text-5xl font-bold">服务器官方社交媒体</h1>
                <p class="text-lg mt-2">关注我们的社交媒体账号，获取最新动态和游戏资讯。</p>
            </WrappedAnimatedContent>
            <br />
            <WrappedAnimatedContent ref="ani2" manual @complete="ani3?.animating()">
                <div class="flex items-center gap-4">
                    <img src="/images/socials/huya.png" class="w-10 h-8.5" />
                    <span class="text-xl text-warning">
                        官方虎牙直播间：
                        <br />
                        <WrappedSocialMediaLink href="https://www.huya.com/ccjun6" text="观看直播" />
                    </span>
                </div>
                <div class="flex items-center gap-4 mt-2">
                    <img src="/images/socials/bili.png" class="aspect-square w-10 scale-95" />
                    <span class="text-xl text-info">
                        官方哔哩哔哩账户：
                        <br />
                        <WrappedSocialMediaLink href="https://space.bilibili.com/354529617" text="查找视频" />
                    </span>
                </div>
                <div class="flex items-center gap-4 mt-2">
                    <img src="/images/socials/tt.png" class="w-10 h-9.7 scale-95" />
                    <span class="text-xl">
                        官方 TT 语音房间：
                        <br />
                        <WrappedSocialMediaLink href="https://s.52tt.com/b/7KVRq" text="加入房间" />
                    </span>
                </div>
            </WrappedAnimatedContent>
            <WrappedAnimatedContent class="mt-4" ref="ani3" manual :delay="1">
                <span class="opacity-75">▼ 继续向下滑动查看玩家直播间 ▼</span>
            </WrappedAnimatedContent>
        </div>
    </div>
    <div class="hero min-h-screen">
        <div class="hero-overlay"></div>
        <div class="hero-content text-neutral-content w-full max-w-7xl flex-col items-start min-h-screen">
            <WrappedAnimatedContent ref="ani4" @complete="ani5?.animating()">
                <h1 class="text-5xl font-bold">服务器玩家社交媒体</h1>
                <p class="text-lg mt-2">在这下面的是经官方认证的玩家社交媒体账号/直播间</p>
                <p class="text-lg mt-2">也去他们的直播间捧捧场吧！</p>
            </WrappedAnimatedContent>
            <br />
            <WrappedAnimatedContent ref="ani5" manual>
                <div class="flex items-center gap-4 mt-2">
                    <img src="/images/socials/tiktok.png" class="w-10 h-9.7 scale-95" />
                    <span class="text-xl">
                        <span class="text-[#FE0660]">抖</span><span class="text-[#02E8E3]">音</span>主播 黎塘安 的直播间
                        <br />
                        <WrappedSocialMediaLink href="https://v.douyin.com/zXb5Cx4j_ck/" text="观看直播" />
                    </span>
                </div>
            </WrappedAnimatedContent>
        </div>
    </div>
</template>
