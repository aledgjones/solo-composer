import { VerticalMeasurements } from "./measure-vertical-layout";
import { EngravingConfig } from "../services/engraving";
import { buildPath } from "../render/path";
import { buildText, TextStyles } from "../render/text";
import { Instruction } from "./instructions";

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
        out.push(buildPath(thick, [left, top - tweekForStave], [left, bottom + tweekForStave]));

        if (isLine) {
            out.push(
                buildPath(thin, [left - .25, top], [x, top]),
                buildPath(thin, [left - .25, bottom], [x, bottom])
            )
        }

        if (isWing) {
            const capLeft = x - 1;
            const glyphTop = '\u{E003}';
            const glyphBottom = '\u{E004}';
            const styles: TextStyles = {
                color: '#000000',
                align: 'left',
                font: 'Music',
                size: 4,
                baseline: 'middle'
            };
            out.push(
                buildText(styles, capLeft, top, glyphTop),
                buildText(styles, capLeft, bottom, glyphBottom)
            )
        }

        return out;
    }, []);

}