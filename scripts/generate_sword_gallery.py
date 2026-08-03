#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
一键脚本：从 raw-config/sword.yml 提取每把武器数据，
转换为 gallery 所需格式，并写入 content/gallery/_data/sword/{职业}/{等级}.yml

输出路径规则：按原键名拆分后写入分层目录
  例：ZHANSHI_D_JIAN → sword/ZHANSHI/D.yml

键名匹配：JOB_QUALITY_JIAN（例如 ZHANSHI_D_JIAN）

特殊规则：
  若 base 中同时存在 weapon-max-card 与 weapon-card，
  则 gem.lock = weapon-max-card - weapon-card
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

# 匹配 JOB_QUALITY_JIAN 形式的键（例如 ZHANSHI_D_JIAN）
KEY_PATTERN = re.compile(r"^([A-Z]+)_(D|C|B|A|S)_JIAN$")

# 名称中的 gradient 标签
GRADIENT_RE = re.compile(r"<gradient:[^>]+>")


def strip_gradient(name: str) -> str:
    """去掉 <gradient:...> 前缀，返回纯文本名称。"""
    return GRADIENT_RE.sub("", name).strip()


def _to_number(val: Any) -> int | float:
    """将数值尽量转为 int；若有小数部分则保留 float。"""
    if isinstance(val, bool):
        return val
    if isinstance(val, (int, float)):
        if isinstance(val, float) and val.is_integer():
            return int(val)
        return val
    return val


def transform_item(
    key: str, base: dict[str, Any]
) -> tuple[str, str, dict[str, Any]] | None:
    """
    将单把武器的 base 数据转换为 gallery 格式。

    返回 (职业大写, 等级, 内容字典)；若键不符合规则则返回 None。
    最终输出路径为 {职业}/{等级}.yml
    """
    m = KEY_PATTERN.match(key)
    if not m:
        logger.warning("跳过不符合命名规则的键: %s", key)
        return None

    job_upper, quality = m.groups()

    # ---- basic ----
    basic: dict[str, Any] = {
        "name": strip_gradient(str(base.get("name", ""))),
        "quality": quality,
        "job": job_upper.lower(),
    }
    if "image" in base:
        basic["image"] = base["image"]

    # ---- value（战斗属性）----
    value: dict[str, Any] = {}
    if "max-item-damage" in base:
        value["durable"] = _to_number(base["max-item-damage"])
    if "attack-damage" in base:
        value["attack-damage"] = _to_number(base["attack-damage"])
    if "attack-speed" in base:
        value["attack-speed"] = _to_number(base["attack-speed"])
    if "critical-strike-power" in base:
        value["critical-strike-power"] = _to_number(base["critical-strike-power"])
    if "critical-strike-chance" in base:
        value["critical-strike-chance"] = _to_number(base["critical-strike-chance"])
    if "lifesteal" in base:
        value["lifesteal"] = _to_number(base["lifesteal"])

    # ---- gem ----
    gem: dict[str, Any] = {}
    if "weapon-card" in base:
        gem["count"] = _to_number(base["weapon-card"])
    if "weapon-swordvolume" in base:
        gem["volume"] = _to_number(base["weapon-swordvolume"])
    # 若存在 weapon-max-card，则 lock = max-card - card
    if "weapon-max-card" in base and "weapon-card" in base:
        try:
            lock_val = float(base["weapon-max-card"]) - float(base["weapon-card"])
            gem["lock"] = _to_number(lock_val)
        except (TypeError, ValueError) as e:
            logger.warning("无法计算 lock（键 %s）: %s", key, e)

    result: dict[str, Any] = {"basic": basic}
    if value:
        result["value"] = value
    if gem:
        result["gem"] = gem

    return job_upper, quality, result


def generate(
    src_path: Path,
    dst_dir: Path,
) -> int:
    """
    读取 sword.yml，为每一项生成对应的 gallery yml 文件。

    输出路径：{dst_dir}/{职业}/{等级}.yml

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

        job, quality, content = transformed
        out_path = dst_dir / job.lower() / f"{quality.lower()}.yml"
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

        logger.info("已写入: %s", out_path.relative_to(dst_dir))
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
    src = project_root / "raw-config" / "item" / "sword.yml"
    dst = project_root / "content" / "gallery" / "_data" / "equipment" / "sword"

    # 支持命令行覆盖：python generate_sword_gallery.py [src] [dst]
    if len(sys.argv) >= 2:
        src = Path(sys.argv[1])
    if len(sys.argv) >= 3:
        dst = Path(sys.argv[2])

    logger.info("源文件: %s", src)
    logger.info("目标目录: %s", dst)

    try:
        n = generate(src, dst)
        print(f"\n完成：成功生成 {n} 个武器文件 → {dst}")
    except Exception as e:
        logger.error("执行失败: %s", e)
        sys.exit(1)


if __name__ == "__main__":
    main()
