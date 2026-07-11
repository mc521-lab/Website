import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  srcDir: 'contents',
  lang: 'zh-CN',

  title: '君庭阁 · 二十余年，同在一片方块天',
  description:
    '君庭阁我的世界服务器 - 二十余年，同在一片方块天。重度 RPG 体验与生存乐趣并存，纯粹公益、优化极致。',

  // 强制深色主题，不显示切换开关
  appearance: 'dark',

  vite: {
    publicDir: '../public'
  },

  themeConfig: {
    // 顶部导航（与首页 Header 保持一致）
    nav: [
      { text: '首页', link: '/' },
      { text: '官网Wiki', link: '/wiki/' },
      { text: '更换皮肤', link: '#' },
      { text: '伤害计算', link: '#' },
      { text: '更新日志', link: '#' }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com' }
    ],

    footer: {
      message: '君庭阁 · 二十余年，同在一片方块天',
      copyright: 'Copyright © 2026 君庭阁'
    }
  }
})
