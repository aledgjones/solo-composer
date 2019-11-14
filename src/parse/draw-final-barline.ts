import { EngravingConfig } from "../services/engraving";
import { VerticalMeasurements } from "./measure-vertical-layout";
import { createBarline, BarlineType, drawBarline } from "../entries/barline";
import { Converter } from "./converter";
import { Stave } from "../services/stave";

export function drawFinalBarline(x: number, y: number, staves: Stave[], metrics: VerticalMeasurements, config: EngravingConfig) {
    const barline = createBarline({ type: config.finalBarlineType }, 0);
    return drawBarline(x - barline._bounds.width, y, staves, metrics, barline);
}