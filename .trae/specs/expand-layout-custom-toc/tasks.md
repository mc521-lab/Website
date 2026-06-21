# Tasks

- [x] Task 1: 覆盖 TwoColumnContent 组件使正文撑满
    - [x] SubTask 1.1: 创建 `src/components/starlight/TwoColumnContent.astro`
    - [x] SubTask 1.2: 修改 `main-pane` 宽度计算，移除 45rem 上限，使其自适应填充
    - [x] SubTask 1.3: 修改 `right-sidebar-container` 宽度计算，确保与主内容区比例合理

- [x] Task 2: 创建可收起的自定义 PageSidebar / TOC
    - [x] SubTask 2.1: 创建 `src/components/starlight/PageSidebar.astro`
    - [x] SubTask 2.2: 在 TOC 面板顶部添加折叠/展开按钮（内联 SVG 图标）
    - [x] SubTask 2.3: 实现 CSS 侧滑动画（transform + transition，200ms ease-out）
    - [x] SubTask 2.4: 实现原生 JS 状态管理（localStorage 读写 + 初始化）
    - [x] SubTask 2.5: 处理展开/收起时主内容区的平滑宽度过渡

- [x] Task 3: 注册组件覆盖并补充样式
    - [x] SubTask 3.1: 在 `astro.config.mjs` 的 `starlight.components` 中注册 `TwoColumnContent` 和 `PageSidebar`
    - [x] SubTask 3.2: 在 `src/styles/global.css` 中清理冲突样式并添加过渡样式

- [x] Task 4: 验证与测试
    - [x] SubTask 4.1: 运行 `nr dev`，在桌面端（≥72rem）验证 TOC 可正常折叠/展开
    - [x] SubTask 4.2: 验证 localStorage 状态持久化
    - [x] SubTask 4.3: 验证正文内容确实撑满剩余宽度
    - [x] SubTask 4.4: 验证移动端 TOC 行为未被破坏
    - [x] SubTask 4.5: 运行 `npx astro check` 确认无类型错误

# Task Dependencies

- Task 1 与 Task 2 可并行
- Task 3 依赖 Task 1 和 Task 2
- Task 4 依赖 Task 3
