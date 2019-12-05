import { VerticalMeasurements } from "./measure-vertical-layout";
import { createBarline, drawBarline, BarlineType } from "../entries/barline";
import { Stave } from "../services/stave";
import { EntriesByTick } from "../services/track";
import { Instruction } from "./instructions";

export function drawBarlines(x: number, y: number, barlines: number[], flowEntriesByTick: EntriesByTick, staves: Stave[], metrics: VerticalMeasurements, tickX: [number, number][]) {

    // its just easier to create a barline entry and draw with this.
    const barline = createBarline({ type: BarlineType.normal }, 0);

    return barlines.reduce<Instruction<any>[]>((output, tick) => {
        if (tick !== 0) {
        }
        return output;
    }, []);


}