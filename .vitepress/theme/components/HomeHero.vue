<script setup lang="ts">
    import Icon, { IconName } from "./Icon.vue";

    const features = [
        { title: "纯净生存", sub: "公平 · 友好 · 长久", icon: "leaf" },
        { title: "友好社区", sub: "互助 · 温暖 · 和谐", icon: "shield" },
        { title: "长期稳定", sub: "稳定运行 · 用心维护", icon: "landmark" },
    ];

    const ctas = [
        {
            title: "游戏活动",
            sub: "丰富活动和奖励等你获取",
            icon: "gift",
            link: "#",
            iconBg: "#f2a94d",
        },
        {
            title: "反馈问题",
            sub: "建言献策 · 遇见问题找我们",
            icon: "message",
            link: "#",
            iconBg: "#e87d2a",
        },
    ];

    const status = [
        { type: "dot", text: "在线玩家 42人", color: "#22c55e" },
        { type: "icon", text: "版本 1.21.4", icon: "leaf" },
        { type: "icon", text: "IP mc521.cc", icon: "globe" },
    ];
</script>

<template>
    <section class="hero" :style="{ backgroundImage: 'url(/images/background.png)' }">
        <div class="hero-overlay" />

        <div class="hero-content">
            <h1 class="hero-title">
                <Icon name="leaf" :size="40" class="title-leaf left" />
                <span class="hero-title-text">君庭阁</span>
                <Icon name="leaf" :size="40" class="title-leaf right" />
            </h1>

            <p class="hero-tagline">
                <span class="tagline-line" />
                <span class="tagline-diamond" />
                二十余年，同在一片方块天
                <span class="tagline-diamond" />
                <span class="tagline-line" />
            </p>

            <div class="feature-cards">
                <div v-for="item in features" :key="item.title" class="feature-card">
                    <Icon :name="item.icon as IconName" :size="28" class="feature-icon" />
                    <div class="feature-text">
                        <div class="feature-title">{{ item.title }}</div>
                        <div class="feature-sub">{{ item.sub }}</div>
                    </div>
                </div>
            </div>

            <div class="cta-cards">
                <a v-for="item in ctas" :key="item.title" :href="item.link" class="cta-card">
                    <div class="cta-icon-bg" :style="{ background: item.iconBg }">
                        <Icon :name="item.icon as IconName" :size="20" class="cta-icon" />
                    </div>
                    <div class="cta-text">
                        <div class="cta-title">{{ item.title }}</div>
                        <div class="cta-sub">{{ item.sub }}</div>
                    </div>
                </a>
            </div>
        </div>

        <div class="status-bar">
            <div v-for="(item, idx) in status" :key="idx" class="status-item">
                <span v-if="item.type === 'dot'" class="status-dot" :style="{ background: item.color }" />
                <Icon v-else-if="item.type === 'icon'" :name="item.icon as IconName" :size="16" class="status-icon" />
                <span>{{ item.text }}</span>
            </div>
        </div>
    </section>
</template>

<style scoped>
    .hero {
        position: relative;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 96px var(--space-5) 96px;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
    }

    .hero-overlay {
        position: absolute;
        inset: 0;
        background: radial-gradient(ellipse at center, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.5) 100%);
        pointer-events: none;
    }

    .hero-content {
        position: relative;
        z-index: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: var(--space-6);
        width: 100%;
        max-width: 1000px;
    }

    .hero-title {
        font-family: var(--font-heading);
        font-size: clamp(3.5rem, 10vw, 6rem);
        font-weight: 700;
        margin: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--space-3);
    }

    .hero-title-text {
        color: #fef3e2;
        text-shadow: 0 4px 24px rgba(0, 0, 0, 0.55);
    }

    .title-leaf {
        color: #d4411e;
        opacity: 0.95;
        filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.45));
    }

    .title-leaf.left {
        transform: rotate(-20deg);
    }

    .title-leaf.right {
        transform: rotate(20deg) scaleX(-1);
    }

    .hero-tagline {
        font-family: var(--font-body);
        font-size: var(--font-size-h4);
        color: rgba(255, 255, 255, 0.9);
        margin: 0;
        display: flex;
        align-items: center;
        gap: var(--space-2);
        text-shadow: 0 2px 12px rgba(0, 0, 0, 0.6);
    }

    .tagline-line {
        width: 48px;
        height: 1px;
        background: rgba(255, 255, 255, 0.4);
    }

    .tagline-diamond {
        width: 6px;
        height: 6px;
        background: var(--accent);
        transform: rotate(45deg);
        opacity: 0.9;
    }

    .feature-cards {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: var(--space-4);
        margin-top: var(--space-1);
    }

    .feature-card {
        min-width: 220px;
        padding: 18px 22px;
        display: flex;
        align-items: center;
        gap: var(--space-3);
        background: rgba(255, 250, 242, 0.95);
        border-radius: var(--radius-xl);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
        transition:
            transform 0.15s,
            background 0.15s;
    }

    .feature-card:hover {
        background: #fffbf5;
        transform: translateY(-2px);
    }

    .feature-icon {
        color: var(--accent);
        flex-shrink: 0;
    }

    .feature-text {
        text-align: left;
        line-height: 1.4;
    }

    .feature-title {
        font-family: var(--font-heading);
        font-size: var(--font-size-body);
        font-weight: 600;
        color: #1a1612;
    }

    .feature-sub {
        font-size: var(--font-size-caption);
        color: #7c6b55;
    }

    .cta-cards {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: var(--space-4);
        margin-top: var(--space-1);
    }

    .cta-card {
        min-width: 240px;
        padding: 16px 22px;
        display: flex;
        align-items: center;
        gap: var(--space-3);
        background: rgba(0, 0, 0, 0.72);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: var(--radius-xl);
        text-decoration: none;
        color: inherit;
        text-align: left;
        transition:
            transform 0.15s,
            background 0.15s;
    }

    .cta-card:hover {
        background: rgba(0, 0, 0, 0.82);
        transform: translateY(-2px);
    }

    .cta-icon-bg {
        width: 42px;
        height: 42px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        color: #fff;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
    }

    .cta-icon {
        color: #fff;
    }

    .cta-title {
        font-family: var(--font-heading);
        font-size: var(--font-size-body);
        font-weight: 600;
        color: #fff;
    }

    .cta-sub {
        font-size: var(--font-size-caption);
        color: rgba(255, 255, 255, 0.72);
    }

    .status-bar {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 1;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        gap: var(--space-7);
        padding: var(--space-3) var(--space-5);
        background: rgba(0, 0, 0, 0.4);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border-top: 1px solid rgba(255, 255, 255, 0.08);
    }

    .status-item {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        font-size: var(--font-size-body);
        color: var(--color-foreground);
    }

    .status-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
    }

    .status-badge {
        font-size: var(--font-size-caption);
        color: #fff;
        padding: 2px 8px;
        border-radius: var(--radius-sm);
    }

    .status-icon {
        color: var(--jtg-info-500);
    }

    @media (max-width: 640px) {
        .hero {
            padding: 88px var(--space-4) 120px;
        }

        .hero-title {
            gap: var(--space-2);
        }

        .title-leaf {
            display: none;
        }

        .feature-card,
        .cta-card {
            width: 100%;
            max-width: 320px;
        }

        .tagline-line {
            display: none;
        }

        .status-bar {
            gap: var(--space-4);
        }
    }
</style>
