"""Gallery 生成器的共享工具函数。"""

from __future__ import annotations

from pathlib import Path
from typing import Any

import yaml


def merge_with_existing(
    new_content: dict[str, Any], existing_content: dict[str, Any]
) -> dict[str, Any]:
    """
    将新生成的内容与已存在的输出文件内容合并，实现增量更新。

    规则：
    1. 对于在两个字典中都存在的字段：
       - 若都是字典 → 递归合并
       - 若都是列表 → 若列表不同则保留现有（视为手动修改），否则使用新值
       - 其他标量 → 使用新值（源文件权威）
    2. 仅在现有内容中存在的字段 → 保留（手动添加）
    3. 仅在新内容中存在的字段 → 添加（源文件新增）
    """
    result: dict[str, Any] = {}

    for key in new_content:
        new_val = new_content[key]
        if key in existing_content:
            existing_val = existing_content[key]
            if isinstance(new_val, dict) and isinstance(existing_val, dict):
                result[key] = merge_with_existing(new_val, existing_val)
            elif isinstance(new_val, list) and isinstance(existing_val, list):
                result[key] = existing_val if new_val != existing_val else new_val
            else:
                result[key] = new_val
        else:
            result[key] = new_val

    for key in existing_content:
        if key not in new_content:
            result[key] = existing_content[key]

    return result


def write_yaml_with_merge(out_path: Path, new_content: dict[str, Any]) -> None:
    """
    写入 YAML 文件，如果文件已存在则进行增量合并。
    """
    existing_content: dict[str, Any] = {}

    if out_path.is_file():
        with out_path.open("r", encoding="utf-8") as f:
            loaded = yaml.safe_load(f)
            if isinstance(loaded, dict):
                existing_content = loaded

    merged = merge_with_existing(new_content, existing_content) if existing_content else new_content

    out_path.parent.mkdir(parents=True, exist_ok=True)
    with out_path.open("w", encoding="utf-8") as f:
        yaml.dump(
            merged,
            f,
            allow_unicode=True,
            default_flow_style=False,
            sort_keys=False,
            width=120,
        )