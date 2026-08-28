"""宠物相关 gallery 生成器（宠物/坐骑）。"""

from __future__ import annotations

import re
from pathlib import Path
from typing import Any
import yaml

name = "pet"
help = "从 MCPets/Pets 和 MMOItems/item/material.yml 生成宠物 gallery 数据"

SKILL_RE = re.compile(r"(?:Skill|skill)\s*[:：]\s*([\w.-]+)")
MAX_LEVEL_RE = re.compile(r"^Lv(\d+)$", re.IGNORECASE)
VARIANT_KEY_RE = re.compile(r"^(pifu\d+|skin\d+|variant\d+|v\d+)$", re.IGNORECASE)
FRAGMENT_KEY_RE = re.compile(r"^CW_[A-Z0-9_]+$")

COLOR_TAG_RE = re.compile(
    r"</?gradient[^>]*>|"
    r"<#?[A-Fa-f0-9]{6}>|"
    r"&[0-9a-fk-or]|"
    r"<st>|</st>|"
    r"&[a-z]"
)

COLOR_TAG_RE_2 = re.compile(r"\x1b\[[0-9;]*m")


def strip_formatting(text: str) -> str:
    if not text:
        return ""
    s = COLOR_TAG_RE.sub("", str(text))
    s = COLOR_TAG_RE_2.sub("", s)
    s = re.sub(r"&[0-9a-fk-or]", "", s)
    return s.strip()


def clean_name(raw: str) -> str:
    return strip_formatting(raw).strip()


def get_name(base: dict[str, Any], fallback: str) -> str:
    icon = base.get("Icon") or {}
    for key in ("Name", "DisplayName"):
        value = icon.get(key)
        if value:
            name = clean_name(str(value))
            if name:
                return name
    value = base.get("Id") or fallback
    return clean_name(str(value))


def extract_level_value(level: dict[str, Any], keys: tuple[str, ...]) -> Any:
    for key in keys:
        if key in level and level[key] is not None:
            return level[key]
    return None


def parse_levels(levels: Any) -> tuple[int | None, list[dict[str, Any]]]:
    if not isinstance(levels, dict):
        return None, []
    parsed: list[dict[str, Any]] = []
    max_level = None
    for key, value in levels.items():
        if not isinstance(value, dict):
            continue
        m = MAX_LEVEL_RE.match(str(key))
        level_no = int(m.group(1)) if m else None
        if level_no is not None:
            max_level = max(max_level or 0, level_no)
        skill = extract_level_value(value, ("Announcement", "Skill"))
        if isinstance(skill, dict):
            skill = skill.get("Skill") or skill.get("skill")
        parsed.append(
            {
                "level": level_no,
                "name": clean_name(str(value.get("Name") or key)),
                "experienceThreshold": value.get("ExperienceThreshold"),
                "maxHealth": value.get("MaxHealth"),
                "regeneration": value.get("Regeneration"),
                "resistanceModifier": value.get("ResistanceModifier"),
                "respawnCooldown": (value.get("Cooldowns") or {}).get("Respawn") if isinstance(value.get("Cooldowns"), dict) else None,
                "skill": clean_name(str(skill)) if skill else None,
            }
        )
    parsed.sort(key=lambda item: item["level"] or 0)
    return max_level, parsed


def parse_skills(base: dict[str, Any], levels: list[dict[str, Any]]) -> list[str]:
    skills: list[str] = []
    seen: set[str] = set()

    def add(value: Any) -> None:
        if not value:
            return
        clean = clean_name(str(value))
        if clean and clean not in seen:
            seen.add(clean)
            skills.append(clean)

    signals = base.get("Signals")
    if isinstance(signals, dict):
        values = signals.get("Values")
        if isinstance(values, list):
            for value in values:
                add(value)
        item = signals.get("Item")
        if isinstance(item, dict):
            add(item.get("Name"))

    for level in levels:
        add(level.get("skill"))

    desc = base.get("Icon", {}).get("Description") if isinstance(base.get("Icon"), dict) else None
    if isinstance(desc, list):
        for line in desc:
            m = SKILL_RE.search(strip_formatting(str(line)))
            if m:
                add(m.group(1))

    return skills


def parse_variants(base: dict[str, Any]) -> list[str]:
    skins = base.get("Skins")
    if not isinstance(skins, dict):
        return []
    variants: list[str] = []
    for key, value in skins.items():
        if not isinstance(value, dict):
            continue
        if not VARIANT_KEY_RE.match(str(key)) and key != "pifu1":
            continue
        icon = value.get("Icon") or {}
        variant_name = None
        if isinstance(icon, dict):
            variant_name = icon.get("DisplayName") or icon.get("Name")
        if not variant_name:
            variant_name = value.get("Permission") or key
        cleaned = strip_formatting(str(variant_name)).replace(" ", "")
        cleaned = re.sub(r"\((?:本体|炫彩|皮肤|默认)\)$", "", cleaned)
        cleaned = cleaned.replace("(本体)", "").replace("(炫彩)", "").replace("(皮肤)", "").replace("(默认)", "")
        cleaned = cleaned.strip()
        if cleaned:
            variants.append(cleaned)
    return [variant for variant in variants if variant]


def build_pet_fragment_content(path: Path, base: dict[str, Any]) -> dict[str, Any]:
    name = get_name(base, path.stem)
    return {
        "basic": {
            "name": name,
        },
        "filter": {
            "type": "fragment",
        },
    }


def build_pet_content(path: Path, base: dict[str, Any]) -> dict[str, Any]:
    name = get_name(base, path.stem)
    levels_raw = base.get("Levels")
    max_level, levels = parse_levels(levels_raw)
    content: dict[str, Any] = {
        "basic": {
            "name": name,
        },
    }
    if max_level is not None:
        content["basic"]["maxLevel"] = max_level
    effects = {
        "ExperienceThreshold": [level.get("experienceThreshold") for level in levels],
        "MaxHealth": [level.get("maxHealth") for level in levels],
        "Regeneration": [level.get("regeneration") for level in levels],
        "ResistanceModifier": [level.get("resistanceModifier") for level in levels],
        "RespawnCooldown": [level.get("respawnCooldown") for level in levels],
    }
    content["effects"] = effects
    variants = parse_variants(base)
    if variants:
        content["variants"] = variants
    return content


def build_material_fragment_content(key: str, base: dict[str, Any]) -> dict[str, Any]:
    name = clean_name(str(base.get("name") or key))
    if not name:
        name = key
    lore = base.get("lore")
    if not isinstance(lore, list):
        lore = []
    cleaned = [strip_formatting(str(line)) for line in lore]
    usage: list[str] = []
    for line in cleaned:
        if not line or line.startswith("品质:") or line.startswith("类型:"):
            continue
        if "集齐" in line:
            line = line.replace(name, "")
            line += "碎片"
            line = line.strip()
            if line and line not in usage:
                usage.append(line)
            continue
        if "即可兑换宠物" in line:
            line = line.replace("即可兑换宠物-", "兑换宠物")
            line = line.strip()
            if line and line not in usage:
                usage[0] += line
    return {
        "basic": {
            "name": name,
        },
        "usage": usage,
        "filter": {
            "type": "fragment",
        },
    }


def run(src: Path, dst: Path) -> int:
    """从 MCPets/Pets 和 MMOItems/item/material.yml 生成宠物 gallery 文件。"""
    petsrc = src / "MCPets" / "Pets"
    if not petsrc.exists():
        raise FileNotFoundError(f"源路径不存在: {petsrc}")
    dst_pet = dst / "pet"
    dst_pet.mkdir(parents=True, exist_ok=True)
    dst_fragment = dst_pet / "fragment"
    dst_fragment.mkdir(parents=True, exist_ok=True)
    count = 0
    if petsrc.exists():
        files = sorted(petsrc.rglob("*.yml"))
        for file in files:
            if "定制" in file.parts:
                continue
            if "宠物" not in file.parts:
                continue
            with file.open("r", encoding="utf-8") as f:
                data: Any = yaml.safe_load(f)
            if not isinstance(data, dict):
                continue
            content = build_pet_content(file, data)
            content.setdefault("filter", {})["type"] = "pet"
            out_path = dst_pet / f"{file.stem.lower()}.yml"
            out_path.parent.mkdir(parents=True, exist_ok=True)
            with out_path.open("w", encoding="utf-8") as f:
                yaml.dump(content, f, allow_unicode=True, default_flow_style=False, sort_keys=False, width=120)
            count += 1

    material_src = src / "MMOItems" / "item" / "material.yml"
    if material_src.is_file():
        with material_src.open("r", encoding="utf-8") as f:
            material_data: Any = yaml.safe_load(f)
        if isinstance(material_data, dict):
            for key, item in material_data.items():
                if not FRAGMENT_KEY_RE.match(str(key)):
                    continue
                if not isinstance(item, dict) or not isinstance(item.get("base"), dict):
                    continue
                base = item["base"]
                content = build_material_fragment_content(str(key), base)
                out_path = dst_fragment / f"{str(key).lower()}.yml"
                out_path.parent.mkdir(parents=True, exist_ok=True)
                with out_path.open("w", encoding="utf-8") as f:
                    yaml.dump(content, f, allow_unicode=True, default_flow_style=False, sort_keys=False, width=120)
                count += 1

    return count
