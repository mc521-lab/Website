"""装饰类 gallery 生成器（家具/墙贴/玩偶）。"""

from __future__ import annotations

import logging
import re
from pathlib import Path
from typing import Any

from ..utils import write_yaml_with_merge

logger = logging.getLogger(__name__)

name = "deco"
help = "从 Lists/ 装饰类文本文件生成 gallery 数据"

EXTENSION_RE = re.compile(r"\.(?:gif|png)$", re.IGNORECASE)
USAGE = "摆放在建筑中做装饰"

FURNITURE_SOURCE_LABELS: dict[str, str] = {
    "1": "主城家具抽奖箱 第一期",
    "2": "主城家具抽奖箱 第二期",
    "3": "主城家具抽奖箱 第三期",
}
SOURCE_WALLSTICKER = "主城墙贴抽奖箱"
SOURCE_DOLL = "主城玩偶抽奖箱"


def clean_name(raw: str) -> str:
    return EXTENSION_RE.sub("", raw.strip()).strip()


def load_names(path: Path) -> set[str]:
    with path.open("r", encoding="utf-8") as f:
        return {clean_name(ln) for ln in f if ln.strip()}


def load_bundle_map(configs_dir: Path) -> dict[str, str]:
    """从 configs 目录加载 display_name -> namespace 映射。

    遍历每个子文件夹（如 v1-gufeng），读取 {name}.yml，提取 info.namespace
    和 items 下所有条目的 display_name，构建映射。
    """
    import yaml
    import re

    result: dict[str, str] = {}
    if not configs_dir.is_dir():
        logger.warning("configs 目录不存在: %s", configs_dir)
        return result

    VERSION_PREFIX_RE = re.compile(r"^v\d+[-_](.+)$")

    for folder in sorted(configs_dir.iterdir()):
        if not folder.is_dir():
            continue
        m = VERSION_PREFIX_RE.match(folder.name)
        if not m:
            continue
        yml_path = folder / f"{m.group(1)}.yml"
        if not yml_path.is_file():
            logger.debug("跳过 %s：找不到 %s", folder.name, yml_path.name)
            continue
        with yml_path.open("r", encoding="utf-8") as f:
            data = yaml.safe_load(f)
        if not isinstance(data, dict):
            continue
        namespace = data.get("info", {}).get("namespace")
        if not isinstance(namespace, str) or not namespace:
            continue
        items = data.get("items")
        if not isinstance(items, dict):
            continue
        for entry_key, entry in items.items():
            if not isinstance(entry, dict):
                continue
            display_name = entry.get("display_name")
            if isinstance(display_name, str) and display_name:
                result[display_name] = namespace
    return result


def generate_furniture(src_dir: Path, dst_dir: Path, bundles_path: Path | None = None) -> int:
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

    if bundles_path is None:
        bundles_path = (
            src_dir.parent / "ItmesAdder" / "08-家具" / "configs"
        )
    bundle_map = load_bundle_map(bundles_path)

    dst_dir.mkdir(parents=True, exist_ok=True)
    count = 0
    for name in sorted(source_map):
        content: dict[str, Any] = {
            "basic": {"name": name, "type": "furniture"},
            "usage": [USAGE],
            "source": sorted(source_map[name]),
        }
        namespace = bundle_map.get(name)
        if namespace:
            content.setdefault("filter", {})["bundle"] = namespace
        out_path = dst_dir / f"{(count+1):03d}.yml"
        write_yaml_with_merge(out_path, content)
        count += 1
    return count


def generate_wallsticker(src_dir: Path, dst_dir: Path) -> int:
    names = load_names(src_dir / "wallsticker.txt")
    dst_dir.mkdir(parents=True, exist_ok=True)
    count = 0
    for name in sorted(names):
        content: dict[str, Any] = {
            "basic": {"name": name, "type": "wallsticker"},
            "usage": [USAGE],
            "source": [SOURCE_WALLSTICKER],
        }
        out_path = dst_dir / f"{count + 1:03d}.yml"
        write_yaml_with_merge(out_path, content)
        count += 1
    return count


def generate_doll(src_dir: Path, dst_dir: Path) -> int:
    names = load_names(src_dir / "doll.txt")
    dst_dir.mkdir(parents=True, exist_ok=True)
    count = 0
    for name in sorted(names):
        content: dict[str, Any] = {
            "basic": {"name": name, "type": "doll"},
            "usage": [USAGE],
            "source": [SOURCE_DOLL],
        }
        out_path = dst_dir / f"{count + 1:03d}.yml"
        write_yaml_with_merge(out_path, content)
        count += 1
    return count


def run(src: Path, dst: Path, bundles_path: Path | None = None) -> int:
    """从 Lists 目录生成 deco gallery 文件。"""
    total = 0
    total += generate_furniture(src, dst / "furniture", bundles_path)
    total += generate_wallsticker(src, dst / "wallsticker")
    total += generate_doll(src, dst / "doll")
    return total