import { useMemo } from "react";

export function useCanvas() {
    return useMemo(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 900;
        canvas.height = 200;
        return {
            ctx: canvas.getContext('2d', { alpha: false }) || undefined,
            canvas
        }
    }, []);
}