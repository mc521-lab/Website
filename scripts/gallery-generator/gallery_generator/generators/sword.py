"""武器（剑） gallery 生成器。"""

from __future__ import annotations

import logging
import re
from pathlib import Path
from typing import Any

from ..utils import write_yaml_with_merge

logger = logging.getLogger(__name__)

name = "sword"
help = "从 sword.yml 生成武器 gallery 数据"

KEY_PATTERN = re.compile(r"^([A-Z]+)_(D|C|B|A|S)_JIAN$")
GRADIENT_RE = re.compile(r"<gradient:[^>]+>")


def strip_gradient(name: str) -> str:
    return GRADIENT_RE.sub("", name).strip()


def _to_number(val: Any) -> int | float:
    if isinstance(val, bool):
        return val
    if isinstance(val, (int, float)):
        return int(val) if isinstance(val, float) and val.is_integer() else val
    return val


def transform_item(key: str, base: dict[str, Any]) -> tuple[str, str, dict[str, Any]] | None:
    m = KEY_PATTERN.match(key)
    if not m:
        logger.warning("跳过不符合命名规则的键: %s", key)
        return None
    job_upper, quality = m.groups()
    basic: dict[str, Any] = {
        "name": strip_gradient(str(base.get("name", ""))),
        "quality": quality,
        "job": job_upper.lower(),
    }
    if "image" in base:
        basic["image"] = base["image"]
    value: dict[str, Any] = {}
    if "max-item-damage" in base:
        value["durable"] = _to_number(base["max-item-damage"])
    for k in ("attack-damage", "attack-speed", "critical-strike-power", "critical-strike-chance", "lifesteal"):
        if k in base:
            value[k] = _to_number(base[k])
    gem: dict[str, Any] = {}
    if "weapon-card" in base:
        gem["count"] = _to_number(base["weapon-card"])
    if "weapon-swordvolume" in base:
        gem["volume"] = _to_number(base["weapon-swordvolume"])
    if "weapon-max-card" in base and "weapon-card" in base:
        try:
            lock_val = float(base["weapon-max-card"]) - float(base["weapon-card"])
            gem["lock"] = _to_number(lock_val)
        except (TypeError, ValueError):
            pass
    result: dict[str, Any] = {"basic": basic}
    if value:
        result["value"] = value
    if gem:
        result["gem"] = gem
    return job_upper, quality, result


def run(src: Path, dst: Path) -> int:
    """从 sword.yml 生成 sword gallery 文件。"""
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
        job, quality, content = transformed
        out_path = dst / job.lower() / f"{quality.lower()}.yml"
        out_path.parent.mkdir(parents=True, exist_ok=True)
        write_yaml_with_merge(out_path, content)
        count += 1
    return count