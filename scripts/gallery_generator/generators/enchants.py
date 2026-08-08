"""附魔 gallery 生成器。"""

from __future__ import annotations

import logging
import re
from pathlib import Path
from typing import Any

from ..utils import write_yaml_with_merge

logger = logging.getLogger(__name__)

name = "enchants"
help = "从 EcoEnchants 配置生成附魔 gallery 数据"

COLOR_RE = re.compile(
    r"&#[0-9A-Fa-f]{6}"          # &#RRGGBB
    r"|§[0-9A-Fa-fK-Ok-oRr]"     # §x
    r"|\&[0-9A-Fa-fK-Ok-oRr]"    # &x
)

def strip_color(text: str) -> str:
    """从文本中移除所有颜色代码。"""
    return COLOR_RE.sub("", text)

def transform_item(key: str, base: dict[str, Any], is_vanilla: bool = False) -> dict[str, Any]:
    description = str(base.get("description", ""))
    placeholder = base.get("placeholder")
    placeholders = base.get("placeholders")
    max_level = int(base.get("max-level", 1))
    rarity = str(base.get("rarity", "common"))

    # 兼容两种命名方式
    display_name = base.get("display-name") or base.get("name") or key
    
    return {
        "basic": {
            "id": key,
            "name": str(display_name),
            "description": strip_color(description),
            "placeholder": str(placeholder) if placeholder not in (None, "null") else None,
            "placeholders": (
                {str(k): str(v) for k, v in placeholders.items()}
                if isinstance(placeholders, dict)
                else {}
            ),
            "max-level": max_level,
            "type": str(base["type"]) if base.get("type") else None,
        },
        "filter": {
            "rarity": rarity,
            "tradeable": bool(base.get("tradeable", is_vanilla)),
            "discoverable": bool(base.get("discoverable", is_vanilla)),
            "enchantable": bool(base.get("enchantable", is_vanilla)),  # 新增
        },
        "targets": [str(v) for v in base.get("targets", []) if v is not None],
        "conflicts": [str(v) for v in base.get("conflicts", []) if v is not None],
    }

def run(src: Path, dst: Path) -> int:
    """从 EcoEnchants 配置生成 enchants gallery 文件。"""
    import yaml

    if not src.is_dir():
        raise FileNotFoundError(f"源目录不存在: {src}")

    dst.mkdir(parents=True, exist_ok=True)
    count = 0

    for src_path in sorted(src.rglob("*.yml")):
        if src_path.name == "_example.yml":
            continue
        with src_path.open("r", encoding="utf-8") as f:
            data: Any = yaml.safe_load(f)
        if not isinstance(data, dict):
            logger.warning("跳过无效 YAML: %s", src_path)
            continue
        transformed = transform_item(src_path.stem, data)
        out_path = dst / f"{src_path.stem}.yml"
        write_yaml_with_merge(out_path, transformed)
        logger.info("已写入: %s", out_path.relative_to(dst))
        count += 1
    
    with (src.parent / "vanillaenchants.yml").open("r", encoding="utf-8") as f:
        data: Any = yaml.safe_load(f)
        for key, data in data.items():
            transformed = transform_item(key, data, is_vanilla=True)
            out_path = dst / f"{key}.yml"
            write_yaml_with_merge(out_path, transformed)
            logger.info("已写入: %s", out_path.relative_to(dst))
            count += 1

    return count
