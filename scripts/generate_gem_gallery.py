#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
一键脚本：从 baoshi_modifiers.yml 与 gem_stone.yml 提取宝石数据，
转换为 gallery 所需格式，并写入 content/gallery/_data/gem/{类型}/{品质}.yml

输出路径规则：
  例：BS_FX_C → gem/fx/c.yml
  例：BS_BJ_S → gem/bj/s.yml

键名匹配：BS_{TYPE}_{QUALITY}（例如 BS_FX_C）

数据来源：
  - gem_stone.yml：宝石基础信息、成功率、消耗、修饰符组引用
  - baoshi_modifiers.yml：各修饰符 ID 对应的属性效果（stats）
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

# 匹配 BS_TYPE_QUALITY 形式的键（例如 BS_FX_C）
KEY_PATTERN = re.compile(r"^BS_([A-Z]+)_([CBAS])$")

# 名称中的 gradient 标签（含可选闭合标签）
GRADIENT_RE = re.compile(r"</?gradient[^>]*>")

# 名称末尾的品质后缀，如 -C级 / -B级 等
QUALITY_SUFFIX_RE = re.compile(r"-[CBAS]级\s*$")


def strip_gradient(name: str) -> str:
    """去掉 <gradient:...> / </gradient> 标签，返回纯文本名称。"""
    return GRADIENT_RE.sub("", name).strip()


def strip_quality_suffix(name: str) -> str:
    """去掉名称末尾的 -C级 / -B级 / -A级 / -S级 后缀。"""
    return QUALITY_SUFFIX_RE.sub("", name).strip()


def _to_number(val: Any) -> int | float:
    """将数值尽量转为 int；若有小数部分则保留 float。"""
    if isinstance(val, bool):
        return val
    if isinstance(val, (int, float)):
        if isinstance(val, float) and val.is_integer():
            return int(val)
        return val
    return val


def load_modifiers(path: Path) -> dict[str, dict[str, Any]]:
    """
    加载 baoshi_modifiers.yml，返回修饰符 ID → 效果信息的映射。

    源结构示例：
      hxc:
        stats:
          max-health:
            min: 1.0
            max: 1.5

    解析为：
      hxc → {"effect": "max-health", "min": 1.0, "max": 1.5}
    """
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
            logger.warning("修饰符 %s 缺少有效 stats，跳过", mod_id)
            continue
        # 每个修饰符通常只有一个属性
        effect_name, effect_range = next(iter(stats.items()))
        if not isinstance(effect_range, dict):
            logger.warning("修饰符 %s 的 stats.%s 不是字典，跳过", mod_id, effect_name)
            continue
        result[str(mod_id)] = {
            "effect": str(effect_name),
            "min": _to_number(effect_range.get("min")),
            "max": _to_number(effect_range.get("max")),
        }

    logger.info("已加载 %d 个宝石修饰符定义", len(result))
    return result


def extract_modifier_group(item: dict[str, Any]) -> dict[str, Any] | None:
    """
    从宝石条目的 modifiers 节点中取出第一个（通常是唯一）修饰符组。

    返回包含 min / max / modifiers 的字典；若不存在则返回 None。
    """
    mods_node = item.get("modifiers")
    if not isinstance(mods_node, dict) or not mods_node:
        return None
    # 取第一个组（键名通常为 c_modifiers）
    group = next(iter(mods_node.values()), None)
    if not isinstance(group, dict):
        return None
    return group


def transform_item(
    key: str,
    item: dict[str, Any],
    modifier_defs: dict[str, dict[str, Any]],
) -> tuple[str, str, dict[str, Any]] | None:
    """
    将单颗宝石数据转换为 gallery 格式。

    返回 (类型小写, 品质小写, 内容字典)；若键不符合规则则返回 None。
    最终输出路径为 {类型}/{品质}.yml
    """
    m = KEY_PATTERN.match(key)
    if not m:
        logger.warning("跳过不符合命名规则的键: %s", key)
        return None

    type_code, quality = m.groups()
    type_lower = type_code.lower()
    quality_lower = quality.lower()

    base = item.get("base")
    if not isinstance(base, dict):
        logger.warning("base 不是字典，跳过: %s", key)
        return None

    # ---- basic ----
    raw_name = strip_gradient(str(base.get("name", "")))
    clean_name = strip_quality_suffix(raw_name)
    basic: dict[str, Any] = {
        "name": clean_name,
        "quality": quality,
    }

    # ---- gem ----
    gem: dict[str, Any] = {}
    if "success-rate" in base:
        gem["success-rate"] = _to_number(base["success-rate"])
    if "gemstone-consume" in base:
        gem["consume"] = _to_number(base["gemstone-consume"])

    # ---- modifiers ----
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
                entry: dict[str, Any] = {
                    "probability": _to_number(probability),
                }
                defn = modifier_defs.get(mod_id_str)
                if defn is not None:
                    entry["effect"] = defn["effect"]
                    entry["min"] = defn["min"]
                    entry["max"] = defn["max"]
                else:
                    logger.warning(
                        "宝石 %s 引用了未知修饰符 %s，仅保留 probability",
                        key,
                        mod_id_str,
                    )
                entries[mod_id_str] = entry
        if entries:
            modifiers_out["entries"] = entries

    result: dict[str, Any] = {"basic": basic}
    if gem:
        result["gem"] = gem
    if modifiers_out:
        result["modifiers"] = modifiers_out

    return type_lower, quality_lower, result


def generate(
    modifiers_path: Path,
    gem_stone_path: Path,
    dst_dir: Path,
) -> int:
    """
    读取修饰符与宝石配置，为每一颗宝石生成对应的 gallery yml 文件。

    输出路径：{dst_dir}/{类型}/{品质}.yml

    返回成功写入的文件数量。
    """
    modifier_defs = load_modifiers(modifiers_path)

    if not gem_stone_path.is_file():
        raise FileNotFoundError(f"宝石源文件不存在: {gem_stone_path}")

    with gem_stone_path.open("r", encoding="utf-8") as f:
        data: Any = yaml.safe_load(f)

    if not isinstance(data, dict):
        raise ValueError(f"YAML 根节点不是字典: {gem_stone_path}")

    dst_dir.mkdir(parents=True, exist_ok=True)

    count = 0
    for key, item in data.items():
        if not isinstance(item, dict) or "base" not in item:
            logger.debug("跳过无 base 节点的键: %s", key)
            continue

        transformed = transform_item(key, item, modifier_defs)
        if transformed is None:
            continue

        type_code, quality, content = transformed
        out_path = dst_dir / type_code / f"{quality}.yml"
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

    # 默认路径（与现有流水线一致：raw-config 位于 temp/ 下）
    modifiers_src = project_root / "raw-config" / "modifiers" / "baoshi_modifiers.yml"
    gem_stone_src = project_root / "raw-config" / "item" / "gem_stone.yml"
    dst = project_root / "content" / "gallery" / "_data" / "gem"

    # 支持命令行覆盖：
    #   python generate_gem_gallery.py [modifiers.yml] [gem_stone.yml] [dst]
    if len(sys.argv) >= 2:
        modifiers_src = Path(sys.argv[1])
    if len(sys.argv) >= 3:
        gem_stone_src = Path(sys.argv[2])
    if len(sys.argv) >= 4:
        dst = Path(sys.argv[3])

    logger.info("修饰符源文件: %s", modifiers_src)
    logger.info("宝石源文件:   %s", gem_stone_src)
    logger.info("目标目录:     %s", dst)

    try:
        n = generate(modifiers_src, gem_stone_src, dst)
        print(f"\n完成：成功生成 {n} 个宝石文件 → {dst}")
    except Exception as e:
        logger.error("执行失败: %s", e)
        sys.exit(1)


if __name__ == "__main__":
    main()