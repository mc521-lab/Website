---
name: mc521-design
description: Use this skill to generate well-branded interfaces for 君庭阁. Contains colors, type, fonts, assets, and UI kit for prototyping website UIs.
user-invocable: true
---

# 君庭阁 Design Skill

Read the `README.md` file within this skill, and explore the other available files.

If creating visual artifacts, copy assets out and create static HTML files. If working on production code, read the rules here to become an expert in designing with this brand.

## Quick map

- `README.md` — brand context, content fundamentals, visual foundations (read first)
- `colors_and_type.css` — drop-in CSS variables for colors, type, radius, shadow, spacing
- `css.json` — structured token understanding source
- `components.css` — aggregated component CSS
- `library-consumption.json` — recommended downstream read order
- `preview/` — small HTML cards illustrating foundations and components
- `ui_kits/website/` — full click-thru recreation
- `components/index.json` — component index + cross-component patterns

## Essentials at a glance

- Brand primary amber `#d4893a` with accent `#f2a94d` — warm, immersive Chinese game-community aesthetic on dark brown-black `#1a1612` background.
- Radius 4/8/12/16/9999px — small controls, rounded cards/panels, pill-shaped topbar CTA buttons.
- 40px default button height (sm 32 / lg 48), 36px input height, 4px spacing base unit, 8-pt grid.
- Type: Noto Serif SC (display & headings); Noto Sans SC (body & UI); JetBrains Mono (code).
- Voice: CN-first, warm community tone, poetic phrasing, no emoji in UI.
- Shadows: 5 levels from subtle border-adjacent (`0 1px 3px .3`) to 24px deep overlay (`.65`), all black-based.
- Glass-morphism first-class: `rgba(0,0,0,0.5)` panels with `backdrop-filter: blur(12px)` and `rgba(255,255,255,0.08)` borders.
- Text on dark: foreground `#fef3e2`, muted `#a89279`, borders `#5c4d3d` — warm parchment palette.

## Components

| Slug       | Name       | Key Insight                                                  |
| ---------- | ---------- | ------------------------------------------------------------ |
| button     | Button     | Amber-gold CTA with warm glow hover states                   |
| card       | Card       | Glass-morphism panels with warm border accents               |
| navigation | Navigation | Centered nav with icon+text items and active amber underline |
| input      | Input      | Dark glass-style input with warm focus ring                  |
| badge      | Badge      | Status indicators with green online / blue version tags      |
| table      | Table      | Command reference table with alternating row backgrounds     |
