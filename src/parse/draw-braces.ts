import { VerticalMeasurements } from "./measure-vertical-layout";
import { Converter } from "./converter";
import { buildText, TextStyles } from "../render/text";

export function drawBraces(x: number, y: number, metrics: VerticalMeasurements, converter: Converter) {

    const styles: TextStyles = {
        color: '#000000',
        fontFamily: 'Music',
        fontSize: 0.0,
        textAlign: 'right',
        textBaseline: 'top'
    };

    return metrics.braces.map(brace => {
        const start = metrics.staves[brace.start];
        const stop = metrics.staves[brace.stop];

        const height = (stop.y + stop.height) - start.y;
        const top = y + start.y + (height / 2);

        return buildText({...styles, fontSize: height}, x - converter.spaces.toPX(.25), top, '\u{E000}');
    });

}