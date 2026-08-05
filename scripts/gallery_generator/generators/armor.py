"""护甲 gallery 生成器。"""

from __future__ import annotations

import logging
import re
from pathlib import Path
from typing import Any

from ..utils import write_yaml_with_merge

logger = logging.getLogger(__name__)

name = "armor"
help = "从 armor.yml 生成护甲 gallery 数据"

PART_MAP: dict[str, str] = {
    "KUI": "HELMET", "XIONG": "CHESTPLATE", "KU": "LEGGINGS", "XUE": "BOOTS",
}

KEY_PATTERN = re.compile(r"^([A-Z]+)_(D|C|B|A|S)_([A-Z]+)$")
GRADIENT_RE = re.compile(r"<gradient:[^>]+>")


def strip_gradient(name: str) -> str:
    return GRADIENT_RE.sub("", name).strip()


def transform_item(key: str, base: dict[str, Any]) -> tuple[str, str, str, dict[str, Any]] | None:
    m = KEY_PATTERN.match(key)
    if not m:
        logger.warning("跳过不符合命名规则的键: %s", key)
        return None
    job_upper, quality, part_code = m.groups()
    part = PART_MAP.get(part_code)
    if part is None:
        logger.warning("未知部位代码 %s，跳过键: %s", part_code, key)
        return None
    basic: dict[str, Any] = {
        "name": strip_gradient(str(base.get("name", ""))),
        "quality": quality,
        "job": job_upper.lower(),
    }
    if "image" in base:
        basic["image"] = base["image"]
    value: dict[str, Any] = {}
    if "max-item-damage" in base:
        value["durable"] = base["max-item-damage"]
    if "armor" in base:
        value["armor"] = base["armor"]
    if "armor-toughness" in base:
        value["armor-toughness"] = base["armor-toughness"]
    effect: dict[str, Any] = {}
    for k in ("max-health", "defense", "max-mana", "max-stamina", "parry-rating", "movement-speed", "dodge-rating"):
        if k in base:
            effect[k] = base[k]
    gem: dict[str, Any] = {}
    if "weapon-card" in base:
        gem["count"] = base["weapon-card"]
    if "weapon-swordvolume" in base:
        gem["volume"] = base["weapon-swordvolume"]
    result: dict[str, Any] = {"basic": basic}
    if value:
        result["value"] = value
    if effect:
        result["effect"] = effect
    if gem:
        result["gem"] = gem
    return job_upper, quality, part, result


def run(src: Path, dst: Path) -> int:
    """从 armor.yml 生成 armor gallery 文件。"""
    import yaml

    if not src.is_file():
        raise FileNotFoundError(f"源文件不存在: {src}")
    with src.open("r", encoding="utf-8") as f:
        data: Any = yaml.safe_load(f)
    if not isinstance(data, dict):
        raise ValueError(f"YAML 根节点不是字典: {src}")
    dst.mkdir(parents=True, exist_ok=True)
    count = 0
    for key, item in data.items():
        if not isinstance(item, dict) or "base" not in item:
            continue
        base = item["base"]
        if not isinstance(base, dict):
            continue
        transformed = transform_item(key, base)
        if transformed is None:
            continue
        job, quality, part, content = transformed
        out_path = dst / job.lower() / quality.lower() / f"{part.lower()}.yml"
        out_path.parent.mkdir(parents=True, exist_ok=True)
        write_yaml_with_merge(out_path, content)
        logger.info("已写入: %s", out_path.name)
        count += 1
    return count