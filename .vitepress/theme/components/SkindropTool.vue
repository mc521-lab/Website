<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useSkindrop, type ResolvedSkin } from "@theme/composables/useSkindrop";
import SkinView3D from "./SkinView3D.vue";

type Tab = "upload" | "namemc";
type Step = "select" | "preview" | "result";

const step = ref<Step>("select");
const activeTab = ref<Tab>("upload");
const { loading, error, resolve, upload } = useSkindrop();

const skinSource = ref<ResolvedSkin & { filename: string } | null>(null);
const playerName = ref("");
const uploadedUrl = ref<string | null>(null);
let fileObjectUrl: string | null = null;

function revokeFileObjectUrl(): void {
    if (fileObjectUrl) {
        URL.revokeObjectURL(fileObjectUrl);
        fileObjectUrl = null;
    }
}

function resetAll(): void {
    step.value = "select";
    activeTab.value = "upload";
    revokeFileObjectUrl();
    skinSource.value = null;
    playerName.value = "";
    uploadedUrl.value = null;
    error.value = null;
    selectedFile.value = null;
    nameMcInput.value = "";
}

watch(activeTab, () => {
    revokeFileObjectUrl();
    skinSource.value = null;
    uploadedUrl.value = null;
    playerName.value = "";
    error.value = null;
    selectedFile.value = null;
    nameMcInput.value = "";
});

// Select step - upload
const selectedFile = ref<File | null>(null);

const uploadFilename = computed(() => {
    return selectedFile.value?.name ?? "";
});

const canProceedFromUpload = computed(() => selectedFile.value !== null && !loading.value);

function onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    selectedFile.value = file;
    revokeFileObjectUrl();

    if (file) {
        fileObjectUrl = URL.createObjectURL(file);
    }
}

async function proceedFromUpload() {
    const file = selectedFile.value;
    if (!file || !fileObjectUrl) return;

    skinSource.value = {
        id: file.name.replace(/\.png$/i, ""),
        url: fileObjectUrl,
        blob: file,
        filename: file.name,
    };
    step.value = "preview";
}

// Select step - NameMC
const nameMcInput = ref("");

const canProceedFromNameMc = computed(() => nameMcInput.value.trim().length > 0 && !loading.value);

async function proceedFromNameMc() {
    const input = nameMcInput.value;
    if (!input.trim()) return;

    const result = await resolve(input);
    if (!result) return;

    skinSource.value = {
        ...result,
        filename: `${result.id}.png`,
    };
    step.value = "preview";
}

// Preview step
const canConfirm = computed(() => playerName.value.trim().length > 0 && skinSource.value !== null && !loading.value);

async function confirmUpload() {
    if (!skinSource.value) return;

    const filename = `${playerName.value.trim()}.png`;
    const file = new File([skinSource.value.blob], filename, { type: "image/png" });

    const url = await upload(filename, file);
    if (url) {
        uploadedUrl.value = url;
        step.value = "result";
    }
}

const skinCommand = computed(() => {
    if (!uploadedUrl.value) return "";
    return `/skin url ${uploadedUrl.value}`;
});

const copied = ref(false);
let copiedTimeout: ReturnType<typeof setTimeout> | null = null;

async function copyCommand() {
    if (!skinCommand.value) return;
    try {
        await navigator.clipboard.writeText(skinCommand.value);
        copied.value = true;
        if (copiedTimeout) clearTimeout(copiedTimeout);
        copiedTimeout = setTimeout(() => {
            copied.value = false;
        }, 2000);
    } catch {
        // ignore
    }
}
</script>

<template>
    <div class="skindrop-hero">
        <div class="hero-overlay" />

        <div class="skindrop-card" :class="{ wide: step === 'preview' || step === 'result' }">
            <h1 class="card-title">皮肤投递</h1>
            <p class="card-subtitle">上传或引用皮肤图片，开始你的换装之旅</p>

            <!-- Step: select -->
            <template v-if="step === 'select'">
                <div class="tabs">
                    <button
                        class="tab"
                        :class="{ active: activeTab === 'upload' }"
                        @click="activeTab = 'upload'"
                    >
                        上传图片
                    </button>
                    <button
                        class="tab"
                        :class="{ active: activeTab === 'namemc' }"
                        @click="activeTab = 'namemc'"
                    >
                        NameMC 地址
                    </button>
                </div>

                <div class="tab-panel">
                    <template v-if="activeTab === 'upload'">
                        <p class="panel-desc">选择本地 PNG 皮肤文件。</p>

                        <label class="file-input-wrapper">
                            <input type="file" accept="image/png" @change="onFileChange" />
                            <span class="btn btn-secondary upload-btn">
                                {{ uploadFilename || "选择文件" }}
                            </span>
                        </label>

                        <button
                            class="btn btn-primary submit-btn"
                            :disabled="!canProceedFromUpload"
                            @click="proceedFromUpload"
                        >
                            下一步
                        </button>
                    </template>

                    <template v-else>
                        <p class="panel-desc">粘贴 NameMC 皮肤页面链接或皮肤图片链接。</p>

                        <input
                            v-model="nameMcInput"
                            class="input"
                            type="text"
                            placeholder="https://zh.namemc.com/skin/4f0932f4d85b1609"
                        />

                        <button
                            class="btn btn-primary submit-btn"
                            :disabled="!canProceedFromNameMc"
                            @click="proceedFromNameMc"
                        >
                            下一步
                        </button>
                    </template>
                </div>
            </template>

            <!-- Step: preview -->
            <template v-if="step === 'preview'">
                <div class="preview-layout">
                    <div class="preview-card slide-in-left">
                        <h2 class="preview-title">效果预览</h2>
                        <SkinView3D :skin="skinSource?.url ?? null" />
                    </div>

                    <div class="confirm-card slide-in-right">
                        <h2 class="preview-title">确认使用这张图？</h2>
                        <p class="panel-desc">输入你的玩家名，我们将把皮肤上传到你的账户。</p>

                        <input
                            v-model="playerName"
                            class="input"
                            type="text"
                            placeholder="例如：Steve"
                            maxlength="32"
                        />

                        <button
                            class="btn btn-primary submit-btn"
                            :disabled="!canConfirm"
                            @click="confirmUpload"
                        >
                            确认上传
                        </button>

                        <button class="btn btn-text" @click="step = 'select'">返回重新选择</button>
                    </div>
                </div>
            </template>

            <!-- Step: result -->
            <template v-if="step === 'result'">
                <div class="result-step">
                    <div class="result-box">
                        <span class="result-label">上传成功</span>
                        <p class="panel-desc">在游戏中输入以下命令应用皮肤：</p>
                        <code class="command-code">{{ skinCommand }}</code>
                    </div>

                    <button class="btn btn-primary submit-btn" @click="copyCommand">
                        {{ copied ? "已复制" : "复制命令" }}
                    </button>
                    <button class="btn btn-text" @click="resetAll">再换一张</button>
                </div>
            </template>

            <div v-if="error" class="error-box">
                {{ error }}
            </div>
        </div>
    </div>
</template>

<style scoped>
.skindrop-hero {
    position: relative;
    width: 100vw;
    margin-left: calc(-50vw + 50%);
    min-height: calc(100vh - var(--vp-nav-height, 64px));
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-5);
    background: url("/images/background.png") center / cover no-repeat;
    box-sizing: border-box;
}

.hero-overlay {
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at center, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.55) 100%);
    pointer-events: none;
}

.skindrop-card {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 480px;
    background: rgba(14, 11, 9, 0.96);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: var(--radius-xl);
    padding: var(--space-6);
    box-shadow: var(--shadow-4);
    transition: max-width 0.3s ease;
}

.skindrop-card.wide {
    max-width: 840px;
}

.card-title {
    font-family: var(--font-heading);
    font-size: var(--font-size-h2);
    font-weight: var(--font-weight-h2);
    color: #fff;
    text-align: center;
    margin: 0 0 var(--space-2) 0;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
}

.card-subtitle {
    font-size: var(--font-size-body);
    color: rgba(255, 250, 242, 0.92);
    text-align: center;
    margin: 0 0 var(--space-5) 0;
}

.tabs {
    display: flex;
    gap: var(--space-2);
    margin-bottom: var(--space-5);
    padding: var(--space-1);
    background: rgba(0, 0, 0, 0.35);
    border-radius: var(--radius-lg);
}

.tab {
    flex: 1;
    height: var(--size-button-md);
    border: none;
    border-radius: var(--radius-md);
    background: transparent;
    color: rgba(255, 250, 242, 0.85);
    font-family: var(--font-family-base);
    font-size: var(--font-size-body);
    font-weight: 500;
    cursor: pointer;
    transition:
        background 0.15s,
        color 0.15s;
}

.tab:hover {
    color: #fff;
}

.tab.active {
    background: rgba(255, 255, 255, 0.12);
    color: #fff;
}

.tab-panel {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
}

.panel-desc {
    font-size: var(--font-size-body);
    color: rgba(255, 250, 242, 0.88);
    margin: 0;
}

.file-input-wrapper {
    position: relative;
    display: flex;
    cursor: pointer;
}

.file-input-wrapper input[type="file"] {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
}

.upload-btn {
    width: 100%;
    justify-content: flex-start;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    background: rgba(0, 0, 0, 0.35);
    border-color: rgba(255, 255, 255, 0.15);
    color: rgba(255, 250, 242, 0.9);
}

.upload-btn:hover {
    background: rgba(0, 0, 0, 0.5);
    border-color: rgba(255, 255, 255, 0.25);
    color: #fff;
}

.submit-btn {
    width: 100%;
}

.input {
    width: 100%;
    box-sizing: border-box;
    background: rgba(0, 0, 0, 0.45);
    border-color: rgba(255, 255, 255, 0.15);
    color: #fff;
}

.input::placeholder {
    color: rgba(255, 250, 242, 0.6);
}

.input:hover {
    border-color: rgba(255, 255, 255, 0.3);
}

.input:focus {
    border-color: var(--color-primary);
}

.btn-primary:disabled {
    opacity: 1;
    background: rgba(212, 137, 58, 0.35);
    color: rgba(255, 255, 255, 0.7);
}

.btn-primary:disabled:hover {
    background: rgba(212, 137, 58, 0.35);
    filter: none;
}

.btn-secondary:disabled {
    opacity: 1;
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.14);
    color: rgba(255, 250, 242, 0.72);
}

.btn-secondary:disabled:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.14);
    filter: none;
}

.btn-text {
    width: 100%;
    border: none;
    background: transparent;
    color: rgba(255, 250, 242, 0.72);
    font-family: var(--font-family-base);
    font-size: var(--font-size-body);
    font-weight: 500;
    cursor: pointer;
    padding: var(--space-2);
    transition: color 0.15s;
}

.btn-text:hover {
    color: #fff;
}

.preview-layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-5);
}

.preview-card,
.confirm-card {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
    background: rgba(0, 0, 0, 0.25);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: var(--radius-lg);
    padding: var(--space-5);
}

.preview-title {
    font-family: var(--font-heading);
    font-size: var(--font-size-h4);
    font-weight: var(--font-weight-h4);
    color: #fff;
    margin: 0;
    text-align: center;
}

.slide-in-left {
    animation: slideInLeft 0.35s ease-out;
}

.slide-in-right {
    animation: slideInRight 0.35s ease-out;
}

@keyframes slideInLeft {
    from {
        opacity: 0;
        transform: translateX(-24px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes slideInRight {
    from {
        opacity: 0;
        transform: translateX(24px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

.result-step {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
}

.result-box {
    padding: var(--space-4);
    background: rgba(34, 181, 84, 0.12);
    border: 1px solid rgba(34, 181, 84, 0.3);
    border-radius: var(--radius-md);
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
}

.result-label {
    font-size: var(--font-size-caption);
    color: var(--jtg-success-400);
    font-weight: 500;
}

.command-code {
    display: block;
    padding: var(--space-3);
    background: rgba(0, 0, 0, 0.35);
    border-radius: var(--radius-md);
    color: #fff;
    font-family: var(--font-mono, monospace);
    font-size: var(--font-size-body);
    word-break: break-all;
}

.result-link {
    font-size: var(--font-size-body);
    color: var(--color-primary);
    word-break: break-all;
    text-decoration: none;
}

.result-link:hover {
    text-decoration: underline;
}

.error-box {
    margin-top: var(--space-4);
    padding: var(--space-3);
    background: rgba(239, 68, 68, 0.12);
    border: 1px solid rgba(239, 68, 68, 0.3);
    border-radius: var(--radius-md);
    color: var(--jtg-error-400);
    font-size: var(--font-size-body);
}

@media (max-width: 720px) {
    .preview-layout {
        grid-template-columns: 1fr;
    }
}
</style>
