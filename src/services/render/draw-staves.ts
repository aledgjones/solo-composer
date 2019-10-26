import { Config } from "../config";
import { Stave } from "../stave";
import { SystemMetrics } from "./use-system-metrics";

export function drawStaves(ctx: CanvasRenderingContext2D, staves: Stave[], metrics: SystemMetrics, config: Config, x: number) {
    const top = config.writePagePadding.top;
    const right = ctx.canvas.width - config.writePagePadding.right;

    ctx.strokeStyle = '#000000';

    ctx.beginPath();
    staves.forEach(stave => {
        for (let i = 0; i < 5; i++) {
            const start = top + metrics.staves[stave.key].y + (i * config.writeSpace * 2);
            ctx.moveTo(x, start);
            ctx.lineTo(right, start);
        }
    });
    ctx.stroke();

}