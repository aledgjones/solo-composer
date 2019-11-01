import { SystemMetrics } from "./use-measure-system";
import { EngravingConfig } from "../engraving";

export function drawBraces(ctx: CanvasRenderingContext2D, metrics: SystemMetrics, config: EngravingConfig, x: number) {

    metrics.braces.forEach(brace => {
        const start = metrics.staves[brace.start];
        const stop = metrics.staves[brace.stop];
        const height = (stop.y + stop.height) - start.y;
        const y = config.framePadding.top + start.y + (height / 2);

        ctx.fillStyle = 'black';
        ctx.textAlign = 'right';
        ctx.font = `${height}px Music`;
        ctx.textBaseline = 'top';
        ctx.fillText('\u{E000}', x - (config.space / 4), y);

    });
}