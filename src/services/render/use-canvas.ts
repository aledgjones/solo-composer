import { useMemo } from "react";
import { px } from "./units";

export function useCanvas(width: number, height: number) {
    return useMemo(() => {
        const canvas = document.createElement('canvas');
        canvas.width = px(width);
        canvas.height = px(height);
        return {
            ctx: canvas.getContext('2d', { alpha: false }),
            canvas
        }
    }, [width, height]);
}