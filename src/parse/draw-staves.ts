import { Stave } from "../services/stave";
import { VerticalMeasurements } from "./measure-vertical-layout";
import { EngravingConfig } from "../services/engraving";
import { Converter } from "./converter";
import { buildPath, Path } from "../render/path";

export function drawStaves(x: number, y: number, width: number, staves: Stave[], metrics: VerticalMeasurements, config: EngravingConfig, converter: Converter) {

    const { spaces } = converter;

    const tweakForStaveLineWidth = spaces.toPX(.0625);
    const styles = { color: '#000000', width: spaces.toPX(.125) };

    const paths: Path[] = [];

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