# Tasks

- [x] Task 1: 创建 Starlight 组件覆盖目录结构和基础配置
    - [x] SubTask 1.1: 在 `src/components/starlight/` 下创建组件覆盖目录
    - [x] SubTask 1.2: 在 `astro.config.mjs` 中配置 Starlight `components` 指向自定义组件路径
    - [x] SubTask 1.3: 验证 Starlight 自定义组件覆盖机制生效
- [x] Task 2: 覆盖 Starlight 顶部导航栏（Header）
    - [x] SubTask 2.1: 通过 CSS 覆盖 `.header` 应用古风卡片背景、楷体标题、朱砂红高亮、backdrop-blur
    - [x] SubTask 2.2: 确保暗色模式切换按钮与主页风格一致（覆盖 ThemeSelect 为圆形按钮）
- [x] Task 3: 覆盖 Starlight 左侧侧边栏（Sidebar / SidebarPersister / TwoColumnContent 相关）
    - [x] SubTask 3.1: 通过 CSS 覆盖侧边栏样式，应用宣纸背景、宋体目录、朱砂红激活态
    - [x] SubTask 3.2: 侧边栏分组标题使用楷体字体
    - [x] SubTask 3.3: 覆盖 MobileMenuToggle 组件应用古风样式
- [x] Task 4: 覆盖 Starlight 内容区域（MarkdownContent / ArticleTitle / PageTitle 等）
    - [x] SubTask 4.1: 通过 CSS 覆盖 `.sl-markdown-content` 应用正文排版优化（行高 1.75、中文间距）
    - [x] SubTask 4.2: 为 h1/h2 标题添加底部渐变装饰线
    - [x] SubTask 4.3: 为 blockquote 添加左侧朱砂红边框
    - [x] SubTask 4.4: 为表格添加古风边框风格
    - [x] SubTask 4.5: 为代码块添加圆角和深色/亮色背景适配
- [x] Task 5: 覆盖 Starlight 右侧 TOC（TableOfContents / TableOfContentsList）
    - [x] SubTask 5.1: 通过 CSS 覆盖 TOC 容器样式
    - [x] SubTask 5.2: 当前阅读项使用朱砂红高亮
- [x] Task 6: 覆盖 Starlight 分页导航（Pagination / PrevNextLinks）
    - [x] SubTask 6.1: 创建 `Pagination.astro`，应用 `gufeng-card` 风格
- [x] Task 7: 补充全局 CSS 覆盖与暗色模式适配
    - [x] SubTask 7.1: 在 `global.css` 中补充 Wiki 页面特有的 `.sl-*` 选择器覆盖（如 Starlight 内部类名）
    - [x] SubTask 7.2: 验证所有古风覆盖在暗色模式（`[data-theme='dark']`）下正确表现
- [x] Task 8: 最终验证与修复
    - [x] SubTask 8.1: 运行 `nr dev` 预览 Wiki 页面，检查视觉一致性
    - [x] SubTask 8.2: 检查移动端响应式表现（Starlight 原生响应式 + 自定义 CSS 兼容）
    - [x] SubTask 8.3: 检查可访问性（对比度满足 WCAG AA、焦点状态可见、键盘导航正常）

# Task Dependencies

- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 1]
- [Task 4] depends on [Task 1]
- [Task 5] depends on [Task 1]
- [Task 6] depends on [Task 1]
- [Task 7] can run in parallel with Tasks 2-6
- [Task 8] depends on all other tasks
