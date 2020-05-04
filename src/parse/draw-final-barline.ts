import { VerticalMeasurements } from "./measure-vertical-layout";
import { Stave } from "../services/stave";
import { drawBarline, Barline } from "../entries/barline";
import { Entry } from "../entries";

export function drawFinalBarline(
    x: number,
    y: number,
    staves: Stave[],
    metrics: VerticalMeasurements,
    barline: Entry<Barline>
) {
    // its just easier to create a barline entry and draw with this.
    return drawBarline(x, y, staves, metrics, barline);
}
