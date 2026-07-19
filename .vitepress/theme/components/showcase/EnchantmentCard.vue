<script setup lang="ts">
    import type { WikiEnchant } from "../../../types/wiki";
    import Icon from "../Icon.vue";

    defineProps<{
        item: WikiEnchant;
        nameMap: Record<string, string>;
        typeColorMap: Record<string, string>;
        rarityColorMap: Record<string, string>;
    }>();

    function targetIcon(target: string): string {
        switch (target) {
            case "sword":
                return "lucide:sword";
            case "axe":
                return "lucide:axe";
            case "pickaxe":
                return "lucide:pickaxe";
            case "shovel":
                return "lucide:shovel";
            case "hoe":
                return "lucide:sprout";
            case "helmet":
                return "lucide:hard-hat";
            case "chestplate":
                return "lucide:shirt";
            case "leggings":
                return "lucide:scaling";
            case "boots":
                return "lucide:footprints";
            case "bow":
                return "lucide:target";
            case "crossbow":
                return "lucide:crosshair";
            case "trident":
                return "lucide:trident";
            case "fishing_rod":
                return "lucide:fish";
            case "shears":
                return "lucide:scissors";
            case "flint_and_steel":
                return "lucide:flame";
            case "carrot_on_a_stick":
                return "lucide:carrot";
            case "warped_fungus_on_a_stick":
                return "lucide:mushroom";
            case "brush":
                return "lucide:brush";
            case "elytra":
                return "lucide:plane";
            case "shield":
                return "lucide:shield";
            case "book":
                return "lucide:book";
            case "mace":
                return "lucide:gavel";
            default:
                return "lucide:box";
        }
    }

    function targetName(target: string): string {
        const names: Record<string, string> = {
            sword: "剑",
            axe: "斧",
            pickaxe: "镐",
            shovel: "锹",
            hoe: "锄",
            helmet: "头盔",
            chestplate: "胸甲",
            leggings: "护腿",
            boots: "靴子",
            bow: "弓",
            crossbow: "弩",
            trident: "三叉戟",
            fishing_rod: "钓鱼竿",
            shears: "剪刀",
            flint_and_steel: "打火石",
            carrot_on_a_stick: "萝卜钓竿",
            warped_fungus_on_a_stick: "诡异菌钓竿",
            brush: "刷子",
            elytra: "鞘翅",
            shield: "盾牌",
            book: "书",
            mace: "重锤",
        };
        return names[target] ?? target;
    }

    const armorTargets = new Set(["helmet", "chestplate", "leggings", "boots", "shield"]);
    const weaponTargets = new Set(["sword", "bow", "crossbow", "mace", "trident"]);

    function getCategories(targets: string[]): string[] {
        const cats: string[] = [];
        let hasArmor = false;
        let hasWeapon = false;
        let hasTool = false;
        for (const t of targets) {
            if (armorTargets.has(t)) hasArmor = true;
            else if (weaponTargets.has(t)) hasWeapon = true;
            else hasTool = true;
        }
        if (hasArmor) cats.push("防具");
        if (hasWeapon) cats.push("武器");
        if (hasTool) cats.push("工具");
        return cats;
    }

    const imageTargets = new Set([
        "axe",
        "boots",
        "bow",
        "chestplate",
        "crossbow",
        "fishing_rod",
        "flint_and_steel",
        "helmet",
        "hoe",
        "leggings",
        "mace",
        "pickaxe",
        "shears",
        "shield",
        "shovel",
        "spear",
        "sword",
        "trident",
        "elytra"
    ]);

    function targetImage(target: string): string | null {
        return imageTargets.has(target) ? `/wiki/item/enchantments/${target}.png` : null;
    }

    function valueIcon(name: string): string {
        const lower = name.toLowerCase();
        if (lower.includes("伤害") || lower.includes("火焰")) return "lucide:sword";
        if (lower.includes("减免") || lower.includes("免疫")) return "lucide:shield";
        if (lower.includes("暴击")) return "lucide:target";
        if (lower.includes("速度")) return "lucide:wind";
        if (lower.includes("几率")) return "lucide:percent";
        if (lower.includes("持续时间") || lower.includes("时间") || lower.includes("冷却")) return "lucide:clock";
        if (lower.includes("数量")) return "lucide:hash";
        if (lower.includes("半径")) return "lucide:circle";
        if (lower.includes("击退")) return "lucide:move-horizontal";
        if (lower.includes("耐久")) return "lucide:hammer";
        if (lower.includes("经验")) return "lucide:star";
        if (lower.includes("饥饿")) return "lucide:beef";
        if (lower.includes("生长")) return "lucide:sprout";
        if (lower.includes("隐身")) return "lucide:eye-off";
        if (lower.includes("传送")) return "lucide:arrow-right";
        if (lower.includes("幸运")) return "lucide:clover";
        if (lower.includes("呼吸")) return "lucide:droplets";
        if (lower.includes("横扫")) return "lucide:waves";
        if (lower.includes("距离")) return "lucide:move";
        if (lower.includes("反弹")) return "lucide:rotate-ccw";
        if (lower.includes("宝藏")) return "lucide:gem";
        if (lower.includes("穿透")) return "lucide:arrow-right";
        return "lucide:zap";
    }

    function valueIconColor(name: string): string {
        const lower = name.toLowerCase();
        if (lower.includes("伤害") || lower.includes("火焰")) return "#c23b3b";
        if (lower.includes("减免") || lower.includes("免疫")) return "#3b82f6";
        if (lower.includes("暴击")) return "#f59e0b";
        if (lower.includes("速度")) return "#06b6d4";
        if (lower.includes("几率")) return "#8b5cf6";
        if (lower.includes("持续时间") || lower.includes("时间") || lower.includes("冷却")) return "#3b82f6";
        if (lower.includes("数量")) return "#8a5a2b";
        if (lower.includes("半径")) return "#f97316";
        if (lower.includes("击退")) return "#6b7280";
        if (lower.includes("耐久")) return "#8a5a2b";
        if (lower.includes("经验")) return "#eab308";
        if (lower.includes("饥饿")) return "#8a5a2b";
        if (lower.includes("生长")) return "#22c55e";
        if (lower.includes("隐身")) return "#a855f7";
        if (lower.includes("传送")) return "#06b6d4";
        if (lower.includes("幸运")) return "#22c55e";
        if (lower.includes("呼吸")) return "#3b82f6";
        if (lower.includes("横扫")) return "#3b82f6";
        if (lower.includes("距离")) return "#6b7280";
        if (lower.includes("反弹")) return "#3b82f6";
        if (lower.includes("宝藏")) return "#eab308";
        if (lower.includes("穿透")) return "#6b7280";
        return "#b87333";
    }

    function formatFormula(formula: string, unit: string): string {
        return formula.replace(/%level%/g, "等级") + unit;
    }
</script>

<template>
    <article class="enchantment-card">
        <header class="card-header">
            <div class="header-left">
                <div class="icon-frame" :style="{ borderColor: rarityColorMap[item.rarity] + '50', color: rarityColorMap[item.rarity] }">
                    <Icon name="lucide:sparkles" :size="22" />
                </div>
                <div class="header-titles">
                    <div class="title-row">
                        <h3 class="card-title">{{ item.displayName }}</h3>
                        <span v-for="cat in getCategories(item.targets)" :key="cat" class="badge type-badge" :style="{ background: cat === '防具' ? '#3b82f620' : cat === '武器' ? '#ef444420' : '#10b98120', color: cat === '防具' ? '#2563eb' : cat === '武器' ? '#dc2626' : '#059669', borderColor: cat === '防具' ? '#3b82f635' : cat === '武器' ? '#ef444435' : '#10b98135' }">
                            {{ cat }}
                        </span>
                    </div>
                    <p v-if="item.effects.length" class="subtitle">{{ item.effects[0].description }}</p>
                </div>
            </div>
            <span class="level-badge">
                最高等级：{{ item.maxLevel }}
            </span>
        </header>

        <hr class="divider" />

        <section class="targets-section">
            <div class="section-title">适用装备：</div>
            <div class="targets-row">
                <span v-for="target in item.targets" :key="target" class="target-pill" :title="targetName(target)">
                    <img v-if="targetImage(target)" :src="targetImage(target)!" :alt="targetName(target)" class="target-img" />
                    <Icon v-else :name="targetIcon(target)" :size="12" />
                    <span>{{ targetName(target) }}</span>
                </span>
            </div>
        </section>

        <hr class="divider" />

        <section v-if="item.values.length" class="values-section">
            <div class="section-title">关键数值</div>
            <div class="values-table">
                <div v-for="value in item.values" :key="value.id" class="value-item">
                    <Icon
                        :name="valueIcon(value.name)"
                        :size="14"
                        class="value-icon"
                        :style="{ color: valueIconColor(value.name) }" />
                    <span class="value-name">{{ value.name }}</span>
                    <span class="value-divider">│</span>
                    <span class="value-description">{{ value.description }}</span>
                    <span v-if="value.formula" class="value-formula">{{ formatFormula(value.formula, value.unit) }}</span>
                </div>
            </div>
        </section>

        <hr v-if="item.values.length" class="divider" />

        <footer class="card-footer">
            <div v-if="item.conflicts.length" class="conflicts">
                <span class="footer-label">冲突：</span>
                <span v-for="conflict in item.conflicts" :key="conflict" class="conflict-pill">
                    {{ nameMap[conflict] ?? conflict }}
                </span>
            </div>
            <div class="flags">
                <span class="flag" :class="{ enabled: item.tradeable }">
                    <Icon :name="item.tradeable ? 'lucide:check' : 'lucide:x'" :size="12" />
                    可交易
                </span>
                <span class="flag" :class="{ enabled: item.discoverable }">
                    <Icon :name="item.discoverable ? 'lucide:check' : 'lucide:x'" :size="12" />
                    可发现
                </span>
                <span class="flag" :class="{ enabled: item.enchantable }">
                    <Icon :name="item.enchantable ? 'lucide:check' : 'lucide:x'" :size="12" />
                    可附魔
                </span>
            </div>
        </footer>
    </article>
</template>

<style scoped>
    .enchantment-card {
        display: flex;
        flex-direction: column;
        gap: 14px;
        padding: 18px 20px;
        border-radius: var(--radius-xl);
        background: rgba(255, 250, 242, 0.95);
        border: 1px solid rgba(0, 0, 0, 0.08);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        transition:
            transform 0.15s ease,
            box-shadow 0.15s ease;
    }

    .enchantment-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
    }

    .card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 14px;
    }

    .header-left {
        display: flex;
        align-items: center;
        gap: 12px;
        min-width: 0;
    }

    .icon-frame {
        flex-shrink: 0;
        width: 44px;
        height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--radius-lg);
        border: 2px solid;
        background: rgba(255, 255, 255, 0.5);
    }

    .header-titles {
        display: flex;
        flex-direction: column;
        gap: 4px;
        min-width: 0;
    }

    .title-row {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 8px;
    }

    .card-title {
        margin: 0;
        font-family: var(--font-heading);
        font-size: 1.125rem;
        font-weight: 600;
        color: #1a1612;
    }

    .badge {
        padding: 3px 8px;
        border-radius: 6px;
        border: 1px solid;
        font-size: 0.75rem;
        font-weight: 600;
    }

    .subtitle {
        margin: 0;
        color: #7c6b55;
        font-size: 0.8125rem;
        line-height: 1.4;
    }

    .level-badge {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 5px 10px;
        border-radius: 6px;
        background: rgba(184, 114, 46, 0.12);
        color: #8a5a2b;
        font-size: 0.8125rem;
        font-weight: 500;
        flex-shrink: 0;
    }

    .divider {
        width: 100%;
        height: 1px;
        margin: 0;
        border: none;
        background: rgba(0, 0, 0, 0.08);
    }

    .targets-section,
    .values-section {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .section-title {
        font-size: 0.8125rem;
        font-weight: 600;
        color: #7c6b55;
    }

    .targets-row {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 8px;
    }

    .target-pill {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 5px 10px;
        border-radius: 6px;
        background: rgba(0, 0, 0, 0.05);
        color: #5c4d3d;
        font-size: 0.8125rem;
    }

    .target-img {
        width: 16px;
        height: 16px;
        object-fit: contain;
        image-rendering: pixelated;
        margin-block: -4px;
    }

    .values-table {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-left: 8px;
    }

    .value-item {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 4px;
        padding: 6px 10px;
        border-radius: var(--radius-md);
        background: rgba(0, 0, 0, 0.04);
        font-size: 0.8125rem;
        line-height: 1.5;
    }

    .value-icon {
        flex-shrink: 0;
        margin-right: 2px;
        margin-top: 1px;
    }

    .value-name {
        flex-shrink: 0;
        font-weight: 500;
        color: #5c4d3d;
        margin-top: -2px;
    }

    .value-divider {
        flex-shrink: 0;
        color: #c8b8a0;
    }

    .value-description {
        padding: 1px 6px;
        border-radius: 4px;
        background: rgba(184, 114, 46, 0.12);
        color: #8a5a2b;
        font-size: 0.75rem;
    }

    .value-formula {
        margin-left: auto;
        padding: 1px 6px;
        border-radius: 4px;
        background: rgba(0, 0, 0, 0.06);
        color: #6b5a48;
        font-family: var(--font-mono, monospace);
        font-size: 0.75rem;
    }

    .card-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 10px;
    }

    .conflicts {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 6px;
    }

    .footer-label {
        font-size: 0.75rem;
        color: #7c6b55;
    }

    .conflict-pill {
        padding: 3px 8px;
        border-radius: 6px;
        background: rgba(239, 68, 68, 0.1);
        color: #c23b3b;
        font-size: 0.75rem;
    }

    .flags {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-left: auto;
    }

    .flag {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 0.75rem;
        color: #9c8b75;
    }

    .flag.enabled {
        color: #5a8a3a;
    }

    @media (max-width: 640px) {
        .card-header {
            align-items: flex-start;
            flex-wrap: wrap;
        }

        .value-name {
            text-align: left;
            width: auto;
        }
    }
</style>
