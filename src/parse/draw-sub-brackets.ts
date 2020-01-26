import { VerticalMeasurements } from "./measure-vertical-layout";
import { PathInstruction, buildPath } from "../render/path";

export function drawSubBrackets(x: number, y: number, metrics: VerticalMeasurements) {

    // if n > 1 neightbouring instruments in same family -- woodwind, brass, strings only!
    // subbrace if same instrument type next to each other

    const left = x - 1.5;
    const styles = { color: '#000000', thickness: .125 };

    return metrics.subBrackets.reduce((out: PathInstruction[], bracket) => {
        const start = metrics.instruments[bracket.start];
        const stop = metrics.instruments[bracket.stop];

        const top = y + start.y;
        const bottom = y + stop.y + stop.height;

        out.push(buildPath(`${bracket.start}-bracket`, styles, [x, top], [left, top], [left, bottom], [x, bottom]));

        return out;
    }, []);

}