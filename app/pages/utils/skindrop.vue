<script setup lang="ts">
    import { SkinViewer, WalkingAnimation } from "skinview3d";
    import type { IWrappedAnimatedContent } from "~/types";

    const ani1 = ref<IWrappedAnimatedContent>();
    const ani2 = ref<IWrappedAnimatedContent>();

    onMounted(() => {
        ani1.value?.animating();
    });

    // Global
    const skinFile = ref<Blob | null>(null);

    // Step Control
    const step = ref<number>(1);
    const nextStep = () => step.value++;
    const previousStep = () => step.value--;
    const steps = ["选择", "确认", "上传", "完成"];

    // Skin Preview
    const skinview = ref<HTMLCanvasElement | null>(null);
    const skinviewInstance = ref<SkinViewer | null>(null);

    // Step Change Control
    const s3_filename = ref<string>("");
    const s4_success = ref<boolean>(true);
    const s4_fail_msg = ref<string>("");
    watch(step, async (newValue) => {
        if (newValue === 1) {
            s1_input_a.value = null;
            s1_input_b.value = "";
            s2_input.value = "";
            skinviewInstance.value?.dispose();
            skinviewInstance.value = null;
        }
        if (newValue === 2) {
            const _type = s1_input_a.value ? "file" : "url";
            switch (_type) {
                case "file":
                    if (s1_input_a.value) {
                        skinFile.value = new Blob([s1_input_a.value], { type: s1_input_a.value.type });
                    }
                    break;
                case "url":
                    skinFile.value = await $fetch<Blob>("/api/proxy/namemc/" + s1_input_b.value.split("/").pop());
                    break;
            }
            nextTick(() => {
                if (!skinviewInstance.value) {
                    skinviewInstance.value = new SkinViewer({
                        canvas: skinview.value!,
                        width: 368,
                        height: 368,
                        skin: URL.createObjectURL(skinFile.value as File),
                    });
                }
                skinviewInstance.value.animation = new WalkingAnimation();
            });
        }
        if (newValue === 3) {
            console.log(skinFile.value);
            if (!skinFile.value) {
                return;
            }
            const formData = new FormData();
            formData.append("file", skinFile.value);
            if (skinFile.value instanceof File) {
                s3_filename.value = encodeURIComponent(`${s2_input.value}.${skinFile.value.name.split(".").pop()}`);
            } else {
                s3_filename.value = encodeURIComponent(`${s2_input.value}.png`);
            }
            try {
                // 3. 调用我们自己的后端接口
                await $fetch(`/api/alist/upload/${s3_filename.value}`, {
                    method: "POST",
                    body: formData,
                });
                s4_fail_msg.value = "";
            } catch (error: any) {
                s4_success.value = false;
                s4_fail_msg.value = error.data?.statusMessage || error.message;
            } finally {
                step.value = 4;
            }
        }
        if (newValue === 5) {
            step.value = 1;
        }
    });

    // Inputs
    const s1_input_a = ref<File | null>(null);
    const s1_input_b = ref<string>("");
    function onFileChange(e: Event) {
        const target = e.target as HTMLInputElement;
        s1_input_a.value = target.files ? target.files[0]! : null;
    }
    const s2_input = ref<string>("");

    // Locks
    const s1_lock_a = ref<boolean>(false);
    const s1_lock_b = ref<boolean>(false);
    watch(s1_input_a, (newValue) => {
        s1_lock_b.value = newValue !== null;
    });
    watch(s1_input_b, (newValue) => {
        s1_lock_a.value = newValue !== "";
    });

    // Validators
    const s1_valid = ref<boolean>(false);
    const _validateUrl = (url: string) => {
        return url.startsWith("https://namemc.com/skin/") || url.startsWith("https://zh.namemc.com/skin/");
    };
    watch([s1_input_a, s1_input_b], ([newValue_a, newValue_b]) => {
        s1_valid.value = (newValue_a !== null || (newValue_b !== "" && _validateUrl(newValue_b))) && !(newValue_a !== null && newValue_b !== "");
    });
    const s2_valid = ref<boolean>(false);
    const _validateName = (name: string) => {
        return name.length >= 3 && name.length <= 16 && /^[a-zA-Z][a-zA-Z0-9_]+$/.test(name);
    };
    watch(s2_input, (newValue) => {
        s2_valid.value = newValue !== "" && _validateName(newValue);
    });

    const copyCmd = () => {
        copy(`/skin url ${useRuntimeConfig().public.alistUrl}/d/SkinDrop/${s3_filename.value}`);
    };
</script>

<template>
    <div class="hero min-h-screen">
        <div class="hero-overlay"></div>
        <div class="hero-content w-full max-w-7xl flex-col">
            <div class="w-5xl">
                <WrappedAnimatedContent ref="ani1" manual @complete="ani2?.animating()">
                    <VuebitsAnimationsSplitText
                        text="落颜 · SkinDrop | 轻量级换皮肤工具"
                        className="font-semibold text-center text-neutral-content text-2xl lg:text-[1.5vw]"
                        :delay="15"
                        :duration="0.5"
                        ease="power3.out"
                        split-type="chars"
                        :from="{ opacity: 0, y: 40 }"
                        :to="{ opacity: 1, y: 0 }"
                        :threshold="0.1"
                        root-margin="-100px"
                        text-align="center" />
                </WrappedAnimatedContent>
                <br />
                <WrappedAnimatedContent ref="ani2" class="w-full" manual :delay="0.25">
                    <div class="w-full grid grid-cols-5 grid-rows-1 gap-x-4 text-base-content">
                        <div class="card card-border bg-base-100 aspect-square w-full col-span-2">
                            <div class="card-body flex justify-center items-center">
                                <div class="skeleton w-36 h-64" v-if="step === 1"></div>
                                <canvas ref="skinview" class="bg-base-100 size-64" v-else />
                            </div>
                        </div>
                        <div class="card card-border bg-base-100 w-full col-span-3">
                            <div class="card-body">
                                <ul class="steps h-1/4">
                                    <li class="step" :class="{ 'step-primary': step >= index + 1 }" v-for="(content, index) in steps" :key="content">
                                        {{ content }}
                                    </li>
                                </ul>

                                <section class="w-full h-full flex justify-center items-center bg-transparent">
                                    <div v-if="step === 1" class="w-9/10">
                                        <h2>上传皮肤文件</h2>
                                        <input @change="onFileChange" :multiple="false" class="mt-2 file-input w-full" type="file" :disabled="s1_lock_a" />
                                        <h2 class="mt-2">或者…… 提供一个 NameMC 链接</h2>
                                        <input
                                            v-model="s1_input_b"
                                            class="mt-2 input w-full"
                                            placeholder="https://namemc.com/skin/... 或 https://zh.namemc.com/skin/..."
                                            :disabled="s1_lock_b" />
                                    </div>
                                    <div v-if="step === 2" class="w-9/10">
                                        <h2>这是你要的皮肤吗？</h2>
                                        <h2>如果是，请输入你的 ID</h2>
                                        <input v-model="s2_input" class="mt-2 input w-full" placeholder="例如: LingyunAwA" />
                                    </div>
                                    <div v-if="step === 3" class="w-9/10 flex items-center justify-center">
                                        <span class="loading loading-bars loading-xl scale-200"></span>
                                    </div>
                                    <div v-if="step === 4" class="w-9/10">
                                        <div role="alert" class="alert alert-error" v-if="!s4_success">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                                                <path
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    stroke-width="2"
                                                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>{{ s4_fail_msg }}</span>
                                        </div>
                                        <section v-if="s4_success" class="w-full flex flex-col">
                                            <div role="alert" class="alert alert-success">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                                                    <path
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span>上传成功</span>
                                            </div>
                                            <button class="btn btn-primary mt-2 ml-auto" v-if="s4_success" @click="copyCmd">复制命令</button>
                                        </section>
                                    </div>
                                </section>

                                <section class="px-7 w-full flex justify-between items-center">
                                    <button class="btn btn-neutral" :disabled="step !== 2" @click="previousStep">返回</button>
                                    <button
                                        class="btn btn-primary ml-auto"
                                        :disabled="!((step === 1 && s1_valid) || (step === 2 && s2_valid) || step === 4)"
                                        @click="nextStep">
                                        {{ step === 4 ? "重置" : "确认" }}
                                    </button>
                                </section>
                            </div>
                        </div>
                    </div>
                </WrappedAnimatedContent>
            </div>
        </div>
    </div>
    <div class="card w-full h-3/5 bg-base-100 flex flex-col justify-center items-center gap-2 lg:hidden">
        <h1 class="text-3xl font-bold">提示</h1>
        <p class="text-xl">请使用电脑端访问工具箱</p>
    </div>
</template>

<style scoped>
    input {
        outline: none;
    }
</style>
