"""皮肤 gallery 生成器（时装/武器皮肤/工具皮肤）。"""

from __future__ import annotations

import logging
import re
from pathlib import Path
from typing import Any

from ..utils import write_yaml_with_merge

logger = logging.getLogger(__name__)

name = "skin"
help = "从 Lists/ 皮肤相关文本文件生成 gallery 数据"

EXTENSION_RE = re.compile(r"\.(?:gif|png)$", re.IGNORECASE)
MINIMESSAGE_RE = re.compile(r"<[^>]+>")

USAGE = "在主城更换物品皮肤"

SOURCE_WEAPON = "主城武器皮肤抽奖箱"
SOURCE_TOOLS = "主城工具皮肤抽奖箱"
SOURCE_TOOLS_EXCHANGE = "集齐对应工具后兑换"

COSMETIC_SOURCE_LABELS: dict[str, str] = {
    "1": "主城时装抽奖箱 第一期",
    "2": "主城时装抽奖箱 第二期",
    "3": "主城时装抽奖箱 第三期",
}


def clean_name(raw: str) -> str:
    return EXTENSION_RE.sub("", raw.strip()).strip()


def load_names(path: Path) -> set[str]:
    with path.open("r", encoding="utf-8") as f:
        return {clean_name(ln) for ln in f if ln.strip()}


def strip_minimessage(text: str) -> str:
    """移除 MiniMessage 标签（如 <gradient:...>、<#RRGGBB> 等）。"""
    return MINIMESSAGE_RE.sub("", text).strip()


def load_consumable_required_classes(consumable_path: Path) -> dict[str, list[str]]:
    """从 consumable.yml 加载字典：clean base.name -> required-class 列表。"""
    import yaml

    if not consumable_path.is_file():
        logger.warning("consumable.yml 不存在: %s", consumable_path)
        return {}
    with consumable_path.open("r", encoding="utf-8") as f:
        data = yaml.safe_load(f)
    if not isinstance(data, dict):
        return {}
    result: dict[str, list[str]] = {}
    for key, item in data.items():
        if not isinstance(item, dict):
            continue
        base = item.get("base")
        if not isinstance(base, dict):
            continue
        raw_name = base.get("name")
        if not isinstance(raw_name, str):
            continue
        clean = strip_minimessage(raw_name)
        if not clean:
            continue
        required = base.get("required-class")
        if not isinstance(required, list) or not required:
            continue
        if isinstance(required, list) and required:
            result[clean] = required
    return result


def build_cosmetic_source_map(src_dir: Path) -> dict[str, list[str]]:
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
    return {k: sorted(v) for k, v in result.items()}


def generate_cosmetic(src_dir: Path, dst_dir: Path) -> int:
    head_path = src_dir / "cosmetics-head.txt"
    back_path = src_dir / "cosmetics-back.txt"
    head_names = load_names(head_path)
    back_names = load_names(back_path)
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
        write_yaml_with_merge(dst_dir / f"{(count+1):03d}.yml", content)
        count += 1
    return count


def generate_weapon(src_dir: Path, dst_dir: Path, consumable_path: Path | None = None) -> int:
    names = load_names(src_dir / "weapon.txt")
    dst_dir.mkdir(parents=True, exist_ok=True)

    if consumable_path is None:
        consumable_path = src_dir.parent / "MMOItems" / "item" / "consumable.yml"
    required_class_map = load_consumable_required_classes(consumable_path)

    count = 0
    for name in sorted(names):
        content: dict[str, Any] = {
            "basic": {"name": name},
            "usage": [USAGE],
            "source": [SOURCE_WEAPON],
            "filter": {"type": "weapon"},
        }
        required = required_class_map.get(name)
        if required:
            content["limit"] = [
                f"仅限 {" / ".join(required)} 职业可用",
            ]
        write_yaml_with_merge(dst_dir / f"{count + 1:03d}.yml", content)
        count += 1
    return count


def generate_tools(src_dir: Path, dst_dir: Path) -> int:
    lottery_names = load_names(src_dir / "tools.txt")
    exchange_names = load_names(src_dir / "tools-exchange.txt")
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
        write_yaml_with_merge(dst_dir / f"{count + 1:03d}.yml", content)
        count += 1
    return count


def run(src: Path, dst: Path, consumable_path: Path | None = None) -> int:
    """从 Lists 目录生成 skin gallery 文件。"""
    total = 0
    total += generate_cosmetic(src, dst / "cosmetic")
    total += generate_weapon(src, dst / "weapon", consumable_path)
    total += generate_tools(src, dst / "tools")
    return total