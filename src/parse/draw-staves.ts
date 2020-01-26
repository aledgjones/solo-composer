import { Stave } from "../services/stave";
import { VerticalMeasurements } from "./measure-vertical-layout";
import { buildPath, PathInstruction } from "../render/path";

export function drawStaves(x: number, y: number, width: number, staves: Stave[], metrics: VerticalMeasurements) {

    const tweakForStaveLineWidth = .0625;
    const styles = { color: '#000000', thickness: .125 };

    const paths: PathInstruction[] = [];

    // render staves
    staves.forEach(stave => {
        for (let i = 0; i < 5; i++) {
            const start = y + metrics.staves[stave.key].y + i;
            paths.push(buildPath(`${stave.key}-stave-${i}`, styles, [x, start], [x + width, start]));
        }
    });

    // render starting barline
    if (staves.length > 0) {
        paths.push(buildPath('start-barline', styles, [x, y - tweakForStaveLineWidth], [x, y + metrics.systemHeight + tweakForStaveLineWidth]));
    }

    return paths;

}