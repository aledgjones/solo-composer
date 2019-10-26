import { SystemMetrics } from "./use-system-metrics";
import { Config } from "../config";

export function drawBrackets(ctx: CanvasRenderingContext2D, metrics: SystemMetrics, config: Config, x: number) {

    // if n > 1 neightbouring instruments in same family -- woodwind, brass, strings only!
    // subbrace if same instrument type next to each other

    const left = x - (config.writeSpace * 1.5);
    const capLeft = x - (config.writeSpace * 2);

    const glyphTop = '\u{E003}';
    const glyphBottom = '\u{E004}';

    ctx.strokeStyle = '#000000';
    ctx.lineWidth = config.writeSpace;

    ctx.fillStyle = 'black';
    ctx.textAlign = 'left';
    ctx.font = `${config.writeSpace * 8}px Music`;
    ctx.textBaseline = 'middle';

    metrics.brackets.forEach(bracket => {
        const start = metrics.instruments[bracket.start];
        const stop = metrics.instruments[bracket.stop];

        const top = config.writePagePadding.top + start.y - (config.writeSpace * .5);
        const bottom = config.writePagePadding.top + stop.y + stop.height + (config.writeSpace * .5);

        ctx.beginPath();
        ctx.moveTo(left, top);
        ctx.lineTo(left, bottom);
        ctx.stroke();

        ctx.fillText(glyphTop, capLeft, top);
        ctx.fillText(glyphBottom, capLeft, bottom);
    });

    ctx.lineWidth = 1;

}