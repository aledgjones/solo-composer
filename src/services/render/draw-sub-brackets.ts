import { SystemMetrics } from "./use-system-metrics";
import { Config } from "../config";

export function drawSubBrackets(ctx: CanvasRenderingContext2D, metrics: SystemMetrics, config: Config, x: number) {

    // if n > 1 neightbouring instruments in same family -- woodwind, brass, strings only!
    // subbrace if same instrument type next to each other

    const left = x - (config.writeSpace * 3);

    ctx.strokeStyle = '#000000';

    ctx.beginPath();
    metrics.subBrackets.forEach(bracket => {
        const start = metrics.instruments[bracket.start];
        const stop = metrics.instruments[bracket.stop];

        const top = config.writePagePadding.top + start.y;
        const bottom = config.writePagePadding.top + stop.y + stop.height;

        ctx.moveTo(x, top);
        ctx.lineTo(left, top);
        ctx.lineTo(left, bottom);
        ctx.lineTo(x, bottom);
    });
    ctx.stroke();

}