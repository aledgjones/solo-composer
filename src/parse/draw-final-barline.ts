import { EngravingConfig } from "../services/engraving";
import { VerticalMeasurements } from "./measure-vertical-layout";
import { createBarline, BarlineType, drawBarline } from "../entries/barline";
import { Converter } from "./converter";
import { Stave } from "../services/stave";

export function drawFinalBarline(x: number, y: number, staves: Stave[], metrics: VerticalMeasurements, config: EngravingConfig, converter: Converter) {
    const barline = createBarline({ type: config.finalBarlineType }, 0);
    return drawBarline(x - converter.spaces.toPX(barline._bounds.width), y, staves, metrics, barline, converter);
}