import { toast } from "sonner";

export const Uicd = {
    id: "uicd",
    buttons: {
        3: {
            onClick: {
                action: "custom",
                fn: () => toast.message("笨蛋，你现在就在看 Wiki！"),
            },
        },
        4: {
            onClick: {
                action: "custom",
                fn: () => toast.message("笨蛋，你现在就在看 Wiki！"),
            },
        },

        12: {
            onClick: {
                action: "navigate",
                to: "uics_zc",
            },
        },
        13: {
            onClick: {
                action: "navigate",
                to: "uics_zc",
            },
        },
        21: {
            onClick: {
                action: "navigate",
                to: "uics_zc",
            },
        },
        22: {
            onClick: {
                action: "navigate",
                to: "uics_zc",
            },
        },
        30: {
            onClick: {
                action: "navigate",
                to: "uics_zc",
            },
        },
        31: {
            onClick: {
                action: "navigate",
                to: "uics_zc",
            },
        },

        35: {
            onClick: {
                action: "navigate",
                to: "uicd2",
            },
        },
        44: {
            onClick: {
                action: "navigate",
                to: "uicd2",
            },
        },
        53: {
            onClick: {
                action: "navigate",
                to: "uicd2",
            },
        },
    },
};

export const Uicd2 = {
    id: "uicd2",
    buttons: {
        8: {
            onClick: {
                action: "navigate",
                to: "uicd",
            },
        },
        17: {
            onClick: {
                action: "navigate",
                to: "uicd",
            },
        },
        26: {
            onClick: {
                action: "navigate",
                to: "uicd",
            },
        },
    },
};
