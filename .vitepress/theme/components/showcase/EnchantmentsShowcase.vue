<script setup lang="ts">
    import { computed, ref } from "vue";
    import { data } from "@data/enchantments.data";
    import type { WikiEnchants } from "../../../types/wiki";
    import EnchantmentCard from "./EnchantmentCard.vue";
    import Icon from "../Icon.vue";

    const { manifest, enchants } = data as WikiEnchants;

    const selectedType = ref<string>("all");
    const selectedRarity = ref<string>("all");
    const searchQuery = ref<string>("");

    const nameMap = computed(() => {
        const map: Record<string, string> = {};
        for (const enchant of enchants) {
            map[enchant.id] = enchant.displayName;
        }
        return map;
    });

    const typeColorMap = computed(() => {
        const map: Record<string, string> = {};
        for (const [id, type] of Object.entries(manifest.types)) {
            map[id] = type.color;
        }
        return map;
    });

    const rarityColorMap = computed(() => {
        const map: Record<string, string> = {};
        for (const [id, rarity] of Object.entries(manifest.rarities)) {
            map[id] = rarity.color;
        }
        return map;
    });

    const rarityOrder = computed(() => {
        const order: Record<string, number> = {};
        for (const [id, rarity] of Object.entries(manifest.rarities)) {
            order[id] = rarity.order;
        }
        return order;
    });

    const armorTargets = new Set(["helmet", "chestplate", "leggings", "boots", "shield"]);
    const weaponTargets = new Set(["sword", "bow", "crossbow", "mace", "trident"]);

    function hasCategory(targets: string[], cat: string): boolean {
        let hasArmor = false;
        let hasWeapon = false;
        let hasTool = false;
        for (const t of targets) {
            if (armorTargets.has(t)) hasArmor = true;
            else if (weaponTargets.has(t)) hasWeapon = true;
            else hasTool = true;
        }
        if (cat === "armor") return hasArmor;
        if (cat === "weapon") return hasWeapon;
        if (cat === "tool") return hasTool;
        return false;
    }

    const filteredEnchants = computed(() => {
        const query = searchQuery.value.trim().toLowerCase();
        return enchants.filter((item) => {
            const typeMatch = selectedType.value === "all" || hasCategory(item.targets, selectedType.value);
            const rarityMatch = selectedRarity.value === "all" || item.rarity === selectedRarity.value;
            const searchMatch =
                !query ||
                item.displayName.toLowerCase().includes(query) ||
                item.id.toLowerCase().includes(query);
            return typeMatch && rarityMatch && searchMatch;
        });
    });

    const byRarity = computed(() => {
        const groups: Record<string, typeof enchants> = {};
        for (const item of filteredEnchants.value) {
            groups[item.rarity] ??= [];
            groups[item.rarity].push(item);
        }
        for (const list of Object.values(groups)) {
            list.sort((a, b) => a.displayName.localeCompare(b.displayName, "zh-CN"));
        }
        return groups;
    });

    const rarityIds = computed(() => {
        return Object.keys(manifest.rarities).sort((a, b) => rarityOrder.value[a] - rarityOrder.value[b]);
    });

    const visibleRarityIds = computed(() => {
        return rarityIds.value.filter((id) => byRarity.value[id]?.length > 0);
    });

    function splitColumns<T>(items: T[], columnCount: number): T[][] {
        const columns: T[][] = Array.from({ length: columnCount }, () => []);
        for (let i = 0; i < items.length; i++) {
            columns[i % columnCount].push(items[i]);
        }
        return columns;
    }
</script>

<template>
    <section class="showcase">
        <div class="filter-bar">
            <div class="filter-group">
                <span class="filter-label">
                    <Icon name="lucide:tags" :size="16" />
                    类型
                </span>
                <div class="filter-pills">
                    <button
                        class="filter-pill"
                        :class="{ active: selectedType === 'all' }"
                        @click="selectedType = 'all'">
                        全部
                    </button>
                    <button
                        class="filter-pill type-pill"
                        :class="{ active: selectedType === 'armor' }"
                        :style="selectedType === 'armor' ? { background: '#3b82f620', color: '#2563eb', borderColor: '#3b82f650' } : {}"
                        @click="selectedType = 'armor'">
                        防具
                    </button>
                    <button
                        class="filter-pill type-pill"
                        :class="{ active: selectedType === 'weapon' }"
                        :style="selectedType === 'weapon' ? { background: '#ef444420', color: '#dc2626', borderColor: '#ef444450' } : {}"
                        @click="selectedType = 'weapon'">
                        武器
                    </button>
                    <button
                        class="filter-pill type-pill"
                        :class="{ active: selectedType === 'tool' }"
                        :style="selectedType === 'tool' ? { background: '#10b98120', color: '#059669', borderColor: '#10b98150' } : {}"
                        @click="selectedType = 'tool'">
                        工具
                    </button>
                </div>
            </div>
            <div class="filter-group">
                <span class="filter-label">
                    <Icon name="lucide:award" :size="16" />
                    稀有度
                </span>
                <div class="filter-pills">
                    <button
                        class="filter-pill"
                        :class="{ active: selectedRarity === 'all' }"
                        @click="selectedRarity = 'all'">
                        全部
                    </button>
                    <button
                        v-for="id in rarityIds"
                        :key="id"
                        class="filter-pill rarity-pill"
                        :class="{ active: selectedRarity === id }"
                        :style="selectedRarity === id ? { background: manifest.rarities[id].color + '25', color: manifest.rarities[id].color, borderColor: manifest.rarities[id].color + '50' } : {}"
                        @click="selectedRarity = id">
                        {{ manifest.rarities[id].name }}
                    </button>
                </div>
            </div>
            <div class="filter-group search-group">
                <span class="filter-label">
                    <Icon name="lucide:search" :size="16" />
                    搜索
                </span>
                <div class="search-input-wrapper">
                    <input
                        v-model="searchQuery"
                        type="text"
                        placeholder="输入附魔名称..."
                        class="search-input" />
                    <button
                        v-if="searchQuery"
                        class="search-clear"
                        @click="searchQuery = ''">
                        <Icon name="lucide:x" :size="14" />
                    </button>
                </div>
            </div>
        </div>

        <div v-for="id in visibleRarityIds" :key="id" class="rarity-group">
                <h2 class="group-title" :style="{ color: manifest.rarities[id].color }">
                    <Icon name="lucide:sparkles" :size="18" />
                    {{ manifest.rarities[id].name }}
                </h2>
                <div class="items-grid">
                    <div
                        v-for="(column, columnIndex) in splitColumns(byRarity[id], 2)"
                        :key="columnIndex"
                        class="items-column">
                        <EnchantmentCard
                            v-for="item in column"
                            :key="item.id"
                            :item="item"
                            :name-map="nameMap"
                            :type-color-map="typeColorMap"
                            :rarity-color-map="rarityColorMap" />
                    </div>
                </div>
        </div>

        <div v-if="filteredEnchants.length === 0" class="empty-state">
            <Icon name="lucide:search-x" :size="32" />
            <p>没有符合条件的附魔</p>
        </div>
    </section>
</template>

<style scoped>
    .showcase {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .filter-bar {
        display: flex;
        flex-wrap: wrap;
        gap: 10px 20px;
        padding: 12px 14px;
        border-radius: var(--radius-xl);
        background: rgba(255, 250, 242, 0.95);
        border: 1px solid rgba(0, 0, 0, 0.08);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        margin-bottom: -32px;
    }

    .filter-group {
        display: flex;
        align-items: center;
        gap: 12px;
        flex-wrap: wrap;
    }

    .filter-label {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 0.9375rem;
        font-weight: 500;
        color: #5c4d3d;
        flex-shrink: 0;
    }

    .filter-pills {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
    }

    .filter-pill {
        padding: 8px 16px;
        border-radius: 8px;
        border: 1px solid rgba(0, 0, 0, 0.08);
        background: rgba(255, 255, 255, 0.6);
        color: #5c4d3d;
        font-size: 0.875rem;
        font-weight: 500;
        cursor: pointer;
        transition:
            background 0.15s ease,
            color 0.15s ease,
            border-color 0.15s ease,
            box-shadow 0.15s ease;
    }

    .filter-pill:hover {
        background: rgba(255, 255, 255, 0.9);
        border-color: rgba(184, 114, 46, 0.4);
    }

    .filter-pill.active {
        background: rgba(184, 114, 46, 0.15);
        color: #1a1612;
        border-color: rgba(184, 114, 46, 0.5);
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4);
    }

    .group-title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 1.25rem;
        margin-top: 8px;
        margin-bottom: 16px;
    }

    .rarity-group:first-child .group-title {
        margin-top: 0;
    }

    .items-grid {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        gap: 14px;
    }

    .items-column {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 14px;
    }

    .search-group {
        flex: 1;
        min-width: 220px;
    }

    .search-input-wrapper {
        position: relative;
        display: flex;
        align-items: center;
        flex: 1;
        min-width: 0;
    }

    .search-icon {
        position: absolute;
        left: 12px;
        color: #8c7b65;
        pointer-events: none;
    }

    .search-input {
        width: 100%;
        padding: 8px 8px;
        border-radius: 8px;
        border: 1px solid rgba(0, 0, 0, 0.08);
        background: rgba(255, 255, 255, 0.6);
        color: #5c4d3d;
        font-size: 0.875rem;
        font-weight: 500;
        outline: none;
        transition:
            background 0.15s ease,
            border-color 0.15s ease,
            box-shadow 0.15s ease;
    }

    .search-input::placeholder {
        color: #9c8b75;
    }

    .search-input:focus {
        background: rgba(255, 255, 255, 0.9);
        border-color: rgba(184, 114, 46, 0.4);
        box-shadow: 0 0 0 3px rgba(184, 114, 46, 0.1);
    }

    .search-clear {
        position: absolute;
        right: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 4px;
        border: none;
        background: transparent;
        color: #8c7b65;
        cursor: pointer;
        border-radius: 4px;
        transition: background 0.15s ease, color 0.15s ease;
    }

    .search-clear:hover {
        background: rgba(0, 0, 0, 0.06);
        color: #5c4d3d;
    }

    .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
        padding: 48px 16px;
        color: #7c6b55;
        font-size: 0.9375rem;
    }

    .empty-state p {
        margin: 0;
    }

    @media (max-width: 900px) {
        .items-grid {
            flex-direction: column;
        }
    }
</style>
