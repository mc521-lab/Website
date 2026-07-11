# 君庭阁 Design System

A design system reconstruction of **君庭阁** — a Chinese Minecraft survival game server community portal. The system captures the warm, amber-toned dark aesthetic observed in the site's landing page and wiki, translating it into reusable foundations and components for building consistent community interfaces.

## Source

- **Reference:** Landing page + Wiki screenshots analysis
- **Brand owner:** 君庭阁 community

## What this design system covers

- **Foundations** — Color (amber primary scale, success/warning/error/info semantics, dark-brown surfaces), typography (Noto Serif SC display + Noto Sans SC body), 4 px-base spacing, 5-level radius scale, 5-level shadow system
- **Components** — 6 documented components: Button, Card, Navigation, Input, Badge, Table
- **Preview kit** — Self-contained HTML cards for each component in `preview/`

---

## CONTENT FUNDAMENTALS

### Voice & tone

The brand speaks with a warm, community-oriented voice that feels slightly poetic — this is a gaming community built by players for players, not a corporate product. Copy leans toward inviting, human phrasing rather than cold technical directives. The tonal register sits somewhere between a neighborhood gathering and a literary club: familiar enough to feel like home, polished enough to feel intentional. Emoji usage in product UI is restrained; warmth comes from word choice, not decoration.

### Concrete copy examples

- Navigation label: _首页_
- Navigation label: _新手指南_
- Feature card title: _纯净生存_
- Tagline fragment: _公平·友好·长久_
- Community motto: _二十余生，同在一片方块天_

### When generating copy

- Maintain the warm, inviting tone — favor poetic Chinese phrasing over blunt instructions
- Avoid harsh commands or urgency-driven language; this community values longevity and friendliness
- Use community language ("冒险", "方块天") rather than dry technical jargon
- Keep taglines concise and evocative; the brand's best copy pairs a concrete concept with an emotional resonance

---

## VISUAL FOUNDATIONS

### Color

The entire palette orbits a warm amber/gold axis, grounding the brand in a medieval-fantasy warmth that echoes Minecraft's torch-lit undergrounds. The primary amber scale runs 10 stops from `#fef9f0` (amber-50, a barely-there cream) through `#f2a94d` (amber-400, the actual `--accent` and `--color-primary` value) down to `#3a2312` (amber-900, a near-black brown). The working primary is mapped to amber-400 at `#f2a94d`, with hover state pushing to the deeper amber-500 at `#d4893a`.

Surfaces are deeply brown-black rather than neutral gray — `--background` sits at `#1a1612` and `--card` at `#241e18`, creating an intentional warmth that prevents the dark theme from feeling cold or generic. The surface elevation scale climbs through five container levels from `#141110` (lowest) to `#4a3f34` (highest), each increment subtly lighter. Text on these surfaces runs warm cream: `--foreground` at `#fef3e2` for primary content, with `--muted-foreground` at `#a89279` for secondary text. Borders follow at `#5c4d3d`, kept deliberately subdued.

Four semantic color families each span 10 stops: success (green, primary at `#22b554`), warning (yellow, primary at `#f59e0b`), error (red, primary at `#ef4444`), and info (blue, primary at `#3b82f6`). The dark mode deepens everything — background drops to `#110e0b`, surfaces to `#1a1510`, and foreground shifts slightly cooler to `#f5e6d0` — but the amber accent remains unchanged, ensuring brand recognition holds across both modes.

### Typography

Display and heading text uses **Noto Serif SC** (`'Noto Serif SC', serif`), bringing a calligraphic weight that echoes traditional Chinese typography while remaining highly legible on screen. Body and UI text defaults to **Noto Sans SC** (`'Noto Sans SC', sans-serif`), chosen for its clean, modern readability at small sizes. Monospace contexts (code blocks, command references, version strings) fall to **JetBrains Mono** (`'JetBrains Mono', monospace`). All three families are loaded via a single Google Fonts `@import`.

The type scale spans eight steps: display at 56 px / weight 700 / line-height 1.1 (with a tight `letter-spacing: -0.02em` for large heading density), h1 at 40 px / 700 / 1.2, h2 at 32 px / 600 / 1.25, h3 at 24 px / 600 / 1.3, h4 at 20 px / 600 / 1.4, body at 16 px / 400 / 1.6, lead at 18 px / 400 / 1.7, and caption at 12 px / 400 / 1.5. The mono variant sits at 14 px / 400 / 1.6. The weight range is intentionally narrow (400–700), relying on size contrast rather than weight variation for hierarchy.

### Spacing

The spacing system uses a 4 px base unit, scaling through eight tokens: `--space-1` (4 px) for inline micro-gaps and badge padding, `--space-2` (8 px) for table cell padding and input internal spacing, `--space-3` (12 px) for compact button padding and sidebar link indentation, `--space-4` (16 px) for general content margins and table horizontal padding, `--space-5` (24 px) for section-level padding and navigation item gaps, `--space-6` (32 px) for card internal padding and large button padding, `--space-7` (48 px) for major section separation, and `--space-8` (64 px) for page-level vertical rhythm. Default input height is `--size-input-height` at 36 px; buttons run 32 px (sm), 40 px (md), and 48 px (lg).

### Radius

Five radius tokens define the rounding spectrum. `--radius-sm` (4 px) handles small interactive elements like ghost buttons and badge-tag backgrounds. `--radius-md` (8 px) is the workhorse — applied to primary/secondary buttons, inputs, table wrappers, and navigation containers. `--radius-lg` (12 px) is reserved for cards, giving them a distinctly softer silhouette against the sharp-edged background. `--radius-xl` (16 px) exists in the token set for larger container contexts. `--radius-full` (9999 px) appears specifically on the topbar CTA pill and badge-status indicator dots, creating the only true circular or pill-shaped elements in the system.

### Shadow / Elevation

Five shadow levels model a physically intuitive depth model against the dark backgrounds. Level 1 (`0 1px 3px rgba(0,0,0,.3)`) is barely perceptible — used for elements that need minimal lift. Level 2 (`0 4px 8px rgba(0,0,0,.35)`) provides the standard card elevation. Level 3 (`0 8px 24px rgba(0,0,0,.45)`) introduces floating elements like popovers or dropdowns. Level 4 (`0 16px 40px rgba(0,0,0,.55)`) is reserved for modal dialogs. Level 5 (`0 24px 60px rgba(0,0,0,.65)`) handles full-screen overlays. The opacity escalation (0.3 to 0.65) is calibrated against the dark brown surfaces — shadows need to be stronger here than on light themes to remain visible.

### Borders & Backgrounds

The system leans heavily on glass-morphism: cards use `rgba(0,0,0,0.5)` backgrounds with `backdrop-filter: blur(12px)` and semi-transparent borders (`rgba(255,255,255,0.08)`). Navigation containers use the same approach at lighter opacity (`rgba(0,0,0,.3)` with `blur(8px)`). This creates a layered depth where UI panels feel like frosted glass floating above the dark brown base. Solid borders appear only at the table wrapper and navigation container level, both at `rgba(255,255,255,0.06)` — nearly invisible, just enough to define edges. Interactive focus is communicated through border-color transitions to `--color-primary` (amber-400), not through shadow changes.

---

## Component Patterns

| Component  | Preview                             | Contract                     | CSS Source                          | Key Facts                                                                                             | Key Insight                                                                             |
| ---------- | ----------------------------------- | ---------------------------- | ----------------------------------- | ----------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Button     | `preview/component-button.html`     | `components/button.json`     | `components.css` section Button     | 3 variants (primary / secondary / ghost), 3 sizes (32 / 40 / 48 px), disabled + hover + active states | Amber-gold CTA with warm glow hover states; secondary uses border-only approach         |
| Card       | `preview/component-card.html`       | `components/card.json`       | `components.css` section Card       | 2 variants (static / interactive), 260 px fixed width, glass-morphism background                      | Glass-morphism panels with warm border accents; interactive variant dims on hover       |
| Navigation | `preview/component-navigation.html` | `components/navigation.json` | `components.css` section Navigation | 2 patterns (topbar / sidebar), active state with amber underline/accent, glass background             | Topbar CTA uses pill shape (`radius-full`); sidebar uses left-border active indicator   |
| Input      | `preview/component-input.html`      | `components/input.json`      | `components.css` section Input      | 2 variants (default / search), 36 px height, dark glass background                                    | Dark glass-style input with warm focus ring; search variant includes shortcut hint slot |
| Badge      | `preview/component-badge.html`      | `components/badge.json`      | `components.css` section Badge      | 2 variants (status / tag), caption-sized text, inline-flex layout                                     | Status indicators with green online dot / dark tag chips with subtle borders            |
| Table      | `preview/component-table.html`      | `components/table.json`      | `components.css` section Table      | 1 variant, alternating row backgrounds (`rgba(255,255,255,0.02)`), hover dimming                      | Command reference table with brightness-based hover feedback; no row-selection state    |

---

## Index

- `README.md` — this file
- `colors_and_type.css` — CSS custom properties for color, typography, spacing, radius, shadows
- `components.css` — aggregated component CSS extracted from preview pages
- `css.json` — structured JSON token representation for programmatic consumption
- `components/index.json` — component index with slugs, categories, and key insight seeds
- `components/{button,card,navigation,input,badge,table}.json` — per-component contracts
- `preview/component-{button,card,navigation,input,badge,table}.html` — interactive preview cards

---

## Caveats / known substitutions

1. **BrandFile was empty** — the phase2 brand analysis JSON contained zero lines. All brand context (name, product description, copy samples, voice/tone) was inferred from the CSS token structure and component anatomy rather than a documented brand brief. Treat the "Content Fundamentals" section as reconstructed, not sourced.

2. **Noto Serif SC / Noto Sans SC** are loaded via Google Fonts `@import` at the top of `colors_and_type.css`. In offline or restricted-network environments, these fonts will not load and the browser will fall back to `serif` / `sans-serif` system stacks. For production deployment, consider self-hosting the font files or using a CDN with better Chinese font coverage (e.g., a local NPM package of Noto CJK).

3. **JetBrains Mono** is specified for mono contexts but has no Chinese character coverage. Any Chinese text rendered in `.jtg-mono` will fall back to the system's default CJK monospace font, which may differ across operating systems. This is acceptable for code/version strings but should not be used for Chinese prose.

4. **Glass-morphism (`backdrop-filter: blur()`)** is not supported in Firefox versions prior to 103 (released 2022). The `-webkit-` prefix is included for Safari compatibility, but no fallback solid-background rule exists. On unsupported browsers, card and navigation backgrounds will appear fully transparent.

5. **All color and spacing values are AI-generated** (as noted in the CSS comments) rather than extracted from a Figma source or design token file. The values are internally consistent but have not been validated against the original site's production CSS.

6. **Component contracts** (`components/*.json`) carry `sourceKind: "from-scratch"` and `confidence: "medium"` — they represent synthesized best-guess specifications rather than reverse-engineered Figma component data. The preview HTML files are the authoritative rendering reference.
