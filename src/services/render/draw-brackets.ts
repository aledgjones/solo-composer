import { SystemMetrics } from "./use-system-metrics";
import { EngravingConfig } from "../engraving";

export enum BracketingType {
    none = 1,
    orchestral,
    smallEnsemble
}

export enum BracketEndStyle {
    wing = 1,
    line,
    none
}

export function drawBrackets(ctx: CanvasRenderingContext2D, metrics: SystemMetrics, config: EngravingConfig, x: number) {

    // if n > 1 neightbouring instruments in same family -- woodwind, brass, strings only!
    // subbrace if same instrument type next to each other

    const lineWidth = config.space / 2;
    const spaceWidth = config.space / 2;

    const left = x - spaceWidth - (lineWidth / 2);
    const capLeft = x - config.space;

    const glyphTop = '\u{E003}';
    const glyphBottom = '\u{E004}';

    ctx.strokeStyle = '#000000';

    ctx.fillStyle = 'black';
    ctx.textAlign = 'left';
    ctx.font = `${config.space * 4}px Music`;
    ctx.textBaseline = 'middle';

    metrics.brackets.forEach(bracket => {
        const start = metrics.instruments[bracket.start];
        const stop = metrics.instruments[bracket.stop];

        if (config.bracketSingleStaves || (!config.bracketSingleStaves && start !== stop)) {

            const isWing = config.bracketEndStyle === BracketEndStyle.wing;
            const isLine = config.bracketEndStyle === BracketEndStyle.line;
            const tweekForWing = isWing ? config.space * .25 : 0;

            const top = config.framePadding.top + start.y - tweekForWing;
            const bottom = config.framePadding.top + stop.y + stop.height + tweekForWing;

            ctx.lineWidth = lineWidth;

            ctx.beginPath();
            ctx.moveTo(left, top);
            ctx.lineTo(left, bottom);
            ctx.stroke();

            ctx.lineWidth = 1;

            if (isLine) {
                ctx.beginPath();
                ctx.moveTo(left - (lineWidth / 2), top);
                ctx.lineTo(x, top);
                ctx.moveTo(left - (lineWidth / 2), bottom);
                ctx.lineTo(x, bottom);
                ctx.stroke();
            }

            if (isWing) {
                ctx.fillText(glyphTop, capLeft, top);
                ctx.fillText(glyphBottom, capLeft, bottom);
            }
        }
    });

}