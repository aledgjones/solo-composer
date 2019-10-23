import { Config } from "../config";
import { Stave } from "../stave";
import { SystemMetrics } from "./use-measure-system";

export function drawStaves(ctx: CanvasRenderingContext2D, staves: Stave[], metrics: SystemMetrics, config: Config, namesWidth: number) {
    const top = config.writePagePadding.top;
    const left = config.writePagePadding.left + namesWidth + config.writeInstrumentNameGap;
    const right = ctx.canvas.width - config.writePagePadding.right;

    ctx.strokeStyle = '#000000';

    ctx.beginPath();
    staves.forEach(stave => {
        for (let i = 0; i < 5; i++) {
            const start = top + metrics.staveYPositions[stave.key] + (i * config.writeSpace * 2);
            ctx.moveTo(left, start);
            ctx.lineTo(right, start);
        }
    });
    ctx.stroke();

}