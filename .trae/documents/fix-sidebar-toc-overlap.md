# 修复右侧 ToC 侧栏 Bug 计划

## Summary

将右侧目录栏（ToC）还原为始终显示状态（移除收起/展开功能），并在页面没有实际目录内容时完全隐藏侧栏，确保正文始终撑满可用空间。

## Current State Analysis

### 问题根源

1. **自定义的收起功能引入了 Bug**：项目自定义的 `PageSidebar.astro` 和 `TwoColumnContent.astro` 添加了 `data-toc-collapsed` 展开/收起功能。
2. **定位错误导致重叠**：`TwoColumnContent.astro` 中 `.right-sidebar` 使用了 `position: fixed; inset-inline-end: 0; width: var(--sl-sidebar-width)`，这使其固定在**视口最右侧**。但 `.main-frame` 本身已有左侧边栏的 `padding-inline-start: var(--sl-sidebar-width)`，导致 `.right-sidebar` 实际覆盖在了 `.main-pane` 的右侧区域上，造成正文与 ToC 的 UI 重叠。
3. **空页面仍渲染侧栏**：`gems.mdx` 等只有 h1 的页面，`Starlight` 的 `generateToC` 仍会返回 `[{depth:2, text:"Overview", children:[]}]`，使 `toc` 为 truthy，空侧栏继续占位。

### 相关文件

- `src/components/starlight/PageSidebar.astro` — 自定义了展开/收起按钮和 `data-toc-collapsed` 逻辑
- `src/components/starlight/TwoColumnContent.astro` — 自定义了 flex 布局，但 `.right-sidebar` 定位错误
- `src/styles/global.css` — 包含 `.main-pane { transition: width 200ms ease }` 和 `max-width: none` 覆盖

## Proposed Changes

### 1. `src/components/starlight/PageSidebar.astro`

**What**：移除展开/收起功能，恢复简洁的目录面板；空目录页面不渲染。
**Why**：用户要求还原为一直显示，且只有 "Overview" 的页面不应显示空侧栏。
**How**：

- 删除 `<button class="toc-toggle">` 及其相关 SVG 图标。
- 删除 `<script is:inline>` 中的 `data-toc-collapsed` 状态管理逻辑。
- 删除所有 `:global(html[data-toc-collapsed])` CSS 规则。
- 将渲染条件从 `Astro.locals.starlightRoute.toc && (...)` 改为 `Astro.locals.starlightRoute.toc?.items?.length > 1 && (...)`，排除仅有 Overview 的页面。
- 保留古风颜色/字体覆盖（`.right-sidebar-panel a` 等）。

### 2. `src/components/starlight/TwoColumnContent.astro`

**What**：修复 `.right-sidebar` 定位，移除收起状态样式，空目录页面不渲染占位符。
**Why**：解决正文与 ToC 重叠的核心布局问题；确保无 ToC 时正文撑满。
**How**：

- 将 `.right-sidebar` 的 `inset-inline-end: 0` 移除，并将 `width` 从 `var(--sl-sidebar-width)` 改回 `100%`，使其跟随 `.right-sidebar-container` 的文档流位置，而非强制固定在视口最右侧。
- 删除所有 `:global(html[data-toc-collapsed])` CSS 规则。
- 将渲染条件从 `Astro.locals.starlightRoute.toc && (...)` 改为 `Astro.locals.starlightRoute.toc?.items?.length > 1 && (...)`。
- 保留 flex 布局（`.main-pane: flex: 1`），确保正文在有侧栏时占满剩余空间，无侧栏时占满全部宽度。

### 3. `src/styles/global.css`

**What**：清理不再需要的过渡样式。
**Why**：`data-toc-collapsed` 被移除后，宽度过渡不再需要。
**How**：

- 删除 `.main-pane { transition: width 200ms ease; }` 规则。
- 保留 `.content-panel .sl-container { max-width: none; }`，确保正文内容撑满。
- 保留所有古风样式覆盖。

## Assumptions & Decisions

- `toc.items.length > 1` 作为"有实际目录内容"的判断标准（Starlight 默认会在 `items[0]` 放入 "Overview"，因此需要至少 2 个条目才认为有实际内容）。
- 保留 flex 布局而非还原 Starlight 默认的百分比宽度计算，因为 flex 更能直观实现"正文撑满剩余空间"的需求。
- 保留 `.right-sidebar` 的 `position: fixed`，但修正其定位方式（移除 `inset-inline-end: 0`，宽度 `100%`），使其正确覆盖 `.right-sidebar-container` 而不侵入 `.main-pane`。

## Verification Steps

1. 打开 `localhost:4321/wiki/item/gems/`（无 h2/h3 的页面），确认右侧**完全不显示** ToC 侧栏，正文占满整个页面宽度。
2. 打开一个有多个 h2/h3 标题的 Wiki 页面，确认右侧 ToC **始终显示**，没有展开/收起按钮。
3. 在有 ToC 的页面中，确认正文内容与右侧 ToC 之间没有 UI 重叠，正文正确占满 ToC 左侧的剩余空间。
4. 检查底部分页链接（Previous/Next）在有/无 ToC 的页面中都能正确占满宽度。
