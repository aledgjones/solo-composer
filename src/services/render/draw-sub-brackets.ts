import { SystemMetrics } from "./use-measure-system";
import { EngravingConfig } from "../engraving";
import { Converter } from "./use-converter";
import { Renderer, Path } from "./renderer";

export function drawSubBrackets(renderer: Renderer, x: number, y: number, metrics: SystemMetrics, config: EngravingConfig, converter: Converter) {

    // if n > 1 neightbouring instruments in same family -- woodwind, brass, strings only!
    // subbrace if same instrument type next to each other

    const { spaces } = converter;

    const left = x - spaces.toPX(1.5);

    const paths: Path[] = [];
    metrics.subBrackets.forEach(bracket => {
        const start = metrics.instruments[bracket.start];
        const stop = metrics.instruments[bracket.stop];

        const top = y + start.y;
        const bottom = y + stop.y + stop.height;

        paths.push([
            [x, top],
            [left, top],
            [left, bottom],
            [x, bottom]
        ]);
    });

    const style = { color: '#000000', width: spaces.toPX(.125) };
    renderer.paths(style, ...paths);

}