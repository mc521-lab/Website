#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
一键脚本：从 raw-config/armor.yml 提取每件护甲数据，
转换为 gallery 所需格式，并写入 content/gallery/_data/armor/{NAME}.yml

输出文件名规则：{职业}_{品质}_{部位}，全大写
  例：ZHANSHI_D_KUI → ZHANSHI_D_HELMET

部位映射：
  KUI  → HELMET
  XIONG → CHESTPLATE
  KU   → LEGGINGS
  XUE  → BOOTS
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
# 路径与映射
# ---------------------------------------------------------------------------

PART_MAP: dict[str, str] = {
    "KUI": "HELMET",
    "XIONG": "CHESTPLATE",
    "KU": "LEGGINGS",
    "XUE": "BOOTS",
}

# 匹配 JOB_QUALITY_PART 形式的键（例如 ZHANSHI_D_KUI）
KEY_PATTERN = re.compile(r"^([A-Z]+)_(D|C|B|A|S)_([A-Z]+)$")

# 名称中的 gradient 标签
GRADIENT_RE = re.compile(r"<gradient:[^>]+>")


def strip_gradient(name: str) -> str:
    """去掉 <gradient:...> 前缀，返回纯文本名称。"""
    return GRADIENT_RE.sub("", name).strip()


def transform_item(key: str, base: dict[str, Any]) -> tuple[str, dict[str, Any]] | None:
    """
    将单件护甲的 base 数据转换为 gallery 格式。

    返回 (输出文件名, 内容字典)；若键不符合规则则返回 None。
    """
    m = KEY_PATTERN.match(key)
    if not m:
        logger.warning("跳过不符合命名规则的键: %s", key)
        return None

    job_upper, quality, part_code = m.groups()
    part = PART_MAP.get(part_code)
    if part is None:
        logger.warning("未知部位代码 %s，跳过键: %s", part_code, key)
        return None

    # ---- basic ----
    basic: dict[str, Any] = {
        "name": strip_gradient(str(base.get("name", ""))),
        "quality": quality,
        "job": job_upper.lower(),
    }
    if "image" in base:
        basic["image"] = base["image"]

    # ---- value -----
    value: dict[str, Any] = {}
    if "max-item-damage" in base:
        value["durable"] = base["max-item-damage"]
    if "armor" in base:
        value["armor"] = base["armor"]
    if "armor-toughness" in base:
        value["armor-toughness"] = base["armor-toughness"]

    # ---- effect（仅包含源文件中存在的字段）----
    effect: dict[str, Any] = {}
    if "max-health" in base: # 最大生命加成
        effect["max-health"] = base["max-health"]
    if "defense" in base: # 防御减伤
        effect["defense"] = base["defense"]
    if "max-mana" in base: # 法力加成
        effect["max-mana"] = base["max-mana"]
    if "max-stamina" in base: # 耐力加成
        effect["max-stamina"] = base["max-stamina"]
    if "parry-rating" in base: # 招架几率
        effect["parry-rating"] = base["parry-rating"]
    if "movement-speed" in base: # 移速加成
        effect["movement-speed"] = base["movement-speed"]
    if "dodge-rating" in base: # 闪避率
        effect["dodge-rating"] = base["dodge-rating"]

    # ---- gem ----
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


def generate(
    src_path: Path,
    dst_dir: Path,
) -> int:
    """
    读取 armor.yml，为每一项生成对应的 gallery yml 文件。

    返回成功写入的文件数量。
    """
    if not src_path.is_file():
        raise FileNotFoundError(f"源文件不存在: {src_path}")

    with src_path.open("r", encoding="utf-8") as f:
        data: Any = yaml.safe_load(f)

    if not isinstance(data, dict):
        raise ValueError(f"YAML 根节点不是字典: {src_path}")

    dst_dir.mkdir(parents=True, exist_ok=True)

    count = 0
    for key, item in data.items():
        if not isinstance(item, dict) or "base" not in item:
            logger.debug("跳过无 base 节点的键: %s", key)
            continue

        base = item["base"]
        if not isinstance(base, dict):
            logger.warning("base 不是字典，跳过: %s", key)
            continue

        transformed = transform_item(key, base)
        if transformed is None:
            continue

        job, quality, part, content = transformed
        out_path = dst_dir / job.lower() / quality.lower() / f"{part.lower()}.yml"
        out_path.parent.mkdir(parents=True, exist_ok=True)

        with out_path.open("w", encoding="utf-8") as f:
            yaml.dump(
                content,
                f,
                allow_unicode=True,
                default_flow_style=False,
                sort_keys=False,
                width=120,
            )
            # 确保末尾有换行（yaml.dump 通常已包含）

        logger.info("已写入: %s", out_path.name)
        count += 1

    return count


def main() -> None:
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s [%(levelname)s] %(message)s",
        datefmt="%H:%M:%S",
    )

    # 项目根目录（scripts/ 的上一级）
    project_root = Path(__file__).resolve().parent.parent

    # 默认路径（与现有流水线一致）
    # 若希望使用绝对路径 /raw-config 与 /content，可在此修改
    src = project_root / "raw-config" / "item" / "armor.yml"
    dst = project_root / "content" / "gallery" / "_data" / "armor"

    # 支持命令行覆盖：python generate_armor_gallery.py [src] [dst]
    if len(sys.argv) >= 2:
        src = Path(sys.argv[1])
    if len(sys.argv) >= 3:
        dst = Path(sys.argv[2])

    logger.info("源文件: %s", src)
    logger.info("目标目录: %s", dst)

    try:
        n = generate(src, dst)
        print(f"\n完成：成功生成 {n} 个护甲文件 → {dst}")
    except Exception as e:
        logger.error("执行失败: %s", e)
        sys.exit(1)


if __name__ == "__main__":
    main()