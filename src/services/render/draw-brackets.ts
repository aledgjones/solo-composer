import { SystemMetrics } from "./use-measure-system";
import { EngravingConfig } from "../engraving";
import { Converter } from "./use-converter";

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

export function drawBrackets(ctx: CanvasRenderingContext2D, x: number, y: number, metrics: SystemMetrics, config: EngravingConfig, converter: Converter) {

    // if n > 1 neightbouring instruments in same family -- woodwind, brass, strings only!
    // subbrace if same instrument type next to each other

    const { spaces } = converter;

    const left = x - spaces.toPX(.75);
    const capLeft = x - spaces.toPX(1);

    const glyphTop = '\u{E003}';
    const glyphBottom = '\u{E004}';

    ctx.strokeStyle = '#000000';

    ctx.fillStyle = 'black';
    ctx.textAlign = 'left';
    ctx.font = `${spaces.toPX(4)}px Music`;
    ctx.textBaseline = 'middle';

    metrics.brackets.forEach(bracket => {
        const start = metrics.instruments[bracket.start];
        const stop = metrics.instruments[bracket.stop];

        if (config.bracketSingleStaves || (!config.bracketSingleStaves && start !== stop)) {

            const isWing = config.bracketEndStyle === BracketEndStyle.wing;
            const isLine = config.bracketEndStyle === BracketEndStyle.line;
            const tweekForWing = isWing ? spaces.toPX(.3125) : 0; // .25 + .0625;
            const tweekForStave = spaces.toPX(.0625);

            const top = y + start.y - tweekForWing;
            const bottom = y + stop.y + stop.height + tweekForWing;

            ctx.lineWidth = spaces.toPX(.5);

            ctx.beginPath();
            ctx.moveTo(left, top - tweekForStave);
            ctx.lineTo(left, bottom + tweekForStave);
            ctx.stroke();

            if (isLine) {
                ctx.lineWidth = spaces.toPX(.125);
                ctx.beginPath();
                ctx.moveTo(left - spaces.toPX(.25), top);
                ctx.lineTo(x, top);
                ctx.moveTo(left - spaces.toPX(.25), bottom);
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