---
name: "mc521-wiki-skill"
description: "Creates and refines MC521 Wiki content with the site's house style. Invoke when writing, summarizing, or editing wiki pages for this project."
---

# MC521 Wiki Skill

Use this skill when working on MC521 Wiki content under `content/wiki/_pages/`.

## Purpose

This skill helps create, summarize, rewrite, and standardize wiki pages so they stay direct, simple, and useful for players.

## When to Invoke

Invoke this skill when the user asks to:

- summarize the style of existing wiki pages
- write new wiki pages for MC521
- rewrite or polish wiki copy
- align content with the site's established tone, structure, and formatting

## Writing Template

Use this order when writing or rewriting a wiki page:

1. `开头一句话`：先说这个功能是干什么的，再说它能解决什么问题
2. `前情提要`：先把最容易误解的规则、前提和限制说明白
3. `怎么做`：按步骤写清楚操作流程，优先写玩家实际会点、会输、会选的内容
4. `补充说明`：放表格、截图说明、常见选项、对比信息和注意事项
5. `收尾一句话`：只留一个短结论，不要长总结

Favor the old beginner-page organization:

- Start with purpose, then move to steps
- Use small sections that answer one question each
- Keep the page close to a guide or checklist, not an overview article
- Put important restrictions near the top
- Use `##` for main blocks and `###` only when a step needs a sub-block
- Prefer bullets, short paragraphs, tables, and direct procedural wording

## Must Use

- Direct facts
- Concrete steps
- Simple labels like `怎么做`, `注意`, `建议`, `用途`, `区别`
- Section titles that match user intent, such as `作用`, `绑定教程`, `如何圈地`, `温馨提示`
- Tables for comparisons, rankings, costs, and system overviews
- Lists for rules, steps, and quick reminders
- Images or videos when the content depends on visual operation

## Do Not Use

- Long 铺垫
- Official or polished phrasing
- Abstract explanations
- Marketing language
- Overly poetic wording
- Tutorial-style废话
- Repeated transition words
- Any detail that does not help the player
- Broad summary endings that restate the whole page

## Editing Rules

- Preserve factual accuracy and game terminology
- Keep the structure balanced and readable
- Match the older beginner pages when the content is clearly instructional
- Keep the page action-oriented when the topic is about binding, claiming, creating, or configuring something
- Do not add unnecessary comments inside generated content

## Output Expectations

When asked to help with wiki content, produce text that can be pasted directly into an `.mdx` file and reads like a practical player guide.
