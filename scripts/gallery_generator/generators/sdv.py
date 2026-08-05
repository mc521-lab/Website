"""星露谷 gallery 生成器（种子/工具/作物）。"""

from __future__ import annotations

import logging
import re
from pathlib import Path
from typing import Any

from ..utils import write_yaml_with_merge

logger = logging.getLogger(__name__)

name = "sdv"
help = "从 Lists/ 星露谷文本文件生成 gallery 数据"

EXTENSION_RE = re.compile(r"\.(?:png)$", re.IGNORECASE)
CROP_VARIANT_RE = re.compile(r"^(.+?)\((银星|金星)\)$")

USAGE_SEED = ["种植在种植盆中", "收获后获得对应作物"]
USAGE_TOOL = "辅助种植作物"
USAGE_CROP = "在主城售卖获得金币"

SOURCE = "主城星露谷商人 处购买"
SOURCE_CROP = "种植对应作物后收成获得"


def clean_name(raw: str) -> str:
    return EXTENSION_RE.sub("", raw.strip()).strip()


def load_names(path: Path) -> list[str]:
    with path.open("r", encoding="utf-8") as f:
        return [clean_name(ln) for ln in f if ln.strip()]


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
        write_yaml_with_merge(dst_dir / f"{count + 1:03d}.yml", content)
        count += 1
    return count


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
        write_yaml_with_merge(dst_dir / f"{count + 1:03d}.yml", content)
        count += 1
    return count


def generate_crop(src_dir: Path, dst_dir: Path) -> int:
    raw_names = load_names(src_dir / "sdv-crop.txt")
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
        write_yaml_with_merge(dst_dir / f"{count + 1:03d}.yml", content)
        count += 1
    return count


def run(src: Path, dst: Path) -> int:
    """从 Lists 目录生成 sdv gallery 文件。"""
    total = 0
    total += generate_seed(src, dst / "seed")
    total += generate_tool(src, dst / "tool")
    total += generate_crop(src, dst / "crop")
    return total