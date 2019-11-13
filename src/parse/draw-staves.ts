import { Stave } from "../services/stave";
import { VerticalMeasurements } from "./measure-vertical-layout";
import { Converter } from "./converter";
import { buildPath, PathInstruction } from "../render/path";

export function drawStaves(x: number, y: number, width: number, staves: Stave[], metrics: VerticalMeasurements, converter: Converter) {

    const { spaces } = converter;

    const tweakForStaveLineWidth = spaces.toPX(.0625);
    const styles = { color: '#000000', thickness: spaces.toPX(.125) };

    const paths: PathInstruction[] = [];

    // render staves
    staves.forEach(stave => {
        for (let i = 0; i < 5; i++) {
            const start = y + metrics.staves[stave.key].y + spaces.toPX(i);
            paths.push(buildPath(styles, [x, start], [x + width, start]));
        }
    });

    // render starting barline
    paths.push(buildPath(styles, [x, y - tweakForStaveLineWidth], [x, y + metrics.systemHeight + tweakForStaveLineWidth]));

    return paths;

}