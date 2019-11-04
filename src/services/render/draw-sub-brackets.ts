import { SystemMetrics } from "./use-measure-system";
import { EngravingConfig } from "../engraving";
import { Converter } from "./use-converter";

export function drawSubBrackets(ctx: CanvasRenderingContext2D, x: number, y: number, metrics: SystemMetrics, config: EngravingConfig, converter: Converter) {

    // if n > 1 neightbouring instruments in same family -- woodwind, brass, strings only!
    // subbrace if same instrument type next to each other

    const { spaces } = converter;

    const left = x - spaces.toPX(1.5);

    ctx.strokeStyle = '#000000';
    ctx.lineWidth = spaces.toPX(.125);
    ctx.lineJoin = 'miter';

    ctx.beginPath();
    metrics.subBrackets.forEach(bracket => {
        const start = metrics.instruments[bracket.start];
        const stop = metrics.instruments[bracket.stop];

        const top = y + start.y;
        const bottom = y + stop.y + stop.height;

        ctx.moveTo(x, top);
        ctx.lineTo(left, top);
        ctx.lineTo(left, bottom);
        ctx.lineTo(x, bottom);
    });
    ctx.stroke();

}