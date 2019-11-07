import { Stave } from "../stave";
import { SystemMetrics } from "./use-measure-system";
import { EngravingConfig } from "../engraving";
import { Converter } from "./use-converter";
import { Renderer, Path } from "./renderer";

export function drawStaves(renderer: Renderer, x: number, y: number, width: number, staves: Stave[], metrics: SystemMetrics, config: EngravingConfig, converter: Converter) {

    const { spaces } = converter;

    const tweakForStaveLineWidth = spaces.toPX(.0625);

    const paths: Path[] = [];

    // render staves
    staves.forEach(stave => {
        for (let i = 0; i < 5; i++) {
            const start = y + metrics.staves[stave.key].y + spaces.toPX(i);
            paths.push([
                [x, start],
                [x + width, start]
            ]);
        }
    });

    // render starting barline
    paths.push([
        [x, y - tweakForStaveLineWidth],
        [x, y + metrics.systemHeight + tweakForStaveLineWidth]
    ]);

    const styles = { color: '#000000', width: spaces.toPX(.125) };
    renderer.paths(styles, ...paths);

}