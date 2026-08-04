#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
一键脚本：从 raw-config/material.yml 提取道具/材料等数据，
转换为 gallery 所需格式，并写入 content/gallery/_data/items/{类型}/{名字}.yml

输出路径规则：按 lore 中「类型」字段映射后写入分层目录
  例：TIXING（类型=道具）→ items/prop/体型卡-体验版.yml

类型映射：
  道具 → prop
  材料 → material
  货币 → currency
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

TYPE_MAP: dict[str, str] = {
    "道具": "prop",
    "材料": "material",
    "货币": "currency",
}

# 从 lore 行中提取「类型: xxx」
TYPE_RE = re.compile(
    r"类型:\s*(?:<#?[A-Fa-f0-9]{6}>)?\s*([^\s<#&]+)"
)

# 颜色 / 格式标签（MiniMessage 风格 + 传统 & 代码）
COLOR_TAG_RE = re.compile(
    r"</?gradient[^>]*>|"
    r"<#?[A-Fa-f0-9]{6}>|"
    r"&[0-9a-fk-or]|"
    r"<st>|</st>|"
    r"&[a-z]"
)

# 纯装饰分隔线
SEPARATOR_RE = re.compile(r"^[\s━─—–-]+$")

# 时间相关行
TIME_LIMIT_RE = re.compile(
    r"(?:有效使用期限|有效时间|有效期限)\s*[:：]\s*(.+)$"
)

# 「用途:」前缀
USAGE_PREFIX_RE = re.compile(r"^用途\s*[:：]\s*")


def strip_formatting(text: str) -> str:
    """去掉所有颜色与格式标签，返回纯文本并去掉首尾空白。"""
    if not text:
        return ""
    s = COLOR_TAG_RE.sub("", str(text))
    # 去掉残留的 & 代码片段
    s = re.sub(r"&[0-9a-fk-or]", "", s)
    return s.strip()


def strip_gradient(name: str) -> str:
    """去掉名称中的 gradient / 颜色标签。"""
    return strip_formatting(name)


def extract_type(lore: list[Any]) -> str | None:
    """从 lore 列表中解析类型中文名（道具/宠食/材料/货币）。"""
    for line in lore:
        m = TYPE_RE.search(str(line))
        if m:
            return m.group(1).strip()
    return None


def parse_time_limit(base: dict[str, Any], cleaned_lines: list[str]) -> list[str]:
    """
    解析使用期限。
    优先使用 base 中的 time-limit 字段，否则从 lore 中匹配。
    输出格式统一为「有效时间：X」。
    """
    limits: list[str] = []

    # 1. 字段 time-limit（如 12h / 30d）
    raw_tl = base.get("time-limit")
    if raw_tl is not None:
        s = str(raw_tl).strip().lower()
        if s.endswith("h"):
            try:
                hours = int(float(s[:-1]))
                limits.append(f"有效时间：{hours} 小时")
            except ValueError:
                limits.append(f"有效时间：{s}")
        elif s.endswith("d"):
            try:
                days = int(float(s[:-1]))
                limits.append(f"有效时间：{days} 天")
            except ValueError:
                limits.append(f"有效时间：{s}")
        else:
            limits.append(f"有效时间：{s}")
        return limits

    # 2. lore 中的时间行
    for line in cleaned_lines:
        m = TIME_LIMIT_RE.search(line)
        if m:
            val = m.group(1).strip()
            # 简单规范化：12小时 → 12 小时
            val = re.sub(r"(\d+)\s*小时", r"\1 小时", val)
            val = re.sub(r"(\d+)\s*天", r"\1 天", val)
            limits.append(f"有效时间：{val}")
            break

    return limits


def classify_lore_lines(cleaned_lines: list[str]) -> tuple[list[str], list[str]]:
    """
    将已清洗的 lore 行分类为 usage 与 source。

    规则（与示例对齐）：
    - 含「用途:」的行 → usage（去掉前缀）
    - 含「右键使用」的行 → usage
    - 时间相关行已在外部处理，此处跳过
    - 其余有意义描述行 → usage
    - source 当前无可靠来源字段，保留空列表占位（由调用方决定是否写空串）
    """
    usage: list[str] = []
    source: list[str] = []

    skip_patterns = (
        "品质:",
        "类型:",
        "有效使用期限",
        "有效时间",
        "有效期限",
    )

    for line in cleaned_lines:
        if not line or SEPARATOR_RE.match(line):
            continue
        if any(p in line for p in skip_patterns):
            continue

        # 用途行
        if USAGE_PREFIX_RE.match(line):
            content = USAGE_PREFIX_RE.sub("", line).strip()
            if content:
                usage.append(content)
            continue

        # 右键使用等操作提示
        if "右键使用" in line:
            # 去掉可能残留的特殊字符前缀
            clean = re.sub(r"^[^\u4e00-\u9fff]*", "", line).strip()
            if clean:
                usage.append(clean)
            continue

        # 权限提示可视为限制，此处仍放入 usage 以保留信息；
        # 若希望与示例完全一致可额外过滤「需要拥有指定权限」
        if line == "需要拥有指定权限":
            continue

        # 其余描述行归入 usage
        usage.append(line)

    return usage, source


def transform_item(
    key: str, base: dict[str, Any]
) -> tuple[str, str, dict[str, Any]] | None:
    """
    将单条 material 条目转换为 gallery 格式。

    返回 (类型目录名, 文件名用名字, 内容字典)；无法解析类型时返回 None。
    """
    lore_raw = base.get("lore") or []
    if not isinstance(lore_raw, list):
        lore_raw = []

    type_cn = extract_type(lore_raw)
    if not type_cn or type_cn not in TYPE_MAP:
        logger.warning("跳过无法识别类型的键: %s (type=%s)", key, type_cn)
        return None

    type_dir = TYPE_MAP[type_cn]

    # ---- basic ----
    name = strip_gradient(str(base.get("name", key)))
    if not name:
        name = key

    basic: dict[str, Any] = {
        "name": name,
    }

    # ---- 清洗 lore ----
    cleaned: list[str] = [strip_formatting(str(ln)) for ln in lore_raw]

    # ---- limit ----
    limit = parse_time_limit(base, cleaned)

    # ---- usage / source ----
    usage, source = classify_lore_lines(cleaned)

    # 与示例保持字段齐全：即使为空也写出 key
    result: dict[str, Any] = {
        "basic": basic,
        "usage": usage if usage else [],
        "source": source if source else [""],
        "limit": limit if limit else [],
    }

    return type_dir, name, result


def safe_filename(name: str) -> str:
    """生成安全的文件名（保留中文，去掉路径非法字符）。"""
    # 替换 Windows/Unix 均敏感的字符
    s = re.sub(r'[\\/:*?"<>|]', "_", name)
    s = s.strip().strip(".")
    return s or "unnamed"


def generate(
    src_path: Path,
    dst_dir: Path,
) -> int:
    """
    读取 material.yml，为每一项生成对应的 gallery yml 文件。

    输出路径：{dst_dir}/{类型}/{名字}.yml

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

        type_dir, name, content = transformed
        fname = key.lower() + ".yml"
        out_path = dst_dir / type_dir / fname
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
    # 用户约定：raw-config/item/material.yml
    src = project_root / "raw-config" / "MMOItems" / "item" / "material.yml"
    dst = project_root / "content" / "gallery" / "_data" / "items"

    # 支持命令行覆盖：python generate_items_gallery.py [src] [dst]
    if len(sys.argv) >= 2:
        src = Path(sys.argv[1])
    if len(sys.argv) >= 3:
        dst = Path(sys.argv[2])

    logger.info("源文件: %s", src)
    logger.info("目标目录: %s", dst)

    try:
        n = generate(src, dst)
        print(f"\n完成：成功生成 {n} 个物品文件 → {dst}")
    except Exception as e:
        logger.error("执行失败: %s", e)
        sys.exit(1)


if __name__ == "__main__":
    main()
