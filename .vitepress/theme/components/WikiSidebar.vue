<script setup lang="ts">
    import { useData } from "vitepress";
    import Icon from "./Icon.vue";

    const { page } = useData();

    type NavItem = { text: string; link: string; icon: string };
    type NavGroup = { label: string; items: NavItem[] };

    const groups: NavGroup[] = [
        {
            label: "服务器规则",
            items: [
                { text: "基本规则", link: "/wiki/rules/basic.html", icon: "lucide:book" },
                { text: "附录：裁定标准", link: "/wiki/rules/adjudication.html", icon: "lucide:circle-check" },
                { text: "附录：惩罚制度", link: "/wiki/rules/punishment.html", icon: "lucide:gavel" },
                { text: "附录：处理政策", link: "/wiki/rules/policy.html", icon: "lucide:message-square" },
            ],
        },
        {
            label: "新手指引",
            items: [
                { text: "常用指令", link: "/wiki/beginner/common-commands.html", icon: "lucide:command" },
                { text: "如何圈地", link: "/wiki/beginner/how-to-claim-land.html", icon: "lucide:landmark" },
                { text: "如何赚取金币", link: "/wiki/beginner/how-to-earn-money.html", icon: "lucide:coins" },
                { text: "如何创建箱子商店", link: "/wiki/beginner/how-to-create-quickshop.html", icon: "lucide:package-open" },
                { text: "如何更换皮肤", link: "/wiki/beginner/how-to-change-skin.html", icon: "lucide:sparkles" },
                { text: "如何绑定 Bilibili", link: "/wiki/beginner/how-to-bind-bilibili.html", icon: "lucide:video" },
            ],
        },
        {
            label: "物品图鉴",
            items: [
                { text: "职业武器", link: "/wiki/item/weapons.html", icon: "lucide:sword" },
                { text: "职业套装", link: "/wiki/item/equipment.html", icon: "lucide:briefcase" },
                { text: "饰品图鉴", link: "/wiki/item/jewelries.html", icon: "lucide:gem" },
                { text: "宝石图鉴", link: "/wiki/item/gems.html", icon: "lucide:diamond" },
                { text: "材料图鉴", link: "/wiki/item/materials.html", icon: "lucide:package" },
                { text: "附魔图鉴", link: "/wiki/item/enchantments.html", icon: "lucide:book-open" },
            ],
        },
        {
            label: "公会系统",
            items: [
                { text: "公会神石", link: "/wiki/playerguard/stone.html", icon: "lucide:gem" },
                { text: "公会维护资金", link: "/wiki/playerguard/maintainance-funds.html", icon: "lucide:wallet" },
                { text: "公会升级", link: "/wiki/playerguard/update.html", icon: "lucide:arrow-up" },
                { text: "常见问题", link: "/wiki/playerguard/common-questions.html", icon: "lucide:circle-help" },
            ],
        },
    ];

    const normalizePath = (p: string) =>
        p
            .replace(/^\//, "")
            .replace(/\.(md|html)$/, "")
            .replace(/\/index$/, "")
            .replace(/\/$/, "");

    const isActive = (link: string) => normalizePath(page.value.relativePath ?? "") === normalizePath(link);
</script>

<template>
    <aside class="wiki-sidebar">
        <span class="sidebar-logo">君庭阁 Wiki</span>

        <div v-for="group in groups" :key="group.label" class="sidebar-group">
            <div class="sidebar-group-label">{{ group.label }}</div>
            <a
                v-for="item in group.items"
                :key="item.link"
                :href="item.link"
                :class="['sidebar-link', { active: isActive(item.link) }]">
                <Icon :name="item.icon" :size="16" />
                <span class="sidebar-link-text">{{ item.text }}</span>
            </a>
        </div>
    </aside>
</template>

<style scoped>
    .wiki-sidebar {
        width: 280px;
        height: 100%;
        flex-shrink: 0;
        background: rgba(255, 250, 242, 0.9);
        border-right: 1px solid var(--accent);
        padding: var(--space-4) 0;
        overflow-x: hidden;
        overflow-y: auto;
    }

    .sidebar-logo {
        display: block;
        font-family: var(--font-heading);
        font-size: var(--font-size-h4);
        font-weight: 600;
        color: #1a1612;
        text-decoration: none;
        padding: 0 var(--space-4) var(--space-4);
        white-space: nowrap;
    }

    .sidebar-group {
        margin-bottom: var(--space-2);
    }

    .sidebar-group-label {
        font-size: var(--font-size-caption);
        color: #7c6b55;
        padding: var(--space-2) var(--space-4);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        white-space: nowrap;
    }

    .sidebar-link {
        display: flex;
        align-items: center;
        gap: var(--space-2);
        padding: var(--space-2) var(--space-4);
        margin: 0 var(--space-2);
        border-radius: var(--radius-md);
        border-left: 2px solid transparent;
        color: #1a1612;
        text-decoration: none;
        font-size: var(--font-size-body);
        transition:
            background 0.15s,
            color 0.15s,
            border-color 0.15s;
    }

    .sidebar-link:hover {
        background: rgba(0, 0, 0, 0.06);
        color: #1a1612;
    }

    .sidebar-link.active {
        color: #1a1612;
        background: rgba(0, 0, 0, 0.1);
        border-left-color: var(--accent);
    }

    .sidebar-link-text {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    @media (max-width: 900px) {
        .wiki-sidebar {
            width: 100%;
        }
    }
</style>
