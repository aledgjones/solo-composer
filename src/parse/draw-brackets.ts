import { VerticalMeasurements } from "./measure-vertical-layout";
import { EngravingConfig } from "../services/engraving";
import { buildPath } from "../render/path";
import { buildText, TextStyles, Justify, Align } from "../render/text";
import { Instruction } from "../render/instructions";

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

export function drawBrackets(x: number, y: number, metrics: VerticalMeasurements, config: EngravingConfig) {

    // if n > 1 neightbouring instruments in same family -- woodwind, brass, strings only!
    // subbrace if same instrument type next to each other

    const left = x - .75;

    const thick = { color: '#000000', thickness: .5 };
    const thin = { color: '#000000', thickness: .125 };

    return metrics.brackets.reduce((out: Instruction<any>, bracket) => {
        const start = metrics.instruments[bracket.start];
        const stop = metrics.instruments[bracket.stop];

        const isWing = config.bracketEndStyle === BracketEndStyle.wing;
        const isLine = config.bracketEndStyle === BracketEndStyle.line;
        const tweekForWing = isWing ? .3125 : 0; // .25 + .0625;
        const tweekForStave = .0625;

        const top = y + start.y - tweekForWing;
        const bottom = y + stop.y + stop.height + tweekForWing;

        // vertical thick line
        out.push(buildPath(`${bracket.start}-vertical-bar`, thick, [left, top - tweekForStave], [left, bottom + tweekForStave]));

        if (isLine) {
            out.push(
                buildPath(`${bracket.start}-cap--top`, thin, [left - .25, top], [x, top]),
                buildPath(`${bracket.start}-cap--bottom`, thin, [left - .25, bottom], [x, bottom])
            )
        }

        if (isWing) {
            const capLeft = x - 1;
            const glyphTop = '\u{E003}';
            const glyphBottom = '\u{E004}';
            const styles: TextStyles = {
                color: '#000000',
                justify: Justify.start,
                align: Align.middle,
                font: 'Music',
                size: 4
            };
            out.push(
                buildText(`${bracket.start}-wing--top`, styles, capLeft, top, glyphTop),
                buildText(`${bracket.start}-wing--bottom`, styles, capLeft, bottom, glyphBottom)
            )
        }

        return out;
    }, []);

}