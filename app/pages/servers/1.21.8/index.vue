<script setup lang="ts">
    import Stack from "~/components/vuebits/components/Stack.vue";
    import type { IWrappedAnimatedContent } from "~/types";

    // Animating Refs
    const ani1 = ref<IWrappedAnimatedContent>();
    const ani2 = ref<IWrappedAnimatedContent>();
    const ani3 = ref<IWrappedAnimatedContent>();
    const ani4 = ref<IWrappedAnimatedContent>();
    const ani5 = ref<IWrappedAnimatedContent>();

    // Dialogs
    const modal = ref<HTMLDialogElement>();
    interface ImageEl {
        id: number;
        img: string;
        title: string;
        desp: string;
    }
    const currentImage = ref<ImageEl>({
        id: 0,
        img: "",
        title: "",
        desp: "",
    } as ImageEl);

    // Click Events
    const cardClick = (id: number) => {
        const _i = images.find((item) => item.id === id);
        currentImage.value = _i as ImageEl;
        modal.value?.showModal();
    };

    const images = [
        {
            id: 1,
            img: "/assets/images/server-showcase/2025-09-05_14.36.06.png",
            title: "主城",
            desp: "服务器主城经过精心设计，拥有红棕色屋顶的建筑沿整洁的街道排列，中央有喷泉和装饰性植物。夕阳下的天空云层飘逸，一只猫头鹰增添奇幻感。绿意盎然的街道细节丰富，展现出生机勃勃的社区氛围。",
        },
        {
            id: 2,
            img: "/assets/images/server-showcase/2025-09-05_14.48.37.png",
            title: "幻想乡",
            desp: "幻想乡是由玩家建立的社区，其建筑群中心有一座气势恢宏的穹顶建筑，周围环绕着绿意盎然的庭院和装饰性结构。天空湛蓝，云层飘逸，社区布局对称，细节精致，展现了玩家们的创造力和合作精神。",
        },
        {
            id: 3,
            img: "/assets/images/server-showcase/2025-09-21_16.40.08.png",
            title: "落樱城",
            desp: "落樱城是由玩家精心打造的社区，其中心矗立着一座宏伟壮观的哥特式建筑，尖塔高耸，气势非凡。周围环绕着色彩斑斓的农田，黄色、粉色与绿色交织，展现出丰收的景象。溪流蜿蜒，旁边的传统木桥与樱花点缀相得益彰，天空湛蓝，云朵轻盈，整体布局和谐，细节精美，充分体现了玩家们的创意与协作之美。",
        },
    ].reverse();

    // Resizable Image Gallery
    const sizeW = ref<number>(0);
    const sizeH = ref<number>(0);
    enum resizeCoefficient {
        Desktop = 0.4,
        Tablet = 0.3,
        Mobile = 0.15,
    }
    const portableSize = () => {
        const width = 1920;
        const height = 1080;
        const vpWidth = window.innerWidth;
        // 获取设备类型
        let coefficient = resizeCoefficient.Desktop;
        if (vpWidth < 768) {
            coefficient = resizeCoefficient.Mobile;
        } else if (vpWidth < 1024) {
            coefficient = resizeCoefficient.Tablet;
        }
        // 计算新的宽度和高度
        const resizeWidth = width * coefficient;
        const resizeHeight = height * coefficient;
        return { width: resizeWidth, height: resizeHeight };
    };
    const updateSize = () => {
        const { width, height } = portableSize();
        sizeW.value = width;
        sizeH.value = height;
    };

    // Hooks
    onMounted(() => {
        updateSize();
        window.addEventListener("resize", updateSize);
        ani1.value?.animating();
    });
    onUnmounted(() => {
        window.removeEventListener("resize", updateSize);
    });
</script>

<template>
    <section class="hero min-h-screen">
        <div class="hero-overlay"></div>
        <section class="hero-content text-neutral-content w-full flex-col">
            <WrappedAnimatedContent ref="ani1" class="mt-26 lg:mt-0" manual @complete="ani2?.animating()">
                <h1 class="hidden lg:block text-[2.5vw] font-bold">[高版本] 1.21.8 趣味生存</h1>
                <h1 class="block lg:hidden text-3xl font-bold">[高版本] 1.21.8</h1>
                <h1 class="block lg:hidden text-3xl font-bold text-center">趣味生存</h1>
            </WrappedAnimatedContent>
            <WrappedAnimatedContent class="mt-4" ref="ani2" manual @complete="ani3?.animating()">
                <section class="flex">
                    <div class="stats stats-vertical lg:stats-horizontal shadow-[0_0_4px_0] shadow-neutral-content">
                        <div class="stat">
                            <div class="stat-title text-sm">服务器 IP</div>
                            <div class="stat-value text-xl text-error cursor-pointer" @click="copy('mc521.cc')">mc521.cc</div>
                            <div class="stat-desc text-sm">点击复制即可加入</div>
                        </div>
                        <div class="stat">
                            <div class="stat-title text-sm">官方群聊</div>
                            <div class="stat-value text-xl text-info cursor-pointer" @click="open('https://qm.qq.com/q/nLEPToNgpq')">5587557</div>
                            <div class="stat-desc text-sm">点击加入 QQ 群</div>
                        </div>
                        <div class="stat">
                            <div class="stat-title text-sm">核心玩法</div>
                            <div class="stat-value text-xl text-success">附魔 / 职业 / 副本 / 地牢</div>
                            <div class="stat-desc text-sm">超多有趣新内容等你探索</div>
                        </div>
                        <div class="stat">
                            <div class="stat-title text-sm">日均在线</div>
                            <div class="stat-value text-xl text-warning">46 人</div>
                            <div class="stat-desc text-sm">欢迎广大玩家的加入</div>
                        </div>
                        <div class="stat">
                            <div class="stat-title text-sm">系统支持</div>
                            <div class="stat-value text-xl flex items-center gap-2">
                                <svg aria-label="Microsoft logo" width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="mb-0.5">
                                    <path d="M96 96H247V247H96" fill="#f24f23"></path>
                                    <path d="M265 96V247H416V96" fill="#7eba03"></path>
                                    <path d="M96 265H247V416H96" fill="#3ca4ef"></path>
                                    <path d="M265 265H416V416H265" fill="#f9ba00"></path>
                                </svg>
                                Windows /
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32">
                                    <rect width="4" height="10" x="2" y="12" fill="#8bc34a" rx="2" />
                                    <rect width="4" height="10" x="26" y="12" fill="#8bc34a" rx="2" />
                                    <path
                                        fill="#8bc34a"
                                        d="M8 12h16v12H8zm2 12h4v4a2 2 0 0 1-2 2a2 2 0 0 1-2-2zm8 0h4v4a2 2 0 0 1-2 2a2 2 0 0 1-2-2zm3.545-19.759l2.12-2.12A1 1 0 0 0 22.251.707l-2.326 2.326a7.97 7.97 0 0 0-7.85 0L9.75.707a1 1 0 1 0-1.414 1.414l2.12 2.12A7.97 7.97 0 0 0 8 10h16a7.97 7.97 0 0 0-2.455-5.759M14 8h-2V6h2Zm6 0h-2V6h2Z" />
                                </svg>
                                安卓
                            </div>
                            <div class="stat-desc text-sm">使用手机/平板也可游玩！</div>
                        </div>
                    </div>
                </section>
            </WrappedAnimatedContent>
            <WrappedAnimatedContent class="mt-2" ref="ani3" manual @complete="ani4?.animating()">
                <!-- <NuxtLink href="/servers/1.21.8/download"> -->
                <div class="tooltip tooltip-bottom lg:tooltip-left cursor-not-allowed" data-tip="请加入官方群聊下载客户端">
                    <button disabled class="btn">
                        <svg aria-label="Microsoft logo" width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path d="M96 96H247V247H96" fill="#f24f23"></path>
                            <path d="M265 96V247H416V96" fill="#7eba03"></path>
                            <path d="M96 265H247V416H96" fill="#3ca4ef"></path>
                            <path d="M265 265H416V416H265" fill="#f9ba00"></path>
                        </svg>
                        电脑版下载
                    </button>
                </div>
                <!-- </NuxtLink> -->
                <div class="tooltip tooltip-bottom lg:tooltip-right cursor-not-allowed" data-tip="请加入官方群聊下载客户端">
                    <button disabled class="ml-2 btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32">
                            <rect width="4" height="10" x="2" y="12" fill="#8bc34a" rx="2" />
                            <rect width="4" height="10" x="26" y="12" fill="#8bc34a" rx="2" />
                            <path
                                fill="#8bc34a"
                                d="M8 12h16v12H8zm2 12h4v4a2 2 0 0 1-2 2a2 2 0 0 1-2-2zm8 0h4v4a2 2 0 0 1-2 2a2 2 0 0 1-2-2zm3.545-19.759l2.12-2.12A1 1 0 0 0 22.251.707l-2.326 2.326a7.97 7.97 0 0 0-7.85 0L9.75.707a1 1 0 1 0-1.414 1.414l2.12 2.12A7.97 7.97 0 0 0 8 10h16a7.97 7.97 0 0 0-2.455-5.759M14 8h-2V6h2Zm6 0h-2V6h2Z" />
                        </svg>
                        移动版下载
                    </button>
                </div>
            </WrappedAnimatedContent>
            <WrappedAnimatedContent class="mt-4" ref="ani4" manual :delay="1">
                <span class="opacity-75">▼ 继续向下滑动查看画廊 ▼</span>
            </WrappedAnimatedContent>
        </section>
    </section>
    <section class="hero min-h-screen">
        <div class="hero-overlay"></div>
        <section class="hero-content text-neutral-content w-full flex-col">
            <WrappedAnimatedContent ref="ani5" @complete="">
                <Stack
                    :randomRotation="true"
                    :sensitivity="180"
                    :sendToBackOnClick="false"
                    :cardDimensions="{ width: sizeW, height: sizeH }"
                    :cardsData="images"
                    @click="cardClick" />
            </WrappedAnimatedContent>
            <!-- <WrappedAnimatedContent class="mt-4" ref="ani6" manual :delay="1">
                <span class="opacity-75">▼ 继续向下滑动阅读历史 ▼</span>
            </WrappedAnimatedContent> -->
        </section>
    </section>
    <dialog ref="modal" class="modal">
        <div class="modal-box">
            <h3 class="text-lg font-bold">{{ currentImage!.title }}</h3>
            <p class="py-4">{{ currentImage!.desp }}</p>
            <img :src="currentImage!.img" alt="" />
            <div class="modal-action">
                <form method="dialog">
                    <!-- if there is a button in form, it will close the modal -->
                    <button class="btn">返回</button>
                </form>
            </div>
        </div>
    </dialog>
</template>

<style scoped lang="scss">
    div.stat {
        border-inline-end: none !important;

        div.stat-title,
        div.stat-desc {
            color: #ecf9ff;
        }
    }

    dialog.modal[open] {
        backdrop-filter: blur(4px);
    }
</style>
