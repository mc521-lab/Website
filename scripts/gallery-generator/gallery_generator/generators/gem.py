"""宝石 gallery 生成器。"""

from __future__ import annotations

import logging
import re
from pathlib import Path
from typing import Any

from ..utils import write_yaml_with_merge

logger = logging.getLogger(__name__)

name = "gem"
help = "从 gem_stone.yml + baoshi_modifiers.yml 生成宝石 gallery 数据"

KEY_PATTERN = re.compile(r"^BS_([A-Z]+)_([CBAS])$")
GRADIENT_RE = re.compile(r"</?gradient[^>]*>")
QUALITY_SUFFIX_RE = re.compile(r"-[CBAS]级\s*$")


def strip_gradient(name: str) -> str:
    return GRADIENT_RE.sub("", name).strip()


def strip_quality_suffix(name: str) -> str:
    return QUALITY_SUFFIX_RE.sub("", name).strip()


def _to_number(val: Any) -> int | float:
    if isinstance(val, bool):
        return val
    if isinstance(val, (int, float)):
        return int(val) if isinstance(val, float) and val.is_integer() else val
    return val


def load_modifiers(path: Path) -> dict[str, dict[str, Any]]:
    import yaml

    if not path.is_file():
        raise FileNotFoundError(f"修饰符源文件不存在: {path}")
    with path.open("r", encoding="utf-8") as f:
        data: Any = yaml.safe_load(f)
    if not isinstance(data, dict):
        raise ValueError(f"修饰符 YAML 根节点不是字典: {path}")
    result: dict[str, dict[str, Any]] = {}
    for mod_id, node in data.items():
        if not isinstance(node, dict):
            continue
        stats = node.get("stats")
        if not isinstance(stats, dict) or not stats:
            continue
        effect_name, effect_range = next(iter(stats.items()))
        if not isinstance(effect_range, dict):
            continue
        result[str(mod_id)] = {
            "effect": str(effect_name),
            "min": _to_number(effect_range.get("min")),
            "max": _to_number(effect_range.get("max")),
        }
    logger.info("已加载 %d 个宝石修饰符定义", len(result))
    return result


def extract_modifier_group(item: dict[str, Any]) -> dict[str, Any] | None:
    mods_node = item.get("modifiers")
    if not isinstance(mods_node, dict) or not mods_node:
        return None
    group = next(iter(mods_node.values()), None)
    if not isinstance(group, dict):
        return None
    return group


def transform_item(
    key: str, item: dict[str, Any], modifier_defs: dict[str, dict[str, Any]]
) -> tuple[str, str, dict[str, Any]] | None:
    m = KEY_PATTERN.match(key)
    if not m:
        return None
    type_code, quality = m.groups()
    type_lower = type_code.lower()
    quality_lower = quality.lower()
    base = item.get("base")
    if not isinstance(base, dict):
        return None
    raw_name = strip_gradient(str(base.get("name", "")))
    clean_name = strip_quality_suffix(raw_name)
    basic: dict[str, Any] = {"name": clean_name, "quality": quality}
    gem: dict[str, Any] = {}
    if "success-rate" in base:
        gem["success-rate"] = _to_number(base["success-rate"])
    if "gemstone-consume" in base:
        gem["consume"] = _to_number(base["gemstone-consume"])
    group = extract_modifier_group(item)
    modifiers_out: dict[str, Any] = {}
    if group is not None:
        if "min" in group:
            modifiers_out["min"] = _to_number(group["min"])
        if "max" in group:
            modifiers_out["max"] = _to_number(group["max"])
        entries: dict[str, Any] = {}
        group_mods = group.get("modifiers")
        if isinstance(group_mods, dict):
            for mod_id, probability in group_mods.items():
                mod_id_str = str(mod_id)
                entry: dict[str, Any] = {"probability": _to_number(probability)}
                defn = modifier_defs.get(mod_id_str)
                if defn is not None:
                    entry["effect"] = defn["effect"]
                    entry["min"] = defn["min"]
                    entry["max"] = defn["max"]
                entries[mod_id_str] = entry
        if entries:
            modifiers_out["entries"] = entries
    result: dict[str, Any] = {"basic": basic}
    if gem:
        result["gem"] = gem
    if modifiers_out:
        result["modifiers"] = modifiers_out
    return type_lower, quality_lower, result


def run(src: Path, dst: Path, modifiers_src: Path | None = None) -> int:
    """从 gem_stone.yml 和 baoshi_modifiers.yml 生成 gem gallery 文件。"""
    import yaml

    if modifiers_src is None:
        modifiers_src = src.parent.parent / "modifiers" / "baoshi_modifiers.yml"
    modifier_defs = load_modifiers(modifiers_src)
    if not src.is_file():
        raise FileNotFoundError(f"宝石源文件不存在: {src}")
    with src.open("r", encoding="utf-8") as f:
        data: Any = yaml.safe_load(f)
    if not isinstance(data, dict):
        raise ValueError(f"YAML 根节点不是字典: {src}")
    dst.mkdir(parents=True, exist_ok=True)
    count = 0
    for key, item in data.items():
        if not isinstance(item, dict) or "base" not in item:
            continue
        transformed = transform_item(key, item, modifier_defs)
        if transformed is None:
            continue
        type_code, quality, content = transformed
        out_path = dst / type_code / f"{quality}.yml"
        out_path.parent.mkdir(parents=True, exist_ok=True)
        write_yaml_with_merge(out_path, content)
        count += 1
    return count