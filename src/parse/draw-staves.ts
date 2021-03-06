import { Stave } from "../services/stave";
import { VerticalMeasurements } from "./measure-vertical-layout";
import { buildPath, PathInstruction } from "../render/path";

export function drawStaves(
    x: number,
    y: number,
    width: number,
    staves: Stave[],
    metrics: VerticalMeasurements,
    drawSystemicBarline: boolean
) {
    const tweakForStaveLineWidth = 0.0625;
    const styles = { color: "#000000", thickness: 0.125 };

    const paths: PathInstruction[] = [];

    // render staves
    staves.forEach((stave) => {
        for (let i = 0; i < 5; i++) {
            const start = y + metrics.staves[stave.key].y + i;
            paths.push(buildPath(`${stave.key}-stave-${i}`, styles, [x, start], [x + width, start]));
        }
    });

    // render stystemic barline
    // prevent errors by only drawing if there are actually staves
    if (staves.length > 0 && drawSystemicBarline) {
        paths.push(
            buildPath(
                "start-barline",
                styles,
                [x, y - tweakForStaveLineWidth],
                [x, y + metrics.systemHeight + tweakForStaveLineWidth]
            )
        );
    }

    return paths;
}
