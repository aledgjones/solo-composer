import { VerticalMeasurements } from "./measure-vertical-layout";
import { EngravingConfig } from "../services/engraving";
import { Converter } from "./converter";
import { Styles } from "../render/apply-styles";
import { buildText } from "../render/text";

export function drawBraces(x: number, y: number, metrics: VerticalMeasurements, config: EngravingConfig, converter: Converter) {

    const styles: Styles = {
        color: '#000000',
        fontFamily: 'Music',
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