# 附魔图鉴卡片古风重设计 Spec

## Why

用户反馈 Wiki 界面的附魔图鉴卡片 Layout "很奇怪"，与网站整体的古风/中国风品牌调性不符。当前卡片使用现代圆角边框和默认阴影，缺乏古风质感。需要在保留品质颜色标记（rarityColor）的前提下，将卡片重塑为具有古风卷轴/素笺质感的视觉风格。

## What Changes

- 重塑 `EnchantmentShowcase.astro` 卡片视觉：从现代圆角卡片改为古风双层边框 + 角花装饰卡片
- 重塑卡片内部信息层级：标题（楷体）、描述（宋体）、标签（印章风）、等级选择器（方钮）、数值、适用/冲突/状态区域
- 将 emoji 物品图标替换为 Lucide SVG 图标，保持风格统一
- 搜索框和筛选按钮同步应用古风样式（卷轴边框、印章标签）
- 同步清理未使用的 `EnchantsShowcase.astro` 副本，避免维护两份相同代码
- **保留**：所有现有交互逻辑（搜索、筛选、等级计算、数值动态更新）
- **保留**：品质颜色标记（rarityColor 用于顶部装饰线、标签、等级按钮 active 态）

## Impact

- Affected specs: `restyle-wiki-gufeng`（在已完成的全局古风覆盖基础上，针对附魔图鉴做专项卡片改造）
- Affected code:
    - `src/components/starlight/custom/EnchantmentShowcase.astro` — 主要改造对象
    - `src/components/starlight/custom/EnchantsShowcase.astro` — 删除（与 EnchantmentShowcase 重复且未被引用）
    - `src/styles/global.css` — 可能需要补充附魔卡片专用的古风工具类或覆盖样式

## ADDED Requirements

### Requirement: 附魔卡片古风视觉重塑

The system SHALL render enchantment cards with an ancient-Chinese (gufeng) visual identity while preserving rarity color markers.

#### Scenario: 卡片外壳

- **WHEN** 用户浏览附魔图鉴卡片
- **THEN** 每张卡片使用双层边框（外层 `1px solid var(--border)` + 内层 `inset 4-5px` 细线），四角带有角花装饰（`gufeng-corner` 伪元素），背景为 `var(--card)`，hover 时边框色过渡为品质色（`rarityColor`）并带有微弱品质色光晕

#### Scenario: 卡片顶部品质装饰

- **WHEN** 用户查看任意卡片顶部
- **THEN** 卡片顶部保留一条 2px 高的品质色渐变装饰线（`linear-gradient(90deg, transparent, rarityColor, transparent)`），作为品质识别的首要视觉标记

#### Scenario: 标题与标签

- **WHEN** 用户查看卡片标题区域
- **THEN** 附魔名称使用楷体（`var(--font-heading)` / LXGW WenKai），字号 `text-sm font-bold`，颜色 `var(--foreground)`；类型和品质标签位于右上角，使用小型印章风格标签（圆角 `2px`，边框 `1px solid`，背景半透明，文字为对应 typeColor / rarityColor）

#### Scenario: 描述文本

- **WHEN** 用户阅读卡片描述
- **THEN** 描述使用宋体（`var(--font-sans)` / Noto Serif SC），字号 `text-[11px]`，颜色 `var(--muted-foreground)`，行高 `leading-relaxed`，字间距适中

#### Scenario: 等级选择器（方钮）

- **WHEN** 用户查看有数值的附魔卡片
- **THEN** 等级按钮为方形（`rounded-sm` 或 `rounded-none`），尺寸 `h-5 w-5`，边框 `1px solid var(--border)`，背景 `var(--card)`；当前选中的等级按钮背景填充为 `rarityColor`，文字变为 `#1a1612`（深墨），形成印章按下的视觉感受

#### Scenario: 数值展示区

- **WHEN** 用户切换等级后
- **THEN** 数值区域使用简洁的键值对布局，键名颜色 `var(--muted-foreground)`，数值颜色 `rarityColor`，区域背景使用半透明深色卡片（`bg-[var(--background)]`）并带品质色细边框

#### Scenario: 适用装备标签

- **WHEN** 用户查看附魔适用装备
- **THEN** 每个装备使用 Lucide SVG 图标（替代 emoji）+ 装备名称，标签样式为小型 pill（`rounded-sm bg-[var(--muted)]`），文字颜色 `var(--foreground)`，图标与文字对齐基线

#### Scenario: 冲突标签

- **WHEN** 用户查看冲突附魔
- **THEN** 冲突标签使用暗红色背景（`bg-red-950/30`）和红色文字（`text-red-400/80`），与现有保持一致但字体改为宋体

#### Scenario: 底部状态标签

- **WHEN** 用户查看卡片底部
- **THEN** "附魔台"、"交易"、"探索" 状态使用小型文字标签，图标使用 Lucide SVG，颜色保持现有语义（翠绿、蓝、琥珀），但字体改为宋体，间距更宽松

#### Scenario: 搜索框与筛选器古风化

- **WHEN** 用户查看搜索和筛选区域
- **THEN** 搜索框使用古风边框风格（双层边框或底部装饰线），筛选按钮使用 `gufeng-btn` 或小型印章标签风格，active 状态填充对应颜色

#### Scenario: 分组标题

- **WHEN** 用户查看稀有度分组标题
- **THEN** 左侧竖条指示器保留（颜色为 rarityColor），分组名称使用楷体，颜色为 rarityColor，计数文字使用宋体

## MODIFIED Requirements

无现有相关需求需要修改。

## REMOVED Requirements

### Requirement: EnchantsShowcase.astro 组件

**Reason**: `EnchantsShowcase.astro` 与 `EnchantmentShowcase.astro` 内容几乎完全一致，且在项目中未被任何页面引用（仅有 `EnchantmentShowcase` 被 `enchantments.mdx` 使用），维护两份相同代码会造成冗余和未来的不一致风险。
**Migration**: 直接删除 `src/components/starlight/custom/EnchantsShowcase.astro`，所有附魔图鉴展示统一使用 `EnchantmentShowcase.astro`。
