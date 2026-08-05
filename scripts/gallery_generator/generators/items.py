"""道具/材料 gallery 生成器。"""

from __future__ import annotations

import logging
import re
from pathlib import Path
from typing import Any

from ..utils import write_yaml_with_merge

logger = logging.getLogger(__name__)

name = "items"
help = "从 material.yml 生成道具/材料 gallery 数据"

TYPE_MAP: dict[str, str] = {
    "道具": "prop",
    "材料": "material",
    "货币": "currency",
}

TYPE_RE = re.compile(r"类型:\s*(?:<#?[A-Fa-f0-9]{6}>)?\s*([^\s<#&]+)")

QUALITY_MAP: dict[str, str] = {
    "겨": "D", "걂": "C", "걃": "B", "걄": "A", "걅": "S",
}

QUALITY_RE = re.compile(r"品质: &f([^\s<#&]+)")

COLOR_TAG_RE = re.compile(
    r"</?gradient[^>]*>|"
    r"<#?[A-Fa-f0-9]{6}>|"
    r"&[0-9a-fk-or]|"
    r"<st>|</st>|"
    r"&[a-z]"
)

SEPARATOR_RE = re.compile(r"^[\s━─—–-]+$")
TIME_LIMIT_RE = re.compile(r"(?:有效使用期限|有效时间|有效期限)\s*[:：]\s*(.+)$")
USAGE_PREFIX_RE = re.compile(r"^用途\s*[:：]\s*")


def strip_formatting(text: str) -> str:
    if not text:
        return ""
    s = COLOR_TAG_RE.sub("", str(text))
    s = re.sub(r"&[0-9a-fk-or]", "", s)
    return s.strip()


def strip_gradient(name: str) -> str:
    return strip_formatting(name)


def extract_type(lore: list[Any]) -> str | None:
    for line in lore:
        m = TYPE_RE.search(str(line))
        if m:
            return m.group(1).strip()
    return None


def extract_quality(lore: list[Any]) -> str | None:
    for line in lore:
        m = QUALITY_RE.search(str(line))
        if m:
            return m.group(1).strip()
    return None


def parse_time_limit(base: dict[str, Any], cleaned_lines: list[str]) -> list[str]:
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
    usage: list[str] = []
    source: list[str] = []
    skip_patterns = ("品质:", "类型:", "有效使用期限", "有效时间", "有效期限")
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


def transform_item(key: str, base: dict[str, Any]) -> tuple[str, str, dict[str, Any]] | None:
    lore_raw = base.get("lore") or []
    if not isinstance(lore_raw, list):
        lore_raw = []
    type_cn = extract_type(lore_raw)
    if not type_cn or type_cn not in TYPE_MAP:
        logger.warning("跳过无法识别类型的键: %s (type=%s)", key, type_cn)
        return None
    quality_cn = extract_quality(lore_raw)
    if not quality_cn or quality_cn not in QUALITY_MAP:
        logger.warning("跳过无法识别品质的键: %s (quality=%s)", key, quality_cn)
        return None
    type_dir = TYPE_MAP[type_cn]
    name = strip_gradient(str(base.get("name", key)))
    if not name:
        name = key
    basic: dict[str, Any] = {"name": name, "quality": QUALITY_MAP[quality_cn]}
    cleaned: list[str] = [strip_formatting(str(ln)) for ln in lore_raw]
    limit = parse_time_limit(base, cleaned)
    usage, source = classify_lore_lines(cleaned)
    result: dict[str, Any] = {
        "basic": basic,
        "usage": usage if usage else [],
        "source": source if source else [""],
        "limit": limit if limit else [],
    }
    return type_dir, name, result


def run(src: Path, dst: Path) -> int:
    """从 material.yml 生成 items gallery 文件。"""
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
        if "碎片" in base.get("name", ""):
            continue
        transformed = transform_item(key, base)
        if transformed is None:
            continue
        type_dir, name, content = transformed
        fname = key.lower() + ".yml"
        out_path = dst / type_dir / fname
        out_path.parent.mkdir(parents=True, exist_ok=True)
        write_yaml_with_merge(out_path, content)
        logger.info("已写入: %s", out_path.relative_to(dst))
        count += 1
    return count