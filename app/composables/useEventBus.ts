import mitt from "mitt";
import type { EventBusEvents } from "~/types/eventbus";

let emitter: ReturnType<typeof mitt<EventBusEvents>> | null = null;

export function useEventBus() {
    if (!emitter) {
        emitter = mitt<EventBusEvents>();
    }

    return {
        on: emitter.on,
        off: emitter.off,
        emit: emitter.emit,
    };
}
