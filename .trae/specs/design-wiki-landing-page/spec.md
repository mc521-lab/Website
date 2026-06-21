# Wiki 入口页视觉设计 Spec

## Why

当前主页的"查看百科"按钮指向 `/wiki`，但该路径没有对应的页面，用户会遭遇 404。需要一个风格统一、信息层级清晰的 Wiki 入口 landing page，作为从主页到 Wiki 文档体系的桥梁，同时延续站点已有的古风视觉品牌。

## What Changes

- 新建 `src/pages/wiki/index.astro` —— Wiki 入口落地页
- 使用现有 `Layout.astro` + 古风设计系统（`gufeng-*` 工具类）
- 页面包含：Hero 标题区、四大分类导航卡片网格、底部返回主页链接
- 卡片内容数据硬编码于组件 frontmatter，无需外部数据源

## Impact

- Affected specs: 无
- Affected code:
    - 新增 `src/pages/wiki/index.astro`
    - 可能微调 `src/styles/global.css` 补充 Wiki 入口页专用工具类（如需要）

## ADDED Requirements

### Requirement: Wiki 入口页

The system SHALL 提供一个位于 `/wiki` 的视觉化入口页面，使用古风设计系统，与主页品牌调性一致。

#### Scenario: 页面访问

- **WHEN** 用户从主页点击"查看百科"或访问 `/wiki`
- **THEN** 页面正常渲染，不返回 404

#### Scenario: Hero 区域

- **WHEN** 用户进入页面
- **THEN** 顶部显示大标题"君庭阁百科"（楷体），副标题文案，以及一条装饰性分隔线；背景为宣纸纹理（`gufeng-paper`）

#### Scenario: 分类导航卡片

- **WHEN** 用户浏览页面主体
- **THEN** 看到 4 张（或 2×2 网格）古风卡片，对应 Wiki 四大分类：新手指南、公会系统、规章制度、内容图鉴
- **每张卡片**包含：分类名（楷体）、简介（宋体）、该分类下的关键页面链接（最多 3 个）、一个"进入分类 →"按钮
- **卡片视觉**使用 `gufeng-card` 样式，hover 时边框变为朱砂红并产生微光晕

#### Scenario: 响应式

- **WHEN** 用户在手机端访问
- **THEN** 卡片单列排列，Hero 文字适当缩小，触控目标 ≥44px

#### Scenario: 暗色主题一致性

- **WHEN** 用户切换暗色模式
- **THEN** 页面背景、文字、卡片、按钮均正确切换至深墨色系，与主页暗色模式完全一致

#### Scenario: 返回主页

- **WHEN** 用户浏览至页面底部
- **THEN** 存在一个返回主页的链接或按钮

## MODIFIED Requirements

无现有需求修改。

## REMOVED Requirements

无功能移除。
