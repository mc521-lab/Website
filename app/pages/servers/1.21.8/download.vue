<script setup lang="ts">
    import type { IWrappedAnimatedContent } from "~/types";

    const ani1 = ref<IWrappedAnimatedContent>();
    const ani2 = ref<IWrappedAnimatedContent>();

    onMounted(() => {
        ani1.value?.animating();
    });

    const selected = ref("config");
</script>

<template>
    <div class="hero min-h-screen">
        <div class="hero-overlay"></div>
        <div class="hero-content text-neutral-content w-full h-full max-w-7xl flex-col items-start!">
            <WrappedAnimatedContent ref="ani1" class="w-full" manual @complete="ani2?.animating()">
                <section class="flex w-full justify-end items-center gap-2">
                    <h1 class="text-3xl lg:text-[2.5vw] font-bold">电脑版客户端下载</h1>
                    <button class="btn btn-soft btn-warning ml-auto">如何使用 ?</button>
                    <button class="btn btn-soft btn-info">下载启动器</button>
                </section>
            </WrappedAnimatedContent>
            <WrappedAnimatedContent ref="ani2" manual class="w-full">
                <ul class="list bg-base-100 rounded-box shadow-md">
                    <li class="p-4 pb-2 text-xs opacity-60 tracking-wide">选择你想要添加在客户端内的组件</li>

                    <li class="list-row">
                        <div></div>
                        <div>
                            <div>基础模组包</div>
                            <div class="text-xs uppercase font-semibold opacity-60">包含游玩服务器所必须的模组</div>
                        </div>
                        <ComponentSelector v-model="selected" force-config />
                    </li>
                </ul>
                <div class="w-full mt-4 flex justify-end">
                    <button class="btn btn-soft btn-success">开始下载</button>
                </div>
            </WrappedAnimatedContent>
        </div>
    </div>
</template>
