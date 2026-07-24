<script setup lang="ts">
    import { ref, computed, watch } from "vue";
    import { useSkindrop, type ResolvedSkin } from "@theme/composables/useSkindrop";
    import SkinView3D from "./SkinView3D.vue";

    type Tab = "upload" | "namemc";
    type Step = "select" | "preview" | "result";

    const step = ref<Step>("select");
    const activeTab = ref<Tab>("upload");
    const { loading, error, lastError, resolve, upload } = useSkindrop();

    const skinSource = ref<(ResolvedSkin & { filename: string }) | null>(null);
    const playerName = ref("");
    const uploadedUrl = ref<string | null>(null);
    let fileObjectUrl: string | null = null;

    const isDragOver = ref(false);

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
        step.value = "select";
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
        setUploadFile(file);
    }

    function setUploadFile(file: File | null) {
        selectedFile.value = file;
        revokeFileObjectUrl();

        if (file) {
            fileObjectUrl = URL.createObjectURL(file);
            skinSource.value = {
                id: file.name.replace(/\.png$/i, ""),
                url: fileObjectUrl,
                blob: file,
                filename: file.name,
            };
        } else {
            skinSource.value = null;
        }
    }

    function onDragOver(event: DragEvent) {
        event.preventDefault();
        isDragOver.value = true;
    }

    function onDragLeave(event: DragEvent) {
        event.preventDefault();
        isDragOver.value = false;
    }

    function onDrop(event: DragEvent) {
        event.preventDefault();
        isDragOver.value = false;
        const file = event.dataTransfer?.files?.[0] ?? null;
        if (file && file.type === "image/png") {
            setUploadFile(file);
            activeTab.value = "upload";
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

    const debugCopied = ref(false);
    let debugCopiedTimeout: ReturnType<typeof setTimeout> | null = null;

    function getDebugInfo(): string {
        const raw = lastError.value;
        const errorStack = raw instanceof Error ? raw.stack || "(no stack)" : "(no stack available)";
        return [
            "Diagnostic Report (Skindrop Module)",
            "------------------",
            `Time: ${new Date().toISOString()}`,
            `Current Step: ${step.value}`,
            `Current Tab: ${activeTab.value}`,
            `Player Name: ${playerName.value || "(Empty)"}`,
            `Source: ${skinSource.value?.filename || "(Unknown)"}`,
            `Upload URL: ${uploadedUrl.value || "(Empty)"}`,
            `User Agent: ${navigator.userAgent}`,
            "------------------",
            `Error:\n${errorStack}`,
        ].join("\n");
    }

    async function copyDebugInfo() {
        try {
            await navigator.clipboard.writeText(getDebugInfo());
            debugCopied.value = true;
            if (debugCopiedTimeout) clearTimeout(debugCopiedTimeout);
            debugCopiedTimeout = setTimeout(() => {
                debugCopied.value = false;
            }, 2000);
        } catch {
            // ignore
        }
    }

    const currentSourceLabel = computed(() => {
        if (!skinSource.value) return "尚未选择";
        return skinSource.value.filename;
    });

    function onBackToSelect() {
        step.value = "select";
        playerName.value = "";
    }
</script>

<template>
    <div class="skindrop-hero">
        <div class="hero-overlay" />

        <div class="skindrop-station">
            <header class="station-header">
                <h1 class="station-title">皮肤驿站</h1>
                <p class="station-desc">上传皮肤、确认角色、复制指令，三步完成换装。</p>
            </header>

            <nav class="stepper">
                <div class="step" :class="{ active: step === 'select', completed: step === 'preview' || step === 'result' }">
                    <span class="step-number">1</span>
                    <span class="step-label">选择皮肤</span>
                </div>
                <div class="step-divider" />
                <div class="step" :class="{ active: step === 'preview', completed: step === 'result' }">
                    <span class="step-number">2</span>
                    <span class="step-label">预览确认</span>
                </div>
                <div class="step-divider" />
                <div class="step" :class="{ active: step === 'result' }">
                    <span class="step-number">3</span>
                    <span class="step-label">复制指令</span>
                </div>
            </nav>

            <main class="station-body">
                <!-- Left: preview -->
                <section class="panel preview-panel">
                    <div class="panel-header">
                        <span class="panel-en">SKIN PREVIEW</span>
                        <h2 class="panel-title">皮肤预览</h2>
                    </div>

                    <div class="preview-stage" :class="{ empty: !skinSource }">
                        <SkinView3D :skin="skinSource?.url ?? null" />
                        <div v-if="!skinSource" class="preview-placeholder">
                            <span>加载一张皮肤先</span>
                        </div>
                    </div>

                    <div class="source-info">
                        <span class="source-label">当前来源</span>
                        <span class="source-value">{{ currentSourceLabel }}</span>
                    </div>
                </section>

                <!-- Right: controls -->
                <section class="panel control-panel">
                    <!-- Step select -->
                    <template v-if="step === 'select'">
                        <div class="panel-header compact">
                            <h2 class="panel-title">从哪里获取皮肤？</h2>
                        </div>

                        <div class="tabs">
                            <button class="tab" :class="{ active: activeTab === 'upload' }" @click="activeTab = 'upload'">
                                本地上传
                            </button>
                            <button class="tab" :class="{ active: activeTab === 'namemc' }" @click="activeTab = 'namemc'">
                                NameMC / 图片地址
                            </button>
                        </div>

                        <div v-if="activeTab === 'upload'" class="tab-panel">
                            <div
                                class="drop-zone"
                                :class="{ dragover: isDragOver, hasfile: selectedFile }"
                                @dragover="onDragOver"
                                @dragleave="onDragLeave"
                                @drop="onDrop">
                                <input type="file" accept="image/png" class="drop-input" @change="onFileChange" />
                                <div class="drop-content">
                                    <span class="drop-icon">+</span>
                                    <p class="drop-title">{{ uploadFilename || "把 PNG 拖到这里" }}</p>
                                    <p class="drop-hint">或点击选择文件，仅支持 .png 格式</p>
                                </div>
                            </div>

                            <button
                                class="btn btn-primary next-btn"
                                :disabled="!canProceedFromUpload"
                                @click="proceedFromUpload">
                                下一步：预览并确认 →
                            </button>
                        </div>

                        <div v-else class="tab-panel">
                            <p class="panel-desc">粘贴 NameMC 皮肤页面链接或皮肤图片直链。</p>

                            <input
                                v-model="nameMcInput"
                                class="input"
                                type="text"
                                placeholder="https://zh.namemc.com/skin/4f0932f4d85b1609" />

                            <button
                                class="btn btn-primary next-btn"
                                :disabled="!canProceedFromNameMc"
                                @click="proceedFromNameMc">
                                下一步：预览并确认 →
                            </button>
                        </div>
                    </template>

                    <!-- Step preview -->
                    <template v-if="step === 'preview'">
                        <div class="panel-header compact">
                            <h2 class="panel-title">确认使用这张图？</h2>
                        </div>

                        <p class="panel-desc">输入你的玩家名，我们将把皮肤上传到你的账户。</p>

                        <input v-model="playerName" class="input" type="text" placeholder="例如：Steve" maxlength="32" />

                        <button class="btn btn-primary next-btn" :disabled="!canConfirm" @click="confirmUpload">
                            确认上传
                        </button>

                        <button class="btn btn-text" @click="onBackToSelect">返回重新选择</button>
                    </template>

                    <!-- Step result -->
                    <template v-if="step === 'result'">
                        <div class="panel-header compact">
                            <h2 class="panel-title">上传成功</h2>
                        </div>

                        <div class="result-box">
                            <p class="panel-desc small">
                                1. 点击下方按钮复制换皮肤命令， <br />2. 在游戏中按 <kbd>T</kbd> 打开对话栏，<br />3. 按下
                                <kbd>Ctrl</kbd> + <kbd>V</kbd> 粘贴复制好的命令，<br />4. 按 <kbd>Enter</kbd> 以更换皮肤。
                            </p>
                            <code class="command-code">{{ skinCommand }}</code>
                        </div>

                        <button class="btn btn-primary next-btn" @click="copyCommand">
                            {{ copied ? "已复制" : "复制命令" }}
                        </button>

                        <button class="btn btn-text" @click="resetAll">再换一张</button>
                    </template>

                    <div class="privacy-tip">
                        <span class="tip-tag">隐私提示</span>
                        <p class="tip-text">皮肤图片会上传至服务器并生成公开可访问链接，请勿上传包含个人隐私信息的图片。</p>
                    </div>

                    <div v-if="error" class="error-box">
                        <span class="error-message">{{ error }}</span>
                        <button class="error-debug-btn" @click="copyDebugInfo">
                            {{ debugCopied ? "已复制" : "复制调试信息" }}
                        </button>
                    </div>
                </section>
            </main>
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
        background: radial-gradient(ellipse at center, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, 0.6) 100%);
        pointer-events: none;
    }

    .skindrop-station {
        position: relative;
        z-index: 1;
        width: 100%;
        max-width: 980px;
        background: rgba(14, 11, 9, 0.96);
        backdrop-filter: blur(18px);
        -webkit-backdrop-filter: blur(18px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: var(--radius-xl);
        padding: var(--space-6);
        box-shadow: var(--shadow-4);
        display: flex;
        flex-direction: column;
        gap: var(--space-5);
    }

    /* Header */
    .station-header {
        text-align: center;
    }

    .brand-line {
        display: inline-flex;
        align-items: center;
        gap: var(--space-3);
        margin-bottom: var(--space-3);
    }

    .brand-name {
        font-family: var(--font-mono, monospace);
        font-size: var(--font-size-caption);
        font-weight: 600;
        letter-spacing: 0.08em;
        color: rgba(255, 250, 242, 0.7);
    }

    .status-badge {
        display: inline-flex;
        align-items: center;
        gap: var(--space-1);
        padding: 0.2em 0.7em;
        background: rgba(34, 181, 84, 0.12);
        border: 1px solid rgba(34, 181, 84, 0.25);
        border-radius: var(--radius-full, 999px);
        font-size: var(--font-size-caption);
        color: var(--jtg-success-400);
        font-weight: 500;
    }

    .status-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--jtg-success-400);
        box-shadow: 0 0 6px var(--jtg-success-400);
    }

    .station-title {
        font-family: var(--font-heading);
        font-size: var(--font-size-h2);
        font-weight: var(--font-weight-h2);
        color: #fff;
        margin: 0 0 var(--space-2) 0;
        text-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
    }

    .station-desc {
        font-size: var(--font-size-body);
        color: rgba(255, 250, 242, 0.85);
        margin: 0;
    }

    /* Stepper */
    .stepper {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--space-3);
        padding: var(--space-4);
        background: rgba(0, 0, 0, 0.35);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: var(--radius-lg);
    }

    .step {
        display: flex;
        align-items: center;
        gap: var(--space-2);
        color: rgba(255, 250, 242, 0.55);
        font-weight: 500;
        transition: color 0.2s;
    }

    .step-number {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.1);
        font-size: var(--font-size-caption);
        font-weight: 600;
        transition:
            background 0.2s,
            color 0.2s;
    }

    .step.active {
        color: #fff;
    }

    .step.active .step-number {
        background: var(--color-primary);
        color: #fff;
    }

    .step.completed {
        color: rgba(255, 250, 242, 0.85);
    }

    .step.completed .step-number {
        background: rgba(34, 181, 84, 0.25);
        color: var(--jtg-success-400);
    }

    .step-divider {
        width: 48px;
        height: 1px;
        background: rgba(255, 255, 255, 0.12);
    }

    /* Body */
    .station-body {
        display: grid;
        grid-template-columns: 1fr 1.35fr;
        gap: var(--space-5);
    }

    .panel {
        display: flex;
        flex-direction: column;
        gap: var(--space-4);
        background: rgba(0, 0, 0, 0.25);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: var(--radius-lg);
        padding: var(--space-5);
    }

    .panel-header {
        display: flex;
        flex-direction: column;
        gap: var(--space-1);
        padding-bottom: var(--space-3);
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }

    .panel-header.compact {
        padding-bottom: var(--space-2);
    }

    .panel-en {
        font-family: var(--font-mono, monospace);
        font-size: var(--font-size-caption);
        letter-spacing: 0.06em;
        color: rgba(255, 250, 242, 0.5);
    }

    .panel-title {
        font-family: var(--font-heading);
        font-size: var(--font-size-h4);
        font-weight: var(--font-weight-h4);
        color: #fff;
        margin: 0;
    }

    /* Preview panel */
    .preview-stage {
        position: relative;
        aspect-ratio: 1 / 1;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.35);
        border: 1px dashed rgba(255, 255, 255, 0.12);
        border-radius: var(--radius-md);
        overflow: hidden;
    }

    .preview-stage.empty {
        border-style: dashed;
    }

    .preview-placeholder {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        color: rgba(255, 250, 242, 0.5);
        font-size: var(--font-size-body);
        pointer-events: none;
    }

    .source-info {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-3);
        padding: var(--space-3);
        background: rgba(0, 0, 0, 0.25);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: var(--radius-md);
    }

    .source-label {
        font-size: var(--font-size-caption);
        color: rgba(255, 250, 242, 0.6);
        font-weight: 500;
    }

    .source-value {
        font-size: var(--font-size-body);
        color: #fff;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 60%;
    }

    .privacy-tip {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
        padding: var(--space-3);
        background: rgba(255, 193, 7, 0.06);
        border: 1px solid rgba(255, 193, 7, 0.15);
        border-radius: var(--radius-md);
    }

    .tip-tag {
        align-self: flex-start;
        padding: 0.15em 0.5em;
        background: rgba(255, 193, 7, 0.12);
        border-radius: var(--radius-sm);
        font-size: var(--font-size-caption);
        color: #ffc107;
        font-weight: 500;
    }

    .tip-text {
        margin: 0;
        font-size: var(--font-size-caption);
        color: rgba(255, 250, 242, 0.7);
        line-height: 1.5;
    }

    /* Control panel */
    .tabs {
        display: flex;
        gap: var(--space-1);
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
        color: rgba(255, 250, 242, 0.8);
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
        color: rgba(255, 250, 242, 0.85);
        margin: 0;
    }

    .panel-desc.small {
        font-size: calc(var(--font-size-body) / 1.1);
    }

    /* Drop zone */
    .drop-zone {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 180px;
        padding: var(--space-5);
        background: rgba(0, 0, 0, 0.25);
        border: 2px dashed rgba(255, 255, 255, 0.15);
        border-radius: var(--radius-md);
        transition:
            border-color 0.2s,
            background 0.2s;
        cursor: pointer;
    }

    .drop-zone:hover,
    .drop-zone.dragover {
        border-color: var(--color-primary);
        background: rgba(212, 137, 58, 0.06);
    }

    .drop-zone.hasfile {
        border-style: solid;
        border-color: rgba(34, 181, 84, 0.35);
        background: rgba(34, 181, 84, 0.06);
    }

    .drop-input {
        position: absolute;
        inset: 0;
        opacity: 0;
        cursor: pointer;
    }

    .drop-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--space-2);
        pointer-events: none;
        text-align: center;
    }

    .drop-icon {
        font-size: 32px;
        color: rgba(255, 250, 242, 0.4);
        line-height: 1;
    }

    .drop-title {
        margin: 0;
        font-size: var(--font-size-body);
        color: #fff;
        font-weight: 500;
        word-break: break-all;
    }

    .drop-hint {
        margin: 0;
        font-size: var(--font-size-caption);
        color: rgba(255, 250, 242, 0.55);
    }

    /* Inputs and buttons */
    .input {
        width: 100%;
        box-sizing: border-box;
        background: rgba(0, 0, 0, 0.45);
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: var(--radius-md);
        padding: 0.85em 1em;
        color: #fff;
        font-family: var(--font-family-base);
        font-size: var(--font-size-body);
        outline: none;
        transition: border-color 0.15s;
    }

    .input::placeholder {
        color: rgba(255, 250, 242, 0.5);
    }

    .input:hover {
        border-color: rgba(255, 255, 255, 0.3);
    }

    .input:focus {
        border-color: var(--color-primary);
    }

    .next-btn {
        width: 100%;
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

    .btn-primary:disabled {
        opacity: 1;
        background: rgba(212, 137, 58, 0.35);
        color: rgba(255, 255, 255, 0.7);
    }

    .btn-primary:disabled:hover {
        background: rgba(212, 137, 58, 0.35);
        filter: none;
    }

    /* Result */
    .result-box {
        padding: var(--space-4);
        background: rgba(34, 181, 84, 0.08);
        border: 1px solid rgba(34, 181, 84, 0.25);
        border-radius: var(--radius-md);
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
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

    kbd {
        display: inline-block;
        padding: 0.15em 0.5em;
        background: rgba(0, 0, 0, 0.45);
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: var(--radius-sm);
        box-shadow: 0 2px 0 rgba(0, 0, 0, 0.35);
        color: #fff;
        font-family: var(--font-mono, monospace);
        font-size: 0.85em;
        line-height: 1.4;
    }

    .error-box {
        margin-top: var(--space-2);
        padding: var(--space-3);
        background: rgba(239, 68, 68, 0.12);
        border: 1px solid rgba(239, 68, 68, 0.3);
        border-radius: var(--radius-md);
        color: var(--jtg-error-400);
        font-size: var(--font-size-body);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-3);
    }

    .error-message {
        line-height: 1.5;
    }

    .error-debug-btn {
        flex-shrink: 0;
        border: 1px solid rgba(239, 68, 68, 0.45);
        background: rgba(239, 68, 68, 0.15);
        color: var(--jtg-error-400);
        font-family: var(--font-family-base);
        font-size: var(--font-size-caption);
        font-weight: 500;
        cursor: pointer;
        padding: 0.45em 0.9em;
        border-radius: var(--radius-md);
        transition:
            background 0.15s,
            border-color 0.15s;
        white-space: nowrap;
    }

    .error-debug-btn:hover {
        background: rgba(239, 68, 68, 0.25);
        border-color: rgba(239, 68, 68, 0.6);
    }

    @media (max-width: 860px) {
        .station-body {
            grid-template-columns: 1fr;
        }

        .stepper {
            flex-wrap: wrap;
            gap: var(--space-2);
        }

        .step-divider {
            display: none;
        }
    }
</style>

