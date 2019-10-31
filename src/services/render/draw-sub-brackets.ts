import { SystemMetrics } from "./use-system-metrics";
import { EngravingConfig } from "../engraving";

export function drawSubBrackets(ctx: CanvasRenderingContext2D, metrics: SystemMetrics, config: EngravingConfig, x: number) {

    // if n > 1 neightbouring instruments in same family -- woodwind, brass, strings only!
    // subbrace if same instrument type next to each other

    const left = x - (config.space * 1.5);

    ctx.strokeStyle = '#000000';

    ctx.beginPath();
    metrics.subBrackets.forEach(bracket => {
        const start = metrics.instruments[bracket.start];
        const stop = metrics.instruments[bracket.stop];

        const top = config.framePadding.top + start.y;
        const bottom = config.framePadding.top + stop.y + stop.height;

        ctx.moveTo(x, top);
        ctx.lineTo(left, top);
        ctx.lineTo(left, bottom);
        ctx.lineTo(x, bottom);
    });
    ctx.stroke();

}