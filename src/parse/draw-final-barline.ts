import { EngravingConfig } from "../services/engraving";
import { VerticalMeasurements } from "./measure-vertical-layout";
import { createBarline, drawBarline } from "../entries/barline";
import { Stave } from "../services/stave";

export function drawFinalBarline(x: number, y: number, staves: Stave[], metrics: VerticalMeasurements, config: EngravingConfig) {
    // its just easier to create a barline entry and draw with this.
    const barline = createBarline({ type: config.finalBarlineType }, 0);
    return drawBarline(x - barline._bounds.width, y, staves, metrics, barline);
}