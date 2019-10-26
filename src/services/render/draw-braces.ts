import { Instrument } from "../instrument";
import { SystemMetrics } from "./use-system-metrics";
import { Config } from "../config";

export function drawBraces(ctx: CanvasRenderingContext2D, metrics: SystemMetrics, config: Config, x: number) {

    metrics.braces.forEach(brace => {
        const start = metrics.staves[brace.start];
        const stop = metrics.staves[brace.stop];
        const height = (stop.y + stop.height) - start.y;
        const y = config.writePagePadding.top + start.y + (height / 2)

        ctx.fillStyle = 'black';
        ctx.textAlign = 'right';
        ctx.font = `${height}px Music`;
        ctx.textBaseline = 'top';
        ctx.fillText('\u{E000}', x - (config.writeSpace / 2), y);

    });
}