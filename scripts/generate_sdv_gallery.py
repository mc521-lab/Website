#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
一键脚本：从 raw-config/Lists/ 加载星露谷相关数据，
生成 gallery 所需格式，并写入 content/gallery/_data/sdv/{类型}/{key}.yml

类型：
  - seed  → sdv-seed.txt
  - tool  → sdv-tool.txt
  - crop  → sdv-crop.txt（同种作物合并为一条，含 variants）
"""

from __future__ import annotations

import logging
import re
from pathlib import Path
from typing import Any

import yaml

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# 常量
# ---------------------------------------------------------------------------

EXTENSION_RE = re.compile(r"\.(?:png)$", re.IGNORECASE)
CROP_VARIANT_RE = re.compile(r"^(.+?)\((银星|金星)\)$")

USAGE_SEED = ["种植在种植盆中", "收获后获得对应作物"]
USAGE_TOOL = "辅助种植作物"
USAGE_CROP = "在主城售卖获得金币"

SOURCE = "主城 > 星露谷商人 处购买"
SOURCE_CROP = "种植对应作物后收成获得"


def clean_name(raw: str) -> str:
    return EXTENSION_RE.sub("", raw.strip()).strip()


def load_names(path: Path) -> list[str]:
    with path.open("r", encoding="utf-8") as f:
        return [clean_name(ln) for ln in f if ln.strip()]


# ---------------------------------------------------------------------------
# 种子
# ---------------------------------------------------------------------------

def generate_seed(src_dir: Path, dst_dir: Path) -> int:
    names = load_names(src_dir / "sdv-seed.txt")
    dst_dir.mkdir(parents=True, exist_ok=True)
    count = 0

    for name in sorted(names):
        content: dict[str, Any] = {
            "basic": {"name": name, "type": "seed"},
            "usage": USAGE_SEED,
            "source": [SOURCE],
        }
        out_path = dst_dir / f"{count + 1:03d}.yml"
        with out_path.open("w", encoding="utf-8") as f:
            yaml.dump(content, f, allow_unicode=True, default_flow_style=False, sort_keys=False, width=120)
        count += 1

    return count


# ---------------------------------------------------------------------------
# 工具
# ---------------------------------------------------------------------------

def generate_tool(src_dir: Path, dst_dir: Path) -> int:
    names = load_names(src_dir / "sdv-tool.txt")
    dst_dir.mkdir(parents=True, exist_ok=True)
    count = 0

    for name in sorted(names):
        content: dict[str, Any] = {
            "basic": {"name": name, "type": "tool"},
            "usage": [USAGE_TOOL],
            "source": [SOURCE],
        }
        out_path = dst_dir / f"{count + 1:03d}.yml"
        with out_path.open("w", encoding="utf-8") as f:
            yaml.dump(content, f, allow_unicode=True, default_flow_style=False, sort_keys=False, width=120)
        count += 1

    return count


# ---------------------------------------------------------------------------
# 作物（按基础名分组，含 variants）
# ---------------------------------------------------------------------------

def generate_crop(src_dir: Path, dst_dir: Path) -> int:
    raw_names = load_names(src_dir / "sdv-crop.txt")

    # 分组：{基础名: {variant_name, ...}}
    # 排序：作物, 作物(银星), 作物(金星)
    groups: dict[str, dict[str, str | None]] = {}
    star_order = {"银星": 1, "金星": 2}

    for name in raw_names:
        m = CROP_VARIANT_RE.match(name)
        if m:
            base = m.group(1)
            star = m.group(2)
            groups.setdefault(base, {})[name] = star
        else:
            groups.setdefault(name, {})[name] = None

    dst_dir.mkdir(parents=True, exist_ok=True)
    count = 0

    for base_name in sorted(groups):
        variant_names = list(groups[base_name].keys())

        # 排序：base → (银星) → (金星)
        def sort_key(v: str) -> tuple[int, int]:
            m = CROP_VARIANT_RE.match(v)
            if m:
                return (1, star_order.get(m.group(2), 99))
            return (0, 0)

        variant_names.sort(key=sort_key)

        content: dict[str, Any] = {
            "basic": {"name": base_name, "type": "crop"},
            "usage": [USAGE_CROP],
            "source": [SOURCE_CROP],
            "variants": variant_names,
        }
        out_path = dst_dir / f"{count + 1:03d}.yml"
        with out_path.open("w", encoding="utf-8") as f:
            yaml.dump(content, f, allow_unicode=True, default_flow_style=False, sort_keys=False, width=120)
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
    dst_root = project_root / "content" / "gallery" / "_data" / "sdv"

    logger.info("Lists 目录: %s", lists_dir)
    logger.info("目标根目录: %s", dst_root)

    total = 0

    n = generate_seed(lists_dir, dst_root / "seed")
    logger.info("种子: %d 个", n)
    total += n

    n = generate_tool(lists_dir, dst_root / "tool")
    logger.info("工具: %d 个", n)
    total += n

    n = generate_crop(lists_dir, dst_root / "crop")
    logger.info("作物: %d 个", n)
    total += n

    print(f"\n完成：成功生成 {total} 个星露谷文件 → {dst_root}")


if __name__ == "__main__":
    main()