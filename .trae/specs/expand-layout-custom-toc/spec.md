# Wiki 布局扩宽与自定义 TOC Spec

## Why

当前 Starlight 默认布局将正文内容限制在 `--sl-content-width: 45rem`，在宽屏下两侧留白过大，图鉴卡片等内容无法充分利用屏幕空间。同时右侧 "On this page" 导航固定在侧边，占用宽度且不可收起，影响内容阅读体验。

## What Changes

- **覆盖 `TwoColumnContent` 组件**：移除正文宽度上限，使 `main-pane` 自动撑满剩余可用空间
- **覆盖 `PageSidebar` 组件**：将默认静态 TOC 替换为可收起的自定义 TOC 面板
- **新增交互**：在 TOC 面板顶部添加折叠/展开按钮，使用 CSS transform 实现平滑侧滑动画（200ms ease-out）
- **状态持久化**：使用 `localStorage` 记录用户折叠偏好，刷新后保持状态
- **响应式保留**：移动端保持现有行为（`MobileTableOfContents` 不变），仅在桌面端（≥72rem）启用可收起 TOC

## Impact

- Affected specs: Wiki 所有内容页面
- Affected code:
    - `astro.config.mjs` — 注册组件覆盖
    - `src/components/starlight/TwoColumnContent.astro` — 新增覆盖文件
    - `src/components/starlight/PageSidebar.astro` — 新增覆盖文件
    - `src/styles/global.css` — 添加 TOC 折叠相关样式

## ADDED Requirements

### Requirement: Full-width Main Content

The system SHALL remove the fixed `--sl-content-width` constraint so the main content area expands to fill all available horizontal space between the left sidebar and the right TOC panel.

#### Scenario: Desktop wide screen

- **WHEN** viewport width is ≥72rem and both sidebar and TOC are present
- **THEN** main pane width equals `100% - sidebar_width - toc_width`

### Requirement: Collapsible TOC Panel

The system SHALL provide a toggle button on the right TOC panel that allows users to collapse/expand it.

#### Scenario: Collapse

- **WHEN** user clicks the collapse button
- **THEN** TOC panel slides out to the right (transform: translateX), its width reduces to 0, and main pane expands to fill the space

#### Scenario: Expand

- **WHEN** user clicks the expand button
- **THEN** TOC panel slides back in, restoring its original width

#### Scenario: State persistence

- **WHEN** user toggles the panel and then refreshes the page
- **THEN** the panel respects the previous state stored in `localStorage`

## MODIFIED Requirements

### Requirement: Starlight Component Overrides

- Register `TwoColumnContent: "./src/components/starlight/TwoColumnContent.astro"` in `astro.config.mjs`
- Register `PageSidebar: "./src/components/starlight/PageSidebar.astro"` in `astro.config.mjs`

## REMOVED Requirements

### Requirement: Default Starlight Content Width Constraint

**Reason**: Content width is now dynamic based on available space.
**Migration**: Override `TwoColumnContent` and remove fixed width calculations.
