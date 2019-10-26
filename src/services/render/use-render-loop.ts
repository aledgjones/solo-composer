import { useEffect } from "react";

export function useRenderLoop(render: () => void) {
    useEffect(() => {
        let dead = false;

        const looper = () => {
            render();
            if (!dead) {
                requestAnimationFrame(looper);
            }
        }
        looper()

        // render();

        return () => {
            dead = true;
        }
    }, [render]);
}