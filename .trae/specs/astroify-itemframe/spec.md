# Wiki 图鉴组件 Astro 化 Spec

## Why

Wiki 图鉴页面目前使用 React Islands（`client:visible`）加载大量图鉴数据，运行时频繁出现 hydration 错误：

- `Failed to fetch dynamically imported module`
- `React is running in production mode, but dead code elimination has not been applied`

这些错误导致图鉴渲染完全失败。将组件 Astro 化可在服务端直接加载数据并渲染静态 HTML，彻底消除 React hydration 问题，同时显著减少客户端 JS 体积。

## What Changes

- 将 `_react/itemframe/` 下 6 类图鉴（gems、equipment、weapons、enchants、tools、materials、jewelries）全部迁移为纯 Astro 组件
- 数据加载从客户端 `fetch()` 改为服务端 `fs.readFileSync` 读取 `public/data/wiki/*.json`
- 搜索/过滤/分类切换等交互从 React state 改为原生 `<script>` 实现（通过 `data-*` 属性 + classList toggle）
- 附魔等级选择器改用原生 JS 计算数值
- 保留现有的 Astro wrapper 文件路径，只修改其内部实现，避免影响引用它们的 MDX 页面
- 删除 `_react/itemframe/` 目录及其所有内容

## Impact

- Affected specs: Wiki 内容图鉴页面（gems、jewelries、equipment、weapons、tools、enchantments、materials）
- Affected code:
    - `src/components/starlight/custom/_react/itemframe/**`（删除）
    - `src/components/starlight/custom/*Showcase.astro`（重写）
    - 新增 `src/components/starlight/custom/itemframe/`（Astro 子组件）

## ADDED Requirements

### Requirement: Server-side Data Loading

The system SHALL load all itemframe JSON data in Astro component frontmatter using Node.js `fs` module at request time.

#### Scenario: Data available

- **WHEN** a wiki page renders
- **THEN** the component reads `public/data/wiki/{type}.json` synchronously and parses it

### Requirement: Native JS Interactivity

The system SHALL implement search, category filter, and level selector interactivity using inline `<script>` tags with vanilla JS.

#### Scenario: Search filtering

- **WHEN** user types in a search input
- **THEN** items whose `data-name` does not contain the query are hidden via `display: none`

#### Scenario: Category filtering

- **WHEN** user clicks a category button
- **THEN** only items matching that category are shown; others are hidden

#### Scenario: Enchant level selector

- **WHEN** user clicks a level button on an enchant card
- **THEN** the card’s displayed values are recalculated using the formula and updated in the DOM

## MODIFIED Requirements

### Requirement: GemShowcase

- Data loaded server-side from `gems.json`
- Search filters by gem name via native JS
- Renders `GemCard` as Astro component

### Requirement: EquipmentShowcase

- Data loaded server-side from `equipment.json`
- Search + job filter via native JS
- Renders `EquipmentCard` / `EquipmentSetRow` as Astro component

### Requirement: WeaponShowcase

- Data loaded server-side from `equipment.json`
- Search + job filter via native JS
- Renders `CompactWeaponCard` as Astro component

### Requirement: EnchantsShowcase

- Data loaded server-side from `enchants.json`
- Search + type/rarity filter via native JS
- Level selector on each card via native JS with formula evaluation
- Renders `EnchantCard` as Astro component

### Requirement: ToolsShowcase

- Data loaded server-side from `tools.json`
- Search + category filter via native JS
- Renders `ToolCard` as Astro component

### Requirement: MaterialShowcase

- Data loaded server-side from `materials.json`
- Search + category filter via native JS
- Renders `MaterialCard` as Astro component

### Requirement: JewelryShowcase

- Data loaded server-side from `jewelries.json`
- Search + job filter via native JS
- Renders `JewelryCard` as Astro component

## REMOVED Requirements

### Requirement: React Itemframe Components

**Reason**: Replaced by Astro components to eliminate hydration errors and reduce client-side React bundle.
**Migration**: All functionality preserved in Astro equivalents. MDX imports remain unchanged.
