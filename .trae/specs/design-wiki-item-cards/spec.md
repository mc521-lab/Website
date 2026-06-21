# Wiki 物品卡片组件 Spec

## Why

Wiki 物品图鉴页面（宝石、装备、武器、附魔、工具、材料、饰品）目前仅包含纯文本描述，缺乏对 `public/data/wiki/*.json` 中游戏数据的直观展示。需要设计一套符合站点古风主题的物品卡片组件，以服务端渲染的 Astro 组件形式呈现数据，并提供原生 JS 搜索与过滤交互。

## What Changes

- 在 `src/components/starlight/custom/showcase/` 下新建 7 组 Astro 卡片组件（Showcase + Card）
- 数据通过 Astro frontmatter 以 `fs.readFileSync` 服务端加载，消除客户端 hydration 风险
- 搜索、分类过滤、附魔等级选择等交互使用内联 `<script>` + `data-*` 属性实现
- 卡片视觉沿用现有古风设计系统（`gufeng-card`、`gufeng-corner`、`gufeng-seal` 等）
- 7 个 MDX 页面引入对应 Showcase 组件并传入数据

## Impact

- Affected specs: Wiki 物品图鉴全部页面
- Affected code:
    - 新增 `src/components/starlight/custom/showcase/**`
    - 修改 `src/content/docs/wiki/item/*.mdx`

## ADDED Requirements

### Requirement: 服务端数据加载

The system SHALL 在 Astro 组件 frontmatter 中使用 Node.js `fs` 模块同步读取 `public/data/wiki/{type}.json`。

#### Scenario: 数据可用

- **WHEN** Wiki 页面渲染时
- **THEN** 组件正确解析并传递 JSON 数据到模板

### Requirement: 宝石卡片 (GemCard)

The system SHALL 为每种宝石展示名称、标识色、属性方向、以及 C/B/A/S 四级品质对应的数值范围。

#### Scenario: 渲染

- **WHEN** 用户访问宝石图鉴页
- **THEN** 卡片以品质高低排列，数值范围清晰可读

### Requirement: 装备卡片 (EquipmentCard)

The system SHALL 展示每件装备的名称、部位、品质、适用职业、基础属性、附魔槽/宝石槽数量、套装效果。

#### Scenario: 按职业过滤

- **WHEN** 用户点击职业筛选按钮
- **THEN** 仅展示对应职业的装备

### Requirement: 武器卡片 (WeaponCard)

The system SHALL 展示每件武器的名称、品质、适用职业、基础伤害、攻速、暴击属性、附魔槽/宝石槽数量。

#### Scenario: 按职业过滤

- **WHEN** 用户点击职业筛选按钮
- **THEN** 仅展示对应职业的武器

### Requirement: 附魔卡片 (EnchantCard)

The system SHALL 展示附魔名称、类型（原版/扩展）、稀有度、最高等级、适用目标、效果描述，并支持等级选择器实时计算数值。

#### Scenario: 等级选择器

- **WHEN** 用户点击 1~N 级按钮
- **THEN** 卡片内公式根据等级重新计算并更新 DOM

### Requirement: 工具卡片 (ToolCard)

The system SHALL 展示工具名称、类别、品质、描述、自带附魔列表、耐久/时限信息。

#### Scenario: 类别过滤

- **WHEN** 用户点击镐子/斧子/铲子/锄头筛选按钮
- **THEN** 仅展示对应类别工具

### Requirement: 材料卡片 (MaterialCard)

The system SHALL 展示材料名称、品质、类型、描述、来源，如有图片则显示图片。

#### Scenario: 搜索过滤

- **WHEN** 用户在搜索框输入关键词
- **THEN** 仅展示名称或描述包含关键词的材料

### Requirement: 饰品卡片 (JewelryCard)

The system SHALL 展示饰品名称、部位、适用职业、可能的属性组合及数值范围，秘宝需特殊标识。

#### Scenario: 按职业与部位过滤

- **WHEN** 用户选择职业或部位筛选项
- **THEN** 仅展示匹配的饰品

### Requirement: 原生 JS 交互

The system SHALL 使用内联 `<script>` 标签实现所有客户端交互，禁止引入 React/Vue/Svelte islands。

#### Scenario: 搜索过滤

- **WHEN** 用户输入搜索词
- **THEN** 不匹配项通过 `display: none` 隐藏

## MODIFIED Requirements

无现有需求修改。

## REMOVED Requirements

无功能移除。
