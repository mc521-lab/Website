#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
一键脚本：从 raw-config 下的饰品配置与 shipin_modifiers.yml 提取数据，
转换为 gallery 所需格式，并写入 content/gallery/_data/jewelries/{职业}/{部位}.yml

源文件（位于 temp/raw-config/）：
  sp_jiezhiyou.yml  → 部位 jiezhiyou（右戒）
  sp_jiezhizuo.yml  → 部位 jiezhizuo（左戒）
  sp_mibao.yml      → 部位 mibao（密宝）
  sp_shoutao.yml    → 部位 shoutao（手套）
  sp_shouzhuo.yml   → 部位 shouzhuo（手镯）
  sp_xianglian.yml  → 部位 xianglian（项链）

修饰符定义：temp/raw-config/shipin_modifiers.yml

输出路径示例：
  jewelries/ZHANSHI/jiezhizuo.yml
  jewelries/FASHI/mibao.yml

职业映射（required-class → 目录名）：
  战士 → ZHANSHI
  法师 → FASHI
  刺客 → CIKE
  射手 → SHESHOU
  牧师 → MUSHI

输出结构（精简）：
  basic:
    name: ...
    special: true|false   # 秘宝为 true，其他为 false
  modifiers:
    entries:
      <mod_id>:
        probability: ...
        stats:
          - effect: <attr>
            min: ...
            max: ...
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

SOURCE_FILES: dict[str, str] = {
    "sp_jiezhiyou": "jiezhiyou",
    "sp_jiezhizuo": "jiezhizuo",
    "sp_mibao": "mibao",
    "sp_shoutao": "shoutao",
    "sp_shouzhuo": "shouzhuo",
    "sp_xianglian": "xianglian",
}

JOB_MAP: dict[str, str] = {
    "战士": "ZHANSHI",
    "法师": "FASHI",
    "刺客": "CIKE",
    "射手": "SHESHOU",
    "牧师": "MUSHI",
}

GRADIENT_RE = re.compile(r"</?gradient[^>]*>")

BASIC_ONLY_KEYS = frozenset(
    {
        "material",
        "name",
        "lore",
        "custom-model-data",
        "lore-format",
        "required-class",
        "revision-id",
        "image",
    }
)


def strip_gradient(name: str) -> str:
    """去掉 <gradient:...> / </gradient> 标签，返回纯文本名称。"""
    return GRADIENT_RE.sub("", name).strip()


def _to_number(val: Any) -> int | float | Any:
    """将数值尽量转为 int；若有小数部分则保留 float。"""
    if isinstance(val, bool):
        return val
    if isinstance(val, (int, float)):
        if isinstance(val, float) and val.is_integer():
            return int(val)
        return val
    return val


def load_modifiers(path: Path) -> dict[str, list[dict[str, Any]]]:
    """
    加载 shipin_modifiers.yml，返回修饰符 ID → stats 列表。

    源结构：
      jzyou3:
        stats:
          attack-damage: {min: 2.0, max: 2.5}
          pve-damage:    {min: 1.0, max: 5.0}

    解析为：
      jzyou3 → [
        {"effect": "attack-damage", "min": 2.0, "max": 2.5},
        {"effect": "pve-damage",    "min": 1.0, "max": 5.0},
      ]
    """
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
            logger.warning("修饰符 %s 缺少有效 stats，跳过", mod_id)
            continue

        entries: list[dict[str, Any]] = []
        for attr, rng in stats.items():
            if not isinstance(rng, dict):
                logger.warning(
                    "修饰符 %s 的 stats.%s 不是字典，跳过该属性", mod_id, attr
                )
                continue
            entry: dict[str, Any] = {"effect": str(attr)}
            if "min" in rng:
                entry["min"] = _to_number(rng["min"])
            if "max" in rng:
                entry["max"] = _to_number(rng["max"])
            entries.append(entry)

        if entries:
            result[str(mod_id)] = entries
        else:
            logger.warning("修饰符 %s 未解析出任何有效属性，跳过", mod_id)

    logger.info("已加载 %d 个饰品修饰符定义", len(result))
    return result


def extract_modifier_group(item: dict[str, Any]) -> dict[str, Any] | None:
    """从 modifiers 节点取出 sp_modifiers 组（或第一个组）。"""
    mods_node = item.get("modifiers")
    if not isinstance(mods_node, dict) or not mods_node:
        return None

    if "sp_modifiers" in mods_node and isinstance(mods_node["sp_modifiers"], dict):
        return mods_node["sp_modifiers"]

    group = next(iter(mods_node.values()), None)
    if not isinstance(group, dict):
        return None
    return group


def resolve_job(base: dict[str, Any], item_key: str) -> str | None:
    """从 base.required-class 解析职业目录名。"""
    required = base.get("required-class")
    if not isinstance(required, list) or not required:
        logger.warning("条目 %s 缺少 required-class，跳过", item_key)
        return None

    cls_name = str(required[0]).strip()
    job = JOB_MAP.get(cls_name)
    if job is None:
        logger.warning("条目 %s 未知职业 %r，跳过", item_key, cls_name)
        return None
    return job


def has_special_effects(base: dict[str, Any]) -> bool:
    """base 中是否存在除展示字段外的额外数值属性。"""
    return any(k not in BASIC_ONLY_KEYS for k in base)


def transform_item(
    item_key: str,
    item: dict[str, Any],
    position: str,
    modifier_defs: dict[str, list[dict[str, Any]]],
) -> tuple[str, dict[str, Any]] | None:
    """
    将单件饰品转换为 gallery 格式。

    返回 (职业大写, 内容字典)；无法解析时返回 None。
    """
    base = item.get("base")
    if not isinstance(base, dict):
        logger.warning("base 不是字典，跳过: %s", item_key)
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
                entry: dict[str, Any] = {
                    "probability": _to_number(probability),
                }
                defn = modifier_defs.get(mod_id_str)
                if defn is not None:
                    entry["stats"] = defn
                else:
                    logger.warning(
                        "饰品 %s 引用了未知修饰符 %s，仅保留 probability",
                        item_key,
                        mod_id_str,
                    )
                entries[mod_id_str] = entry

    result: dict[str, Any] = {"basic": basic}
    if entries:
        result["modifiers"] = {"entries": entries}

    return job, result


def generate(
    items_dir: Path,
    modifiers_path: Path,
    dst_dir: Path,
) -> int:
    """
    读取全部饰品源文件与修饰符定义，生成 gallery yml。

    输出路径：{dst_dir}/{职业}/{部位}.yml
    返回成功写入的文件数量。
    """
    modifier_defs = load_modifiers(modifiers_path)

    if not items_dir.is_dir():
        raise FileNotFoundError(f"饰品源目录不存在: {items_dir}")

    dst_dir.mkdir(parents=True, exist_ok=True)

    count = 0
    for src_stem, position in SOURCE_FILES.items():
        src_path = items_dir / f"{src_stem}.yml"
        if not src_path.is_file():
            alt = items_dir.parent / f"{src_stem}.yml"
            if alt.is_file():
                src_path = alt
            else:
                logger.warning("源文件不存在，跳过: %s", src_path)
                continue

        with src_path.open("r", encoding="utf-8") as f:
            data: Any = yaml.safe_load(f)

        if not isinstance(data, dict):
            logger.warning("YAML 根节点不是字典，跳过: %s", src_path)
            continue

        logger.info(
            "处理源文件: %s → 部位 %s（%d 项）",
            src_path.name,
            position,
            len(data),
        )

        for item_key, item in data.items():
            if not isinstance(item, dict) or "base" not in item:
                logger.debug("跳过无 base 节点的键: %s", item_key)
                continue

            transformed = transform_item(item_key, item, position, modifier_defs)
            if transformed is None:
                continue

            job, content = transformed
            out_path = dst_dir / job.lower() / f"{position.lower()}.yml"
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

    project_root = Path(__file__).resolve().parent.parent

    items_src = project_root / "raw-config" / "item"
    modifiers_src = project_root / "raw-config" / "modifiers" / "shipin_modifiers.yml"
    dst = project_root / "content" / "gallery" / "_data" / "equipment" / "jewelries"

    if len(sys.argv) >= 2:
        items_src = Path(sys.argv[1])
    if len(sys.argv) >= 3:
        modifiers_src = Path(sys.argv[2])
    if len(sys.argv) >= 4:
        dst = Path(sys.argv[3])

    logger.info("饰品源目录:   %s", items_src)
    logger.info("修饰符源文件: %s", modifiers_src)
    logger.info("目标目录:     %s", dst)

    try:
        n = generate(items_src, modifiers_src, dst)
        print(f"\n完成：成功生成 {n} 个饰品文件 → {dst}")
    except Exception as e:
        logger.error("执行失败: %s", e)
        sys.exit(1)


if __name__ == "__main__":
    main()
