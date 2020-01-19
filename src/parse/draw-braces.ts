import { VerticalMeasurements } from "./measure-vertical-layout";
import { buildText, TextStyles } from "../render/text";
import { Justify, Align } from "../render/apply-styles";

export function drawBraces(x: number, y: number, metrics: VerticalMeasurements) {

    const styles: TextStyles = {
        color: '#000000',
        font: 'Music',
        size: 0.0,
        justify: Justify.end,
        align: Align.middle
    };

    return metrics.braces.map(brace => {
        const start = metrics.staves[brace.start];
        const stop = metrics.staves[brace.stop];

        const height = (stop.y + stop.height) - start.y;
        const top = y + (stop.y + stop.height);

        return buildText({...styles, size: height}, x - .25, top, '\u{E000}');
    });

}