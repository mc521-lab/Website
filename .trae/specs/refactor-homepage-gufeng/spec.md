# 重构主页为古风风格 Spec

## Why

当前主页 (`src/pages/index.astro`) 几乎为空，旧代码在 `.temp/` 中尚未迁移。用户希望以古风视觉重构主页，仅展示 `HOME_CONTENT.md` 中的精简内容，同时兼容手机和电脑浏览，支持明暗主题切换。

## What Changes

- **新增古风设计系统**：在 `src/styles/global.css` 中定义宣纸浅色 / 水墨深色两套古风色板、楷书 + 宋体字体栈、古风装饰工具类（回纹边框、印章、卷轴分隔线等）
- **重建主页**：重写 `src/pages/index.astro`，将 `HOME_CONTENT.md` 全部内容以古风风格呈现，分为 Hero、服务器介绍、分区介绍、社区活动、加入我们五个区块
- **保留现有素材**：Minecraft 背景视频和像素风分区图片保留使用，通过古风边框 / 滤镜处理与整体风格协调
- **交互行为**：三个入口按钮（开始游戏 / 查看百科 / 打开工具箱）实现滚动跳转与路由跳转；服务器地址点击复制；明暗主题切换
- **响应式**：移动端优先，适配 375 / 768 / 1024 / 1440 断点
- **BREAKING**：移除旧的像素字体 (`FusionPixel`) 作为主页默认字体，改用古风字体栈；旧 `mc521-root` 相关样式保留但主页不再使用像素字体

## Impact

- Affected code: `src/styles/global.css`、`src/pages/index.astro`、`src/layouts/Layout.astro`（可能微调）
- 现有素材引用不变：`public/videos/mc-background-video.webm`、`public/images/ecosystem/*.webp`、`public/images/logo.png`
- 不影响 Starlight 文档 (`/wiki`) 和其他子页面

## ADDED Requirements

### Requirement: 古风设计系统

系统 SHALL 在 `global.css` 中提供完整的古风设计 Token，包含明暗两套色板、字体栈和装饰工具类。

#### Scenario: 浅色模式（宣纸）

- **WHEN** 页面以浅色模式渲染
- **THEN** 背景为宣纸米色 (#F5F0E6 系)，文字为墨色 (#2C2416 系)，主色调为朱砂红 (#B83B2E 系)，点缀色为赭石 (#A67C52 系)

#### Scenario: 深色模式（水墨）

- **WHEN** 页面以深色模式渲染
- **THEN** 背景为深墨色 (#1A1612 系)，文字为米白色 (#E8DFD0 系)，主色调为朱砂 (#C84B3E 系)，点缀色为暖金 (#C9A961 系)

#### Scenario: 字体栈

- **WHEN** 渲染标题文字
- **THEN** 使用楷书类字体（霞鹜文楷 LXGW WenKai）作为 display 字体
- **WHEN** 渲染正文文字
- **THEN** 使用宋体类字体（Noto Serif SC / 思源宋体）作为 body 字体

### Requirement: 主页区块结构

系统 SHALL 在主页呈现以下五个区块，内容严格对应 `HOME_CONTENT.md`：

1. **Hero 区块**：MC521 标题、副标题"二十余年，同在一片方块天"、三个入口按钮（开始游戏 / 查看百科 / 打开工具箱）、背景视频
2. **服务器介绍区块**：关于君庭阁的介绍文字、适合哪些玩家的四类列表
3. **分区介绍区块**：九个分区卡片（生存区 / 主城区 / 资源区 / 地皮区 / 钓鱼区 / 魔塔区 / 副本区 / 游戏区 / 更多内容），每个卡片含分区名、标签和描述，使用现有 ecosystem 图片
4. **社区活动区块**：当前活动状态展示
5. **加入我们区块**：服务器地址（可复制）、QQ 群链接

#### Scenario: 完整内容呈现

- **WHEN** 用户访问主页
- **THEN** 页面依次展示上述五个区块，内容与 `HOME_CONTENT.md` 一致，无多余内容

### Requirement: 入口按钮交互

系统 SHALL 为三个入口按钮提供以下交互行为：

#### Scenario: 开始游戏

- **WHEN** 用户点击"开始游戏"按钮
- **THEN** 页面平滑滚动至"加入我们"区块 (#join)

#### Scenario: 查看百科

- **WHEN** 用户点击"查看百科"按钮
- **THEN** 跳转至 `/wiki` 路由

#### Scenario: 打开工具箱

- **WHEN** 用户点击"打开工具箱"按钮
- **THEN** 跳转至 `/toolbox` 路由

### Requirement: 服务器地址复制

系统 SHALL 提供服务器地址点击复制功能。

#### Scenario: 复制成功

- **WHEN** 用户点击服务器地址 `mc521.cc`
- **THEN** 地址被复制到剪贴板，并显示复制成功的视觉反馈（如 toast 提示）

### Requirement: 明暗主题切换

系统 SHALL 提供明暗主题切换功能，默认浅色（宣纸）模式。

#### Scenario: 切换主题

- **WHEN** 用户点击主题切换按钮
- **THEN** 页面在宣纸浅色与水墨深色之间切换，所有古风色板同步更新

### Requirement: 响应式布局

系统 SHALL 兼容手机和电脑浏览，采用移动端优先策略。

#### Scenario: 手机浏览

- **WHEN** 在 375px 宽度设备上浏览
- **THEN** 内容单列排列，字体大小适配（正文 ≥16px），按钮触摸目标 ≥44px，无横向滚动

#### Scenario: 电脑浏览

- **WHEN** 在 1024px+ 宽度设备上浏览
- **THEN** 分区卡片以多列网格排列，内容居中且最大宽度受限，留白舒适

### Requirement: 古风装饰元素

系统 SHALL 在页面中运用古风装饰元素增强风格一致性：

- 区块之间使用古风分隔线（如回纹 / 云纹边框）
- 分区卡片使用古风边框 / 角花装饰
- Hero 区块可使用卷轴 / 书页意象的边框处理
- 装饰元素不得影响内容可读性和交互可用性

## MODIFIED Requirements

### Requirement: 主页字体

原主页使用 `FusionPixel` 像素字体作为默认字体。修改为：主页使用楷书 + 宋体古风字体栈，`FusionPixel` 像素字体类 (`pixel-font`) 保留供其他页面使用，但主页不再默认应用。
