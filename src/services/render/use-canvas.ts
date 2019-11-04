import { useMemo } from "react";

export function useCanvas() {
    return useMemo(() => {
        const canvas = document.createElement('canvas');
        return {
            ctx: canvas.getContext('2d', { alpha: false }) || undefined,
            canvas
        }
    }, []);
}