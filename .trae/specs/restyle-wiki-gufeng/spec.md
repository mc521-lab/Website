# Wiki 古风风格改造 Spec

## Why

目前 Wiki 文档页面使用 Starlight 默认主题，视觉风格与主页（MC521 古风主题）严重脱节。为了让 Wiki 文档与主页保持统一的古风/中国风品牌调性，需要对 Starlight 文档界面进行全方位的视觉定制。

## What Changes

- **BREAKING**: 自定义 Starlight 布局组件（Header、Sidebar、PageFrame、MarkdownContent、Pagination 等），使其应用现有的古风设计系统（颜色、字体、边框、间距）
- 使用现有的 `gufeng-*` 工具类对 Starlight 默认组件进行覆写和增强
- 为 Wiki 页面引入宣纸纹理背景、古风卡片、角花装饰、印章标签等视觉元素
- 确保明暗主题（light / dark）在 Wiki 文档中均有一致的古风体验
- 保留 Starlight 的核心功能（导航、搜索、TOC、代码高亮、暗黑模式切换）

## Impact

- Affected specs: 无
- Affected code:
    - `astro.config.mjs` — Starlight 组件覆盖配置
    - `src/components/StarlightLayout.astro` — 已存在，将扩展或重写
    - `src/styles/global.css` — 可能需要补充 Wiki 专用的古风覆盖样式
    - 新增 `src/components/starlight/` 目录用于覆盖 Starlight 默认组件
    - `src/content/docs/` 中的文档内容样式将通过全局 CSS 覆盖

## ADDED Requirements

### Requirement: Starlight 古风视觉统一

The system SHALL provide a consistent ancient-Chinese (gufeng) visual style across all Starlight wiki pages, matching the homepage design system.

#### Scenario: 颜色与字体统一

- **WHEN** 用户访问任意 Wiki 页面
- **THEN** 背景色应为宣纸米色（`#f5f0e6`）或深墨暗色（`#1a1612`），正文使用宋体/Noto Serif SC，标题使用楷体/LXGW WenKai，主色为朱砂红（`#b83b2e`），强调色为赭石/暖金（`#a67c52` / `#c9a961`）

#### Scenario: 导航栏古风化

- **WHEN** 用户查看 Wiki 顶部导航栏
- **THEN** 导航栏应使用半透明卡片背景（`bg-card/80 backdrop-blur-sm`），边框使用暗宣色（`--border`），字体使用楷体，hover 状态呈现朱砂红反馈

#### Scenario: 侧边栏古风化

- **WHEN** 用户查看 Wiki 左侧目录侧边栏
- **THEN** 侧边栏背景应与页面背景一致（宣纸色/深墨色），目录项使用宋体，当前激活项使用朱砂红指示，hover 时背景变为淡宣色（`--secondary`），分组标题使用楷体并带有装饰分隔线

#### Scenario: 内容区域古风化

- **WHEN** 用户阅读文档正文
- **THEN** 正文区域应使用良好的中文排版（行高 1.75、字间距适中），h1/h2 标题下方应有渐变装饰线，代码块使用圆角和深色背景，引用块（blockquote）使用左侧朱砂红边框，表格使用古风边框风格

#### Scenario: TOC 古风化

- **WHEN** 用户查看右侧文章大纲（TOC）
- **THEN** TOC 容器使用半透明卡片背景，当前阅读项使用朱砂红高亮，整体风格与侧边栏统一

#### Scenario: 分页导航古风化

- **WHEN** 用户查看文档底部的上一页/下一页导航
- **THEN** 分页按钮使用 `gufeng-btn` 或 `gufeng-card` 风格，带有悬停反馈

#### Scenario: 暗色主题一致性

- **WHEN** 用户切换到暗色模式
- **THEN** Wiki 页面的所有古风元素应正确切换至深墨色系（`#1a1612` 背景、米白文字、暖金强调），与主页的暗色模式完全一致

## MODIFIED Requirements

无现有相关需求需要修改。

## REMOVED Requirements

无需要移除的功能。
