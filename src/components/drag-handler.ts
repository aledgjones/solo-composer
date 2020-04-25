import { useCallback } from "react";

type DownCallback<T> = (e: React.PointerEvent) => T | false;
type OtherCallback<T> = (e: PointerEvent, data: T) => void;

interface Config<T> {
    onDown: DownCallback<T>;
    onMove: OtherCallback<T>;
    onEnd: OtherCallback<T>;
}

/**
 * Boilerplate for adding pointer move events after an initial pointer down event
 */
export function dragHandler<T>({ onDown, onMove, onEnd }: Config<T>) {

    let pointer: number | undefined = undefined;

    return (e: React.PointerEvent<HTMLElement>) => {

        // only one pointer at a time
        if (pointer !== undefined) return;

        pointer = e.pointerId;
        const data = onDown(e);

        if (data !== false) {

            const move = (e: PointerEvent) => {
                if (pointer !== e.pointerId) return;
                onMove(e, data);
            }

            const stop = (e: PointerEvent) => {
                if (pointer !== e.pointerId) return;

                onEnd(e, data);

                document.removeEventListener('pointermove', move);
                document.removeEventListener('pointerup', stop);
                document.removeEventListener('pointercancel', stop);

                pointer = undefined;
            };

            document.addEventListener('pointermove', move, {passive: true});
            document.addEventListener('pointerup', stop, {passive: true});
            document.addEventListener('pointercancel', stop, {passive: true});
        }
    }

}

export function useDragHandler<T>(config: Config<T>, deps: any[]) {
    return useCallback(dragHandler<T>(config), [deps]);
}