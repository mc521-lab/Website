export type EventBusEvents = {
    notify: { message: string; level: "info" | "success" | "warning" | "error" };
};
