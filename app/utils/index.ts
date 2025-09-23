export const copy = (text: string) => {
    if (!navigator.clipboard) {
        // Fallback to Old Copy Method
        const textarea = document.createElement("textarea");
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
    } else {
        navigator.clipboard.writeText(text);
    }
    const eventbus = useEventBus();
    eventbus.emit("notify", { message: "已复制", level: "success" });
};

export const open = (url: string, target: string = "_blank") => {
    window.open(url, target);
};
