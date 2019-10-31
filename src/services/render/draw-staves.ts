import { Stave } from "../stave";
import { SystemMetrics } from "./use-system-metrics";
import { EngravingConfig } from "../engraving";

export function drawStaves(ctx: CanvasRenderingContext2D, staves: Stave[], metrics: SystemMetrics, config: EngravingConfig, x: number) {
    const top = config.framePadding.top;
    const right = ctx.canvas.width - config.framePadding.right;

    ctx.strokeStyle = '#000000';

    ctx.beginPath();
    staves.forEach(stave => {
        for (let i = 0; i < 5; i++) {
            const start = top + metrics.staves[stave.key].y + (i * config.space);
            ctx.moveTo(x, start);
            ctx.lineTo(right, start);
        }
    });
    ctx.stroke();

}