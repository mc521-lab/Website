import { generateGui } from "@/lib/iagui/generate-gui";
import Image from "next/image";

export const Root = generateGui({
    id: "uigh",
    name: "公会系统 / 主菜单",
    descriptions: [
        "提升公会等级需要 公会资金 和 公会活跃",
        "升级公会可以提升全部成员的攻击、生命等属性",
        "#emptyline",
        "公会资金 是通过公会成员捐献公会币获得的",
        "公会活跃 是通过公会神石产出或商城等渠道获得的",
        "公会币是 通过公会签到/任务或商城等渠道获得的",
        "#emptyline",
        "这就是 公会币 公会资金 公会活跃 的详细讲解",
    ],
    map: [
        ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
        ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
        ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
        ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
        ["B", "b", "b", "#", "#", "#", "#", "#", "#"],
        ["B", "b", "b", "#", "#", "#", "#", "#", "#"],
    ],
    palette: {
        B: {
            onClick: {
                action: "redirect",
                href: "/wiki/acknowledge/menu?current=uicd",
            },
        },
        b: {
            onClick: {
                action: "navigate",
                to: "uighview",
            },
        },
    },
});

export const View = generateGui({
    id: "uighview",
    name: "公会系统 / 操作面板",
    descriptions: [
        "在这里可以做所有和公会相关的操作",
        "#separator",
        "[公会战] 报名参加公会战",
        "#emptyline",
        "你可以点击对应按钮浏览详情",
    ],
    map: [
        ["a", "a", "a", "a", "a", "b", "b", "b", "b"],
        ["a", "a", "a", "a", "a", "c", "c", "c", "c"],
        ["a", "a", "a", "a", "a", "d", "d", "d", "d"],
        ["a", "a", "a", "a", "a", "e", "e", "e", "e"],
        ["B", "f", "f", "g", "g", "h", "h", "h", "h"],
        ["B", "j", "j", "k", "k", "#", "#", "m", "m"],
    ],
    palette: {
        B: {
            onClick: {
                action: "navigate",
                to: "uigh",
            },
        },
        a: {
            onClick: {
                action: "navigate",
                to: "uighpvp",
            },
        },
        b: {
            onClick: {
                action: "navigate",
                to: "uightitle",
            },
        },
        c: {
            onClick: {
                action: "navigate",
                to: "uighbank",
            },
        },
        d: {
            onClick: {
                action: "navigate",
                to: "uighshop",
            },
        },
        e: {
            onClick: {
                action: "navigate",
                to: "uighqd",
            },
        },
        f: {
            onClick: {
                action: "navigate",
                to: "uighsj",
            },
        },
        g: {
            onClick: {
                action: "navigate",
                to: "uighstone",
            },
        },
        h: {
            onClick: {
                action: "navigate",
                to: "uightask",
            },
        },
        j: {
            onClick: {
                action: "navigate",
                to: "uightc",
            },
        },
        k: {
            onClick: {
                action: "navigate",
                to: "uighnember",
            },
        },
        m: {
            onClick: {
                action: "navigate",
                to: "uighnotice",
            },
        },
    },
});

export const Pvp = generateGui({
    id: "uighpvp",
    name: "公会系统 / 公会战",
    descriptions: [
        "公会战是一项集体战斗，需要公会成员齐心协力，面对其他公会的挑战",
        "非比赛日可进行报名",
        "#separator",
        "[赛季公会战]",
        "每周六 19:00 全服开战",
        "超多奖励 拿到手软",
        "#separator",
        "[匹配公会战]",
        "匹配公会战-公平模式，统一属性，统一装备",
        "随时随地即可战斗，胜利方可获得贡献奖励，每日最多获得 1 次奖励",
    ],
    map: [
        ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
        ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
        ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
        ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
        ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
        ["#", "#", "#", "#", "B", "#", "#", "#", "#"],
    ],
    palette: {
        B: {
            onClick: {
                action: "navigate",
                to: "uighview",
            },
        },
    },
});

export const Sj = generateGui({
    id: "uighsj",
    name: "公会系统 / 管理公会",
    descriptions: [],
    map: [
        ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
        ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
        ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
        ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
        ["B", "#", "#", "#", "#", "#", "#", "#", "#"],
        ["B", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    palette: {
        B: {
            onClick: {
                action: "navigate",
                to: "uighview",
            },
        },
    },
});

export const Stone = generateGui({
    id: "uighstone",
    name: "公会系统 / 神石升级",
    descriptions: [],
    map: [
        ["#", "#", "#", "#", "#", "a", "b", "c", "#"],
        ["#", "#", "#", "#", "#", "d", "#", "#", "#"],
        ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
        ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
        ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
        ["#", "#", "#", "#", "B", "#", "#", "#", "#"],
    ],
    palette: {
        B: {
            onClick: {
                action: "navigate",
                to: "uighview",
            },
        },
        a: {
            content: <Image src="/wiki/menuitem/体力Buff.png" alt="体力Buff" width={160} height={160} className="raw-image w-[85%]! aspect-square" />
        },
        b: {
            content: <Image src="/wiki/menuitem/法力Buff.png" alt="法力Buff" width={160} height={160} className="raw-image w-[85%]! aspect-square" />
        },
        c: {
            content: <Image src="/wiki/menuitem/攻击Buff.png" alt="攻击Buff" width={160} height={160} className="raw-image w-[85%]! aspect-square" />
        },
        d: {
            content: <Image src="/wiki/menuitem/生命Buff.png" alt="生命Buff" width={160} height={160} className="raw-image w-[85%]! aspect-square" />
        }
    },
});
