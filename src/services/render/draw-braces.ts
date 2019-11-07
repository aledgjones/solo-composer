import { SystemMetrics } from "./use-measure-system";
import { EngravingConfig } from "../engraving";
import { Renderer, Styles } from "./renderer";
import { Converter } from "./use-converter";

export function drawBraces(renderer: Renderer, x: number, y: number, metrics: SystemMetrics, config: EngravingConfig, converter: Converter) {

    const styles: Styles = {
        color: '#000000',
        fontFamily: 'Music',
        textAlign: 'right',
        textBaseline: 'top'
    };

    metrics.braces.forEach(brace => {
        const start = metrics.staves[brace.start];
        const stop = metrics.staves[brace.stop];

        const height = (stop.y + stop.height) - start.y;
        const top = y + start.y + (height / 2);

        renderer.text({ ...styles, fontSize: height }, '\u{E000}', x - converter.spaces.toPX(.25), top);
    });

}