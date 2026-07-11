<script setup lang="ts">
    import { ref } from "vue";
    import { useData } from "vitepress";
    import Icon from "./Icon.vue";

    const { page } = useData();
    const menuOpen = ref(false);

    const navItems = [
        { text: "首页", link: "/", icon: "home" },
        { text: "官网Wiki", link: "/wiki/", icon: "wiki" },
        { text: "更换皮肤", link: "#", icon: "skin" },
        { text: "伤害计算", link: "#", icon: "sword" },
        { text: "更新日志", link: "#", icon: "log" },
    ];

    const qqGroupLink = "#";

    const isActive = (link: string) => {
        if (link === "#") return false;
        const path = page.value.relativePath ?? "";
        if (link === "/") return path === "index.md";
        return path.startsWith(link.replace(/^\//, ""));
    };
</script>

<template>
    <header class="topbar">
        <a href="/" class="brand">
            <img src="/images/logo.png" alt="君庭阁" class="brand-logo" />
            <div class="brand-text">
                <span class="brand-title">君庭阁</span>
                <span class="brand-sub">纯净生存服务器</span>
            </div>
        </a>

        <nav class="nav-desktop">
            <a
                v-for="item in navItems"
                :key="item.text"
                :href="item.link"
                :class="['nav-link', { active: isActive(item.link) }]">
                <Icon :name="item.icon" :size="18" />
                <span>{{ item.text }}</span>
            </a>
        </nav>

        <a :href="qqGroupLink" class="cta">
            <Icon name="users" :size="18" />
            <span>加入QQ群</span>
        </a>

        <button class="menu-toggle" aria-label="打开菜单" @click="menuOpen = !menuOpen">
            <Icon name="menu" :size="22" />
        </button>

        <div v-show="menuOpen" class="nav-mobile">
            <a
                v-for="item in navItems"
                :key="item.text"
                :href="item.link"
                :class="['nav-link mobile', { active: isActive(item.link) }]"
                @click="menuOpen = false">
                <Icon :name="item.icon" :size="20" />
                <span>{{ item.text }}</span>
            </a>
            <a :href="qqGroupLink" class="cta mobile" @click="menuOpen = false">
                <Icon name="users" :size="18" />
                <span>加入QQ群</span>
            </a>
        </div>
    </header>
</template>

<style scoped>
    .topbar {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1000;
        height: 64px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 var(--space-6);
        background: rgba(0, 0, 0, 0.28);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }

    .brand {
        display: flex;
        align-items: center;
        gap: var(--space-3);
        text-decoration: none;
        color: inherit;
    }

    .brand-logo {
        height: 44px;
        width: auto;
        display: block;
    }

    .brand-text {
        display: flex;
        flex-direction: column;
        line-height: 1.25;
    }

    .brand-title {
        font-family: var(--font-heading);
        font-size: var(--font-size-h4);
        font-weight: 700;
        color: var(--color-foreground);
    }

    .brand-sub {
        font-size: var(--font-size-caption);
        color: rgba(255, 255, 255, 0.8);
    }

    .nav-desktop {
        display: flex;
        align-items: center;
        gap: var(--space-5);
    }

    .nav-link {
        display: inline-flex;
        align-items: center;
        gap: var(--space-1);
        color: rgba(255, 255, 255, 0.85);
        text-decoration: none;
        font-size: var(--font-size-body);
        padding: var(--space-1) 0;
        border-bottom: 2px solid transparent;
        transition:
            color 0.15s,
            border-color 0.15s;
    }

    .nav-link:hover {
        color: #ffffff;
    }

    .nav-link.active {
        color: var(--accent);
        border-bottom-color: var(--accent);
    }

    .cta {
        display: inline-flex;
        align-items: center;
        gap: var(--space-1);
        background: var(--accent);
        color: var(--color-on-primary);
        border-radius: var(--radius-full);
        padding: 0 var(--space-4);
        height: 36px;
        text-decoration: none;
        font-size: var(--font-size-body);
        font-weight: 500;
        transition: background 0.15s;
    }

    .cta:hover {
        background: var(--accent-hover);
        color: var(--color-on-primary);
    }

    .menu-toggle {
        display: none;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-radius: var(--radius-md);
        border: none;
        background: rgba(255, 255, 255, 0.06);
        color: var(--color-foreground);
        cursor: pointer;
    }

    .menu-toggle:hover {
        background: rgba(255, 255, 255, 0.1);
    }

    .nav-mobile {
        display: none;
        position: absolute;
        top: 64px;
        left: 0;
        right: 0;
        flex-direction: column;
        gap: var(--space-1);
        padding: var(--space-3) var(--space-5);
        background: rgba(0, 0, 0, 0.85);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }

    .nav-mobile .nav-link.mobile {
        padding: var(--space-2) 0;
        border-bottom: none;
    }

    .nav-mobile .cta.mobile {
        justify-content: center;
        margin-top: var(--space-2);
    }

    @media (max-width: 900px) {
        .nav-desktop,
        .cta {
            display: none;
        }

        .menu-toggle {
            display: flex;
        }

        .nav-mobile {
            display: flex;
        }
    }
</style>
