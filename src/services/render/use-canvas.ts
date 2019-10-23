import { useMemo } from "react";

export function useCanvas() {
    return useMemo(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 600;
        canvas.height = 200;
        return {
            ctx: canvas.getContext('2d', { alpha: false }) || undefined,
            canvas
        }
    }, []);
}