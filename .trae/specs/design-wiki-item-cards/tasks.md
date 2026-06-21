# Tasks

- [x] Task 1: 创建基础共享组件与工具
    - [x] SubTask 1.1: 创建 `src/components/starlight/custom/showcase/` 目录
    - [x] SubTask 1.2: 创建共享的 `ItemCardBase.astro` 或 CSS 类约定（使用现有 `gufeng-card`、`gufeng-corner`、`gufeng-seal`）
    - [x] SubTask 1.3: 确定各 JSON 数据的 TypeScript 类型定义（可内联在组件中）

- [x] Task 2: 创建宝石图鉴组件
    - [x] SubTask 2.1: 创建 `GemCard.astro`（名称、标识色、属性方向、C/B/A/S 品质数值范围）
    - [x] SubTask 2.2: 创建 `GemShowcase.astro`（服务端加载 `gems.json`，原生 JS 搜索过滤）
    - [x] SubTask 2.3: 在 `gems.mdx` 中引入 `<GemShowcase />`

- [x] Task 3: 创建装备图鉴组件
    - [x] SubTask 3.1: 创建 `EquipmentCard.astro`（部位、品质、职业、属性、槽位、套装效果）
    - [x] SubTask 3.2: 创建 `EquipmentShowcase.astro`（服务端加载 `equipment.json` 的 equipments 数组，原生 JS 搜索+职业过滤）
    - [x] SubTask 3.3: 在 `equipment.mdx` 中引入 `<EquipmentShowcase />`

- [x] Task 4: 创建武器图鉴组件
    - [x] SubTask 4.1: 创建 `WeaponCard.astro`（伤害、攻速、暴击、槽位）
    - [x] SubTask 4.2: 创建 `WeaponShowcase.astro`（服务端加载 `equipment.json` 的 weapons 数组，原生 JS 搜索+职业过滤）
    - [x] SubTask 4.3: 在 `weapons.mdx` 中引入 `<WeaponShowcase />`

- [x] Task 5: 创建附魔图鉴组件
    - [x] SubTask 5.1: 创建 `EnchantCard.astro`（类型、稀有度、等级、效果、等级选择器）
    - [x] SubTask 5.2: 创建 `EnchantShowcase.astro`（服务端加载 `enchants.json`，原生 JS 搜索+类型/稀有度过滤）
    - [x] SubTask 5.3: 在 `enchantments.mdx` 中引入 `<EnchantShowcase />`

- [x] Task 6: 创建工具图鉴组件
    - [x] SubTask 6.1: 创建 `ToolCard.astro`（类别、描述、附魔、耐久/时限）
    - [x] SubTask 6.2: 创建 `ToolsShowcase.astro`（服务端加载 `tools.json`，原生 JS 搜索+类别过滤）
    - [x] SubTask 6.3: 在 `tools.mdx` 中引入 `<ToolsShowcase />`

- [x] Task 7: 创建材料图鉴组件
    - [x] SubTask 7.1: 创建 `MaterialCard.astro`（名称、品质、类型、描述、来源、图片）
    - [x] SubTask 7.2: 创建 `MaterialShowcase.astro`（服务端加载 `materials.json`，原生 JS 搜索+品质过滤）
    - [x] SubTask 7.3: 在 `materials.mdx` 中引入 `<MaterialShowcase />`

- [x] Task 8: 创建饰品图鉴组件
    - [x] SubTask 8.1: 创建 `JewelryCard.astro`（名称、部位、职业、属性组合、数值范围、秘宝标识）
    - [x] SubTask 8.2: 创建 `JewelryShowcase.astro`（服务端加载 `jewelries.json`，原生 JS 搜索+职业/部位过滤）
    - [x] SubTask 8.3: 在 `jewelries.mdx` 中引入 `<JewelryShowcase />`

- [x] Task 9: 最终验证与修复
    - [x] SubTask 9.1: 运行 `npx astro check` 确认无编译错误
    - [x] SubTask 9.2: 重启 dev server，浏览器访问所有 7 个图鉴页，确认数据渲染正常、搜索过滤可用、无控制台报错

# Task Dependencies

- Task 1 为所有后续任务的基础
- Task 2~8 互相独立，可并行
- Task 9 依赖 Task 2~8 全部完成
