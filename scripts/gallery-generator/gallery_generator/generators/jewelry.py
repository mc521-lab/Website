"""饰品 gallery 生成器。"""

from __future__ import annotations

import logging
import re
from pathlib import Path
from typing import Any

from ..utils import write_yaml_with_merge

logger = logging.getLogger(__name__)

name = "jewelry"
help = "从饰品配置 + shipin_modifiers.yml 生成饰品 gallery 数据"

SOURCE_FILES: dict[str, str] = {
    "sp_jiezhiyou": "jiezhiyou", "sp_jiezhizuo": "jiezhizuo",
    "sp_mibao": "mibao", "sp_shoutao": "shoutao",
    "sp_shouzhuo": "shouzhuo", "sp_xianglian": "xianglian",
}

JOB_MAP: dict[str, str] = {
    "战士": "ZHANSHI", "法师": "FASHI", "刺客": "CIKE",
    "射手": "SHESHOU", "牧师": "MUSHI",
}

GRADIENT_RE = re.compile(r"</?gradient[^>]*>")
BASIC_ONLY_KEYS = frozenset({
    "material", "name", "lore", "custom-model-data", "lore-format",
    "required-class", "revision-id", "image",
})


def strip_gradient(name: str) -> str:
    return GRADIENT_RE.sub("", name).strip()


def _to_number(val: Any) -> int | float | Any:
    if isinstance(val, bool):
        return val
    if isinstance(val, (int, float)):
        return int(val) if isinstance(val, float) and val.is_integer() else val
    return val


def load_modifiers(path: Path) -> dict[str, list[dict[str, Any]]]:
    import yaml

    if not path.is_file():
        raise FileNotFoundError(f"修饰符源文件不存在: {path}")
    with path.open("r", encoding="utf-8") as f:
        data: Any = yaml.safe_load(f)
    if not isinstance(data, dict):
        raise ValueError(f"修饰符 YAML 根节点不是字典: {path}")
    result: dict[str, list[dict[str, Any]]] = {}
    for mod_id, node in data.items():
        if not isinstance(node, dict):
            continue
        stats = node.get("stats")
        if not isinstance(stats, dict) or not stats:
            continue
        entries: list[dict[str, Any]] = []
        for attr, rng in stats.items():
            if not isinstance(rng, dict):
                continue
            entry: dict[str, Any] = {"effect": str(attr)}
            if "min" in rng:
                entry["min"] = _to_number(rng["min"])
            if "max" in rng:
                entry["max"] = _to_number(rng["max"])
            entries.append(entry)
        if entries:
            result[str(mod_id)] = entries
    logger.info("已加载 %d 个饰品修饰符定义", len(result))
    return result


def extract_modifier_group(item: dict[str, Any]) -> dict[str, Any] | None:
    mods_node = item.get("modifiers")
    if not isinstance(mods_node, dict) or not mods_node:
        return None
    if "sp_modifiers" in mods_node and isinstance(mods_node["sp_modifiers"], dict):
        return mods_node["sp_modifiers"]
    group = next(iter(mods_node.values()), None)
    return group if isinstance(group, dict) else None


def resolve_job(base: dict[str, Any], item_key: str) -> str | None:
    required = base.get("required-class")
    if not isinstance(required, list) or not required:
        return None
    cls_name = str(required[0]).strip()
    return JOB_MAP.get(cls_name)


def transform_item(
    item_key: str, item: dict[str, Any], position: str,
    modifier_defs: dict[str, list[dict[str, Any]]],
) -> tuple[str, dict[str, Any]] | None:
    base = item.get("base")
    if not isinstance(base, dict):
        return None
    job = resolve_job(base, item_key)
    if job is None:
        return None
    basic: dict[str, Any] = {
        "name": strip_gradient(str(base.get("name", item_key))),
        "special": position == "mibao",
    }
    group = extract_modifier_group(item)
    entries: dict[str, Any] = {}
    if group is not None:
        group_mods = group.get("modifiers")
        if isinstance(group_mods, dict):
            for mod_id, probability in group_mods.items():
                mod_id_str = str(mod_id)
                entry: dict[str, Any] = {"probability": _to_number(probability)}
                defn = modifier_defs.get(mod_id_str)
                if defn is not None:
                    entry["stats"] = defn
                entries[mod_id_str] = entry
    result: dict[str, Any] = {"basic": basic}
    if entries:
        result["modifiers"] = {"entries": entries}
    return job, result


def run(src: Path, dst: Path, modifiers_src: Path | None = None) -> int:
    """从饰品目录和修饰符文件生成 jewelry gallery 文件。"""
    import yaml

    if modifiers_src is None:
        modifiers_src = src.parent.parent / "modifiers" / "shipin_modifiers.yml"
    modifier_defs = load_modifiers(modifiers_src)
    if not src.is_dir():
        raise FileNotFoundError(f"饰品源目录不存在: {src}")
    dst.mkdir(parents=True, exist_ok=True)
    count = 0
    for src_stem, position in SOURCE_FILES.items():
        src_path = src / f"{src_stem}.yml"
        if not src_path.is_file():
            alt = src.parent / f"{src_stem}.yml"
            if alt.is_file():
                src_path = alt
            else:
                continue
        with src_path.open("r", encoding="utf-8") as f:
            data: Any = yaml.safe_load(f)
        if not isinstance(data, dict):
            continue
        for item_key, item in data.items():
            if not isinstance(item, dict) or "base" not in item:
                continue
            transformed = transform_item(item_key, item, position, modifier_defs)
            if transformed is None:
                continue
            job, content = transformed
            out_path = dst / job.lower() / f"{position.lower()}.yml"
            out_path.parent.mkdir(parents=True, exist_ok=True)
            write_yaml_with_merge(out_path, content)
            count += 1
    return count