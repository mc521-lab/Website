#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
一键脚本：从 raw-config/material.yml 提取宠物相关数据，
转换为 gallery 所需格式，并写入 content/gallery/_data/pet/{类型}/{名字}.yml

输出路径规则：
  - 类型=宠食 → pet/food/{key}.yml
  - 类型=材料 且名字含"碎片" → pet/fragment/{key}.yml
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
# 常量
# ---------------------------------------------------------------------------

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
    s = re.sub(r"&[0-9a-fk-or]", "", s)
    return s.strip()


def strip_gradient(name: str) -> str:
    """去掉名称中的 gradient / 颜色标签。"""
    return strip_formatting(name)


def extract_type(lore: list[Any]) -> str | None:
    """从 lore 列表中解析类型中文名。"""
    for line in lore:
        m = TYPE_RE.search(str(line))
        if m:
            return m.group(1).strip()
    return None


def parse_time_limit(base: dict[str, Any], cleaned_lines: list[str]) -> list[str]:
    """解析使用期限。"""
    limits: list[str] = []

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

    for line in cleaned_lines:
        m = TIME_LIMIT_RE.search(line)
        if m:
            val = m.group(1).strip()
            val = re.sub(r"(\d+)\s*小时", r"\1 小时", val)
            val = re.sub(r"(\d+)\s*天", r"\1 天", val)
            limits.append(f"有效时间：{val}")
            break

    return limits


def classify_lore_lines(cleaned_lines: list[str]) -> tuple[list[str], list[str]]:
    """将已清洗的 lore 行分类为 usage 与 source。"""
    usage: list[str] = []
    source: list[str] = []

    skip_patterns = (
        "品质:", "类型:", "有效使用期限", "有效时间", "有效期限",
    )

    for line in cleaned_lines:
        if not line or SEPARATOR_RE.match(line):
            continue
        if any(p in line for p in skip_patterns):
            continue

        if USAGE_PREFIX_RE.match(line):
            content = USAGE_PREFIX_RE.sub("", line).strip()
            if content:
                usage.append(content)
            continue

        if "右键使用" in line:
            clean = re.sub(r"^[^\u4e00-\u9fff]*", "", line).strip()
            if clean:
                usage.append(clean)
            continue

        if line == "需要拥有指定权限":
            continue

        usage.append(line)

    return usage, source


def transform_item(
    key: str, base: dict[str, Any]
) -> tuple[str, str, dict[str, Any]] | None:
    """
    将单条 material 条目转换为 gallery 格式。

    返回 (类型目录名, 文件名用名字, 内容字典)。
    仅处理：
      - 类型为「宠食」→ food
      - 类型为「材料」且名字含「碎片」→ fragment
    """
    lore_raw = base.get("lore") or []
    if not isinstance(lore_raw, list):
        lore_raw = []

    type_cn = extract_type(lore_raw)
    if not type_cn:
        return None

    # ---- basic ----
    name = strip_gradient(str(base.get("name", key)))
    if not name:
        name = key

    # 确定目标目录
    if type_cn == "宠食":
        type_dir = "food"
    elif type_cn == "材料" and "碎片" in name:
        type_dir = "fragment"
    else:
        return None

    basic: dict[str, Any] = {"name": name}

    # ---- 清洗 lore ----
    cleaned: list[str] = [strip_formatting(str(ln)) for ln in lore_raw]

    # ---- limit ----
    limit = parse_time_limit(base, cleaned)

    # ---- usage / source ----
    usage, source = classify_lore_lines(cleaned)

    result: dict[str, Any] = {
        "basic": basic,
        "usage": usage if usage else [],
        "source": source if source else [""],
        "limit": limit if limit else [],
    }

    return type_dir, name, result


# ---------------------------------------------------------------------------
# 皮肤样板值
# ---------------------------------------------------------------------------
SKIN_TEMPLATE: dict[str, Any] = {
    "usage": ["更换宠物皮肤"],
    "source": ["主城 > 宠物皮肤宝箱 抽奖"],
}


def generate_skin(
    src_path: Path,
    dst_dir: Path,
) -> int:
    """
    从 pet-skin-names.txt 加载宠物皮肤名称列表，生成对应的 gallery yml 文件。

    输出路径：{dst_dir}/{n}.yml  (n 从 1 开始编号)
    """
    if not src_path.is_file():
        raise FileNotFoundError(f"源文件不存在: {src_path}")

    with src_path.open("r", encoding="utf-8") as f:
        lines = [ln.strip() for ln in f if ln.strip()]

    dst_dir.mkdir(parents=True, exist_ok=True)

    count = 0
    for idx, line in enumerate(lines, start=1):
        # 去掉 .png 后缀
        name = re.sub(r"\.png$", "", line.strip())
        if not name:
            continue

        content: dict[str, Any] = {
            "basic": {"name": name},
            **SKIN_TEMPLATE,
        }

        fname = f"{idx:02d}.yml"
        out_path = dst_dir / fname
        with out_path.open("w", encoding="utf-8") as f:
            yaml.dump(
                content,
                f,
                allow_unicode=True,
                default_flow_style=False,
                sort_keys=False,
                width=120,
            )

        logger.info("已写入: %s", out_path.relative_to(dst_dir.parent))
        count += 1

    return count


def generate(
    src_path: Path,
    dst_dir: Path,
) -> int:
    """
    读取 material.yml，为每一项宠物相关数据生成对应的 gallery yml 文件。

    输出路径：{dst_dir}/{类型}/{key}.yml
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
            continue

        base = item["base"]
        if not isinstance(base, dict):
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

    project_root = Path(__file__).resolve().parent.parent

    # ---- 原有解析：从 material.yml 生成 food / fragment ----
    src = project_root / "raw-config" / "MMOItems" / "item" / "material.yml"
    dst = project_root / "content" / "gallery" / "_data" / "pet"

    if len(sys.argv) >= 2:
        src = Path(sys.argv[1])
    if len(sys.argv) >= 3:
        dst = Path(sys.argv[2])

    logger.info("源文件: %s", src)
    logger.info("目标目录: %s", dst)

    try:
        n = generate(src, dst)
        print(f"\n完成：成功生成 {n} 个宠物物品文件 → {dst}")
    except Exception as e:
        logger.error("执行失败: %s", e)
        sys.exit(1)

    # ---- 皮肤解析：从 pet-skin-names.txt 生成 skin ----
    skin_src = project_root / "raw-config" / "Lists" / "pet-skin-names.txt"
    skin_dst = dst / "skin"

    logger.info("皮肤源文件: %s", skin_src)
    logger.info("皮肤目标目录: %s", skin_dst)

    try:
        n2 = generate_skin(skin_src, skin_dst)
        print(f"完成：成功生成 {n2} 个宠物皮肤文件 → {skin_dst}")
    except Exception as e:
        logger.error("皮肤生成失败: %s", e)
        sys.exit(1)


if __name__ == "__main__":
    main()