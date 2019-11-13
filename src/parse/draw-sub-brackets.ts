import { VerticalMeasurements } from "./measure-vertical-layout";
import { Converter } from "./converter";
import { PathInstruction, buildPath } from "../render/path";

export function drawSubBrackets(x: number, y: number, metrics: VerticalMeasurements, converter: Converter) {

    // if n > 1 neightbouring instruments in same family -- woodwind, brass, strings only!
    // subbrace if same instrument type next to each other

    const { spaces } = converter;

    const left = x - spaces.toPX(1.5);
    const styles = { color: '#000000', thickness: spaces.toPX(.125) };

    return metrics.subBrackets.reduce((out: PathInstruction[], bracket) => {
        const start = metrics.instruments[bracket.start];
        const stop = metrics.instruments[bracket.stop];

        const top = y + start.y;
        const bottom = y + stop.y + stop.height;

        out.push(buildPath(styles, [x, top], [left, top], [left, bottom], [x, bottom]));

        return out;
    }, []);

}