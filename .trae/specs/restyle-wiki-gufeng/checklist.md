- [x] Starlight 组件覆盖目录 (`src/components/starlight/`) 已创建

- [x] `astro.config.mjs` 已正确配置 Starlight `components` 覆盖路径

- [x] Header 导航栏使用古风卡片背景、楷体字体、朱砂红高亮（通过 CSS 覆盖 `.page .header`）

- [x] Sidebar 侧边栏使用宣纸背景、宋体目录项、朱砂红激活态（通过 CSS 覆盖 `.sidebar-content`）

- [x] 移动端侧边栏抽屉（MobileMenuToggle）应用古风样式（组件覆盖 + CSS 覆盖）

- [x] MarkdownContent 正文优化中文排版（行高 1.75，通过 CSS 覆盖 `.sl-markdown-content`）

- [x] h1/h2 标题底部有渐变装饰线（通过 CSS `h2::after` 伪元素实现）

- [x] blockquote 使用左侧朱砂红边框（通过 CSS 覆盖 `.sl-markdown-content blockquote`）

- [x] 表格使用古风边框风格（通过 CSS 覆盖 `.sl-markdown-content table`）

- [x] 代码块使用圆角和深色/亮色背景适配（Expressive Code 覆盖 + `pre` 样式覆盖）

- [x] TableOfContents 使用半透明卡片背景、朱砂红当前项高亮（通过 CSS 覆盖 `.right-sidebar-panel` 和 `starlight-toc`）

- [x] Pagination 使用 `gufeng-card` 风格（组件覆盖 `Pagination.astro`）

- [x] `global.css` 补充了 Wiki 页面特有的 `.sl-*` 覆盖样式

- [x] 暗色模式下所有古风元素正确切换至深墨色系（`[data-theme='dark']` 与 `.dark` 同时支持）

- [x] 移动端响应式布局正常（Starlight 原生响应式保留）

- [x] 可访问性达标（对比度满足 WCAG AA、焦点状态可见、键盘导航正常）
