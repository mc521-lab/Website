#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
一键脚本：从 raw-config/Lists/ 加载皮肤相关数据，
生成 gallery 所需格式，并写入 content/gallery/_data/skin/{类型}/{key}.yml

类型：
  - cosmetic → cosmetics-{head,back,1,2,3}.txt
  - weapon   → weapon.txt
  - tools    → tools.txt + tools-exchange.txt
"""

from __future__ import annotations

import logging
import re
import sys
from pathlib import Path
from typing import Any

import yaml

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# 常量
# ---------------------------------------------------------------------------

EXTENSION_RE = re.compile(r"\.(?:gif|png)$", re.IGNORECASE)

USAGE = "在主城更换物品皮肤"

SOURCE_WEAPON = "主城 > 武器皮肤抽奖箱 抽奖"
SOURCE_TOOLS = "主城 > 工具皮肤抽奖箱 抽奖"
SOURCE_TOOLS_EXCHANGE = "集齐对应工具后兑换"

COSMETIC_SOURCE_LABELS: dict[str, str] = {
    "1": "主城 > 时装抽奖箱 第一期 抽奖",
    "2": "主城 > 时装抽奖箱 第二期 抽奖",
    "3": "主城 > 时装抽奖箱 第三期 抽奖",
}


def clean_name(raw: str) -> str:
    """去掉扩展名及首尾空白。"""
    return EXTENSION_RE.sub("", raw.strip()).strip()


def slugify(name: str) -> str:
    """将中文名转为文件系统安全的 key。"""
    s = re.sub(r"[^\w\u4e00-\u9fff]", "_", name)
    s = re.sub(r"_+", "_", s).strip("_")
    return s.lower()


def load_names(path: Path) -> set[str]:
    """加载文本文件中的名称到 set（已清洗）。"""
    with path.open("r", encoding="utf-8") as f:
        return {clean_name(ln) for ln in f if ln.strip()}


# ---------------------------------------------------------------------------
# 时装
# ---------------------------------------------------------------------------

def build_cosmetic_source_map(src_dir: Path) -> dict[str, list[str]]:
    """从 cosmetics-{1,2,3}.txt 构建 {名称: [source标签]}。"""
    result: dict[str, set[str]] = {}
    for period, label in COSMETIC_SOURCE_LABELS.items():
        path = src_dir / f"cosmetics-{period}.txt"
        if not path.is_file():
            continue
        with path.open("r", encoding="utf-8") as f:
            for ln in f:
                n = clean_name(ln)
                if n:
                    result.setdefault(n, set()).add(label)
    return {k: list(v) for k, v in result.items()}


def generate_cosmetic(src_dir: Path, dst_dir: Path) -> int:
    """生成时装皮肤。"""
    head_path = src_dir / "cosmetics-head.txt"
    back_path = src_dir / "cosmetics-back.txt"

    head_names = load_names(head_path)
    back_names = load_names(back_path)

    # 确定类型
    item_types: dict[str, str] = {}
    for n in head_names:
        item_types[n] = "back" if n in back_names else "head"

    source_map = build_cosmetic_source_map(src_dir)

    dst_dir.mkdir(parents=True, exist_ok=True)
    count = 0

    for name, typ in sorted(item_types.items(), key=lambda x: x[0]):
        content: dict[str, Any] = {
            "basic": {"name": name, "type": typ},
            "usage": [USAGE],
            "source": source_map.get(name, []),
        }
        out_path = dst_dir / f"{(count+1):03d}.yml"
        with out_path.open("w", encoding="utf-8") as f:
            yaml.dump(content, f, allow_unicode=True, default_flow_style=False, sort_keys=False, width=120)
        logger.info("已写入: %s", out_path.relative_to(dst_dir.parent.parent))
        count += 1

    return count


# ---------------------------------------------------------------------------
# 武器皮肤
# ---------------------------------------------------------------------------

def generate_weapon(src_dir: Path, dst_dir: Path) -> int:
    """生成武器皮肤。"""
    path = src_dir / "weapon.txt"
    names = load_names(path)

    dst_dir.mkdir(parents=True, exist_ok=True)
    count = 0

    for name in sorted(names):
        content: dict[str, Any] = {
            "basic": {"name": name, "type": "weapon"},
            "usage": [USAGE],
            "source": [SOURCE_WEAPON],
        }
        out_path = dst_dir / f"{count + 1:03d}.yml"
        with out_path.open("w", encoding="utf-8") as f:
            yaml.dump(content, f, allow_unicode=True, default_flow_style=False, sort_keys=False, width=120)
        logger.info("已写入: %s", out_path.relative_to(dst_dir.parent.parent))
        count += 1

    return count


# ---------------------------------------------------------------------------
# 工具皮肤
# ---------------------------------------------------------------------------

def generate_tools(src_dir: Path, dst_dir: Path) -> int:
    """生成工具皮肤（含抽奖 + 兑换）。"""
    # 抽奖箱
    lottery_path = src_dir / "tools.txt"
    lottery_names = load_names(lottery_path)

    # 兑换
    exchange_path = src_dir / "tools-exchange.txt"
    exchange_names = load_names(exchange_path)

    # 合并，相同名称的取抽奖箱 source（一般不会重复）
    all_names = lottery_names | exchange_names

    dst_dir.mkdir(parents=True, exist_ok=True)
    count = 0

    for name in sorted(all_names):
        sources: list[str] = []
        if name in lottery_names:
            sources.append(SOURCE_TOOLS)
        if name in exchange_names:
            sources.append(SOURCE_TOOLS_EXCHANGE)

        content: dict[str, Any] = {
            "basic": {"name": name, "type": "tools"},
            "usage": [USAGE],
            "source": sources,
        }
        out_path = dst_dir / f"{count + 1:03d}.yml"
        with out_path.open("w", encoding="utf-8") as f:
            yaml.dump(content, f, allow_unicode=True, default_flow_style=False, sort_keys=False, width=120)
        logger.info("已写入: %s", out_path.relative_to(dst_dir.parent.parent))
        count += 1

    return count


# ---------------------------------------------------------------------------
# 主入口
# ---------------------------------------------------------------------------

def main() -> None:
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s [%(levelname)s] %(message)s",
        datefmt="%H:%M:%S",
    )

    project_root = Path(__file__).resolve().parent.parent
    lists_dir = project_root / "raw-config" / "Lists"
    dst_root = project_root / "content" / "gallery" / "_data" / "skin"

    logger.info("Lists 目录: %s", lists_dir)
    logger.info("目标根目录: %s", dst_root)

    total = 0

    # 时装
    n = generate_cosmetic(lists_dir, dst_root / "cosmetic")
    logger.info("时装皮肤: %d 个", n)
    total += n

    # 武器皮肤
    n = generate_weapon(lists_dir, dst_root / "weapon")
    logger.info("武器皮肤: %d 个", n)
    total += n

    # 工具皮肤
    n = generate_tools(lists_dir, dst_root / "tools")
    logger.info("工具皮肤: %d 个", n)
    total += n

    print(f"\n完成：成功生成 {total} 个皮肤文件 → {dst_root}")


if __name__ == "__main__":
    main()