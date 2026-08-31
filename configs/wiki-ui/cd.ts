import { generateGui } from "@/lib/iagui/generate-gui";
import { toast } from "sonner";

export const P1 = generateGui({
    id: "uicd",
    name: "主菜单 / 第一页",
    descriptions: [
        "这是服务器主菜单的第一页",
        "你可以通过最右侧的下半部分切换到主菜单的第二页",
        "#emptyline",
        "在这一页上，你可以打开服务器的各个系统的子菜单，",
        "包括：公会系统、大区传送、水晶商城、全球市场、玩家地标 和 职业系统",
        "#emptyline",
        "下方的八个小功能按钮分别是",
        "会员功能、表情/动作、发送红包、自动整理、附魔书预览、宠物/坐骑、设置小家、个人仓库",
        "#emptyline",
        "如果你忘记了 Wiki 的网址，不妨回到菜单看看，点击最上方中心的按钮即可再次获取链接",
    ],
    map: [
        ["a", "a", "#", "c", "c", "#", "#", "#", "U"],
        ["a", "a", "#", "C", "C", "#", "#", "#", "U"],
        ["a", "a", "#", "d", "d", "#", "#", "#", "U"],
        ["#", "#", "#", "d", "d", "#", "#", "#", "D"],
        ["#", "#", "#", "#", "#", "#", "#", "#", "D"],
        ["#", "#", "#", "#", "#", "#", "#", "#", "D"],
    ],
    palette: {
        a: {
            onClick: {
                action: "redirect",
                href: "/wiki/playerguild/info?current=uigh",
            },
        },
        c: {
            onClick: {
                action: "custom",
                fn: () => toast.message("笨蛋，你现在就在看 Wiki！"),
            },
        },
        d: {
            onClick: {
                action: "navigate",
                to: "uics_zc",
            },
        },
        U: {
            onClick: {
                action: "navigate",
                to: "uicd",
            },
        },
        D: {
            onClick: {
                action: "navigate",
                to: "uicd2",
            },
        },
    },
});

export const P2 = generateGui({
    id: "uicd2",
    name: "主菜单 / 第二页",
    descriptions: [
        "这是服务器主菜单的第二页",
        "你可以通过最右侧的上半部分切换到主菜单的第一页",
        "#emptyline",
        "在这一页上，你可以打开服务器的各个系统的子菜单，",
        "包括：精灵、战令、领地、阶级、任务 和 称号",
        "#emptyline",
        "下方的八个小功能按钮分别是",
        "会员功能、表情/动作、发送红包、自动整理、附魔书预览、宠物/坐骑、设置小家、个人仓库",
    ],
    map: [
        ["#", "#", "#", "#", "#", "#", "#", "#", "U"],
        ["#", "#", "#", "#", "#", "#", "#", "#", "U"],
        ["#", "#", "#", "#", "#", "#", "#", "#", "U"],
        ["#", "#", "#", "#", "#", "#", "#", "#", "D"],
        ["#", "#", "#", "#", "#", "#", "#", "#", "D"],
        ["#", "#", "#", "#", "#", "#", "#", "#", "D"],
    ],
    palette: {
        U: {
            onClick: {
                action: "navigate",
                to: "uicd",
            },
        },
        D: {
            onClick: {
                action: "navigate",
                to: "uicd2",
            },
        },
    },
});
