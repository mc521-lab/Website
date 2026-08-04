#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
一键脚本：从 raw-config/Lists/ 加载装饰类数据，
生成 gallery 所需格式，并写入 content/gallery/_data/deco/{类型}/{key}.yml

类型：
  - furniture  → furniture-{1,2,3}.txt（数字决定来源期数）
  - wallsticker → wallsticker.txt
  - doll        → doll.txt
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

USAGE = "摆放在建筑中做装饰"

FURNITURE_SOURCE_LABELS: dict[str, str] = {
    "1": "主城 > 家具抽奖箱 第一期 抽奖",
    "2": "主城 > 家具抽奖箱 第二期 抽奖",
    "3": "主城 > 家具抽奖箱 第三期 抽奖",
}

SOURCE_WALLSTICKER = "主城 > 墙贴抽奖箱 抽奖"
SOURCE_DOLL = "主城 > 玩偶抽奖箱 抽奖"


def clean_name(raw: str) -> str:
    """去掉扩展名及首尾空白。"""
    return EXTENSION_RE.sub("", raw.strip()).strip()


def slugify(name: str) -> str:
    s = re.sub(r"[^\w\u4e00-\u9fff]", "_", name)
    s = re.sub(r"_+", "_", s).strip("_")
    return s.lower()


def load_names(path: Path) -> set[str]:
    with path.open("r", encoding="utf-8") as f:
        return {clean_name(ln) for ln in f if ln.strip()}


# ---------------------------------------------------------------------------
# 家具
# ---------------------------------------------------------------------------

def generate_furniture(src_dir: Path, dst_dir: Path) -> int:
    """从 furniture-{1,2,3}.txt 生成家具数据。"""
    source_map: dict[str, set[str]] = {}

    for period, label in FURNITURE_SOURCE_LABELS.items():
        path = src_dir / f"furniture-{period}.txt"
        if not path.is_file():
            continue
        with path.open("r", encoding="utf-8") as f:
            for ln in f:
                n = clean_name(ln)
                if n:
                    source_map.setdefault(n, set()).add(label)

    dst_dir.mkdir(parents=True, exist_ok=True)
    count = 0

    for name in sorted(source_map):
        content: dict[str, Any] = {
            "basic": {"name": name, "type": "furniture"},
            "usage": [USAGE],
            "source": sorted(source_map[name]),
        }
        out_path = dst_dir / f"{(count+1):03d}.yml"
        with out_path.open("w", encoding="utf-8") as f:
            yaml.dump(content, f, allow_unicode=True, default_flow_style=False, sort_keys=False, width=120)
        logger.info("已写入: %s", out_path.relative_to(dst_dir.parent.parent))
        count += 1

    return count


# ---------------------------------------------------------------------------
# 墙贴
# ---------------------------------------------------------------------------

def generate_wallsticker(src_dir: Path, dst_dir: Path) -> int:
    path = src_dir / "wallsticker.txt"
    names = load_names(path)

    dst_dir.mkdir(parents=True, exist_ok=True)
    count = 0

    for name in sorted(names):
        content: dict[str, Any] = {
            "basic": {"name": name, "type": "wallsticker"},
            "usage": [USAGE],
            "source": [SOURCE_WALLSTICKER],
        }
        out_path = dst_dir / f"{count + 1:03d}.yml"
        with out_path.open("w", encoding="utf-8") as f:
            yaml.dump(content, f, allow_unicode=True, default_flow_style=False, sort_keys=False, width=120)
        logger.info("已写入: %s", out_path.relative_to(dst_dir.parent.parent))
        count += 1

    return count


# ---------------------------------------------------------------------------
# 玩偶
# ---------------------------------------------------------------------------

def generate_doll(src_dir: Path, dst_dir: Path) -> int:
    path = src_dir / "doll.txt"
    names = load_names(path)

    dst_dir.mkdir(parents=True, exist_ok=True)
    count = 0

    for name in sorted(names):
        content: dict[str, Any] = {
            "basic": {"name": name, "type": "doll"},
            "usage": [USAGE],
            "source": [SOURCE_DOLL],
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
    dst_root = project_root / "content" / "gallery" / "_data" / "deco"

    logger.info("Lists 目录: %s", lists_dir)
    logger.info("目标根目录: %s", dst_root)

    total = 0

    n = generate_furniture(lists_dir, dst_root / "furniture")
    logger.info("家具: %d 个", n)
    total += n

    n = generate_wallsticker(lists_dir, dst_root / "wallsticker")
    logger.info("墙贴: %d 个", n)
    total += n

    n = generate_doll(lists_dir, dst_root / "doll")
    logger.info("玩偶: %d 个", n)
    total += n

    print(f"\n完成：成功生成 {total} 个装饰文件 → {dst_root}")


if __name__ == "__main__":
    main()