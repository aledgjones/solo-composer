import { SystemMetrics } from "./use-measure-system";
import { EngravingConfig } from "../engraving";
import { Converter } from "./use-converter";
import { Renderer, Path, Styles } from "./renderer";

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

export function drawBrackets(renderer: Renderer, x: number, y: number, metrics: SystemMetrics, config: EngravingConfig, converter: Converter) {

    // if n > 1 neightbouring instruments in same family -- woodwind, brass, strings only!
    // subbrace if same instrument type next to each other

    const { spaces } = converter;

    const left = x - spaces.toPX(.75);
    const capLeft = x - spaces.toPX(1);

    const glyphTop = '\u{E003}';
    const glyphBottom = '\u{E004}';

    const styles: Styles = {
        color: '#000000',
        textAlign: 'left',
        fontFamily: 'Music',
        fontSize: spaces.toPX(4),
        textBaseline: 'middle'
    };

    const thinLines: Path[] = [];
    const thickLines: Path[] = [];

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


            thickLines.push([
                [left, top - tweekForStave],
                [left, bottom + tweekForStave]
            ])

            if (isLine) {
                thinLines.push(
                    [
                        [left - spaces.toPX(.25), top],
                        [x, top]
                    ],
                    [
                        [left - spaces.toPX(.25), bottom],
                        [x, bottom]
                    ]
                );
            }

            if (isWing) {
                renderer.text(styles, glyphTop, capLeft, top);
                renderer.text(styles, glyphBottom, capLeft, bottom);
            }
        }
    });

    renderer.paths({...styles,width: spaces.toPX(.5) }, ...thickLines);
    renderer.paths({...styles,width: spaces.toPX(.125) }, ...thinLines);

}