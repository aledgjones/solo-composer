import { VerticalMeasurements } from "./measure-vertical-layout";
import { EngravingConfig } from "../services/engraving";
import { Converter } from "./converter";
import { Path, buildPath } from "../render/path";

export function drawSubBrackets(x: number, y: number, metrics: VerticalMeasurements, config: EngravingConfig, converter: Converter) {

    // if n > 1 neightbouring instruments in same family -- woodwind, brass, strings only!
    // subbrace if same instrument type next to each other

    const { spaces } = converter;

    const left = x - spaces.toPX(1.5);
    const styles = { color: '#000000', width: spaces.toPX(.125) };

    return metrics.subBrackets.reduce((out: Path[], bracket) => {
        const start = metrics.instruments[bracket.start];
        const stop = metrics.instruments[bracket.stop];

        const top = y + start.y;
        const bottom = y + stop.y + stop.height;

        out.push(buildPath(styles, [x, top], [left, top], [left, bottom], [x, bottom]));

        return out;
    }, []);

}