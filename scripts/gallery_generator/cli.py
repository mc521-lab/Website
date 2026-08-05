"""Gallery Generator CLI — 统一入口。"""

from __future__ import annotations

import argparse
import logging
import sys
from pathlib import Path
from typing import Any

from . import generators, __version__

logger = logging.getLogger(__name__)

# ── 项目根目录发现 ──────────────────────────────────────────────
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent

DEFAULT_PATHS: dict[str, dict[str, Any]] = {
    "items": {
        "src": PROJECT_ROOT / "raw-config" / "MMOItems" / "item" / "material.yml",
        "dst": PROJECT_ROOT / "content" / "gallery" / "_data" / "items",
    },
    "armor": {
        "src": PROJECT_ROOT / "raw-config" / "MMOItems" / "item" / "armor.yml",
        "dst": PROJECT_ROOT / "content" / "gallery" / "_data" / "equipment" / "armor",
    },
    "deco": {
        "src": PROJECT_ROOT / "raw-config" / "Lists",
        "dst": PROJECT_ROOT / "content" / "gallery" / "_data" / "deco",
    },
    "gem": {
        "src": PROJECT_ROOT / "raw-config" / "MMOItems" / "item" / "gem_stone.yml",
        "modifiers": PROJECT_ROOT / "raw-config" / "modifiers" / "baoshi_modifiers.yml",
        "dst": PROJECT_ROOT / "content" / "gallery" / "_data" / "equipment" / "gem",
    },
    "jewelry": {
        "src": PROJECT_ROOT / "raw-config" / "MMOItems" / "item",
        "modifiers": PROJECT_ROOT / "raw-config" / "modifiers" / "shipin_modifiers.yml",
        "dst": PROJECT_ROOT / "content" / "gallery" / "_data" / "equipment" / "jewelries",
    },
    "pet": {
        "src": PROJECT_ROOT / "raw-config" / "MMOItems" / "item" / "material.yml",
        "skin_src": PROJECT_ROOT / "raw-config" / "Lists" / "pet-skin-names.txt",
        "dst": PROJECT_ROOT / "content" / "gallery" / "_data" / "pet",
    },
    "sdv": {
        "src": PROJECT_ROOT / "raw-config" / "Lists",
        "dst": PROJECT_ROOT / "content" / "gallery" / "_data" / "sdv",
    },
    "skin": {
        "src": PROJECT_ROOT / "raw-config" / "Lists",
        "dst": PROJECT_ROOT / "content" / "gallery" / "_data" / "skin",
    },
    "sword": {
        "src": PROJECT_ROOT / "raw-config" / "MMOItems" / "item" / "sword.yml",
        "dst": PROJECT_ROOT / "content" / "gallery" / "_data" / "equipment" / "sword",
    },
}

# 生成器注册表
GENERATORS: dict[str, Any] = {
    "items": generators.items,
    "armor": generators.armor,
    "deco": generators.deco,
    "gem": generators.gem,
    "jewelry": generators.jewelry,
    "pet": generators.pet,
    "sdv": generators.sdv,
    "skin": generators.skin,
    "sword": generators.sword,
}

COMMANDS = {
    "items": "道具/材料 gallery",
    "armor": "护甲 gallery",
    "deco": "装饰类 gallery（家具/墙贴/玩偶）",
    "gem": "宝石 gallery",
    "jewelry": "饰品 gallery",
    "pet": "宠物 gallery（宠食/碎片/皮肤）",
    "sdv": "星露谷 gallery（种子/工具/作物）",
    "skin": "皮肤 gallery（时装/武器/工具）",
    "sword": "武器 gallery",
}


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="gallery-generator",
        description="Gallery 数据生成器 — 从 raw-config 生成 gallery YAML 数据文件",
    )
    parser.add_argument("--version", action="version", version=f"%(prog)s {__version__}")

    sub = parser.add_subparsers(dest="command", metavar="command")

    # 每个生成器作为子命令
    for name, desc in COMMANDS.items():
        p = sub.add_parser(name, help=desc)
        p.add_argument("--src", "-s", help="源文件/目录路径（默认自动检测）")
        p.add_argument("--dst", "-d", help="目标目录路径（默认自动检测）")

    # all 命令
    p_all = sub.add_parser("all", help="运行所有生成器")
    p_all.add_argument("--src", "-s", help="源文件/目录路径（默认自动检测）")
    p_all.add_argument("--dst", "-d", help="目标目录路径（默认自动检测）")

    # menu 命令
    sub.add_parser("menu", help="交互式菜单选择")

    return parser


def run_single(name: str, src: str | None, dst: str | None) -> int:
    """运行单个生成器。"""
    mod = GENERATORS[name]
    cfg = DEFAULT_PATHS[name].copy()

    src_path = Path(src) if src else cfg["src"]
    dst_path = Path(dst) if dst else cfg["dst"]

    kwargs: dict[str, Any] = {}
    if "modifiers" in cfg:
        kwargs["modifiers_src"] = cfg["modifiers"]
    if "skin_src" in cfg:
        kwargs["skin_src"] = cfg["skin_src"]

    logger.info("运行 %s: src=%s, dst=%s", name, src_path, dst_path)
    return mod.run(src_path, dst_path, **kwargs)


def cmd_all(src: str | None, dst: str | None) -> int:
    """运行所有生成器。"""
    total = 0
    for name in GENERATORS:
        try:
            n = run_single(name, src, dst)
            logger.info("%s: 完成 %d 个文件", name, n)
            total += n
        except Exception as e:
            logger.error("%s: 失败 - %s", name, e)
    return total


def cmd_menu() -> int:
    """交互式菜单。"""
    names = list(GENERATORS.keys())
    print("\n" + "=" * 50)
    print("  Gallery 数据生成器")
    print("=" * 50)
    for i, name in enumerate(names, 1):
        desc = COMMANDS[name]
        print(f"  {i:2d}. {name:10s} - {desc}")
    print(f"  {len(names)+1:2d}. all          - 运行所有生成器")
    print(f"  {len(names)+2:2d}. 退出")
    print("=" * 50)

    while True:
        try:
            choice = input("\n请选择 [1-{}]: ".format(len(names) + 2)).strip()
            if not choice:
                continue
            idx = int(choice)
            if idx == len(names) + 1:
                total = cmd_all(None, None)
                print(f"\n全部完成：共生成 {total} 个文件")
                return 0
            elif idx == len(names) + 2:
                print("再见！")
                return 0
            elif 1 <= idx <= len(names):
                name = names[idx - 1]
                n = run_single(name, None, None)
                print(f"\n完成：{name} 生成 {n} 个文件")
                return 0
            else:
                print("无效选择，请重试。")
        except (ValueError, IndexError):
            print("请输入有效数字。")
        except (EOFError, KeyboardInterrupt):
            print("\n再见！")
            return 0


def main(argv: list[str] | None = None) -> int:
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s [%(levelname)s] %(message)s",
        datefmt="%H:%M:%S",
    )

    parser = build_parser()
    args = parser.parse_args(argv)

    if args.command is None or args.command == "menu":
        return cmd_menu()
    elif args.command == "all":
        total = cmd_all(args.src, args.dst)
        print(f"\n全部完成：共生成 {total} 个文件")
        return 0
    elif args.command in GENERATORS:
        n = run_single(args.command, args.src, args.dst)
        print(f"\n完成：{args.command} 生成 {n} 个文件")
        return 0
    else:
        parser.print_help()
        return 1


if __name__ == "__main__":
    sys.exit(main())