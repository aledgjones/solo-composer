import { drawClef } from "../entries/clef";
import { Clef } from "../entries/clef-defs";
import { drawKeySignature, KeySignature } from "../entries/key-signature";
import { drawTimeSignature, TimeSignature } from "../entries/time-signature";
import { Entry, EntryType } from "../entries";
import { findPreviousOfType } from "../render/find-previous-of-type";
import { EngravingConfig } from "../services/engraving";
import { Stave } from "../services/stave";
import { Instruction } from "./instructions";
import { VerticalMeasurements } from "./measure-vertical-layout";

export function measureStavePrologue(tick: number, flowEntries: Entry<any>[], staves: Stave[], config: EngravingConfig): [number, number, number, number] {

    const key = findPreviousOfType<KeySignature>(EntryType.keySignature, tick, flowEntries);
    const time = findPreviousOfType<TimeSignature>(EntryType.timeSignature, tick, flowEntries);

    return staves.reduce((measurements, stave) => {

        const staveEntries = stave.master.entries.order.map(staveKey => stave.master.entries.byKey[staveKey]);
        const clef = findPreviousOfType<Clef>(EntryType.clef, 0, staveEntries);

        if (clef) {
            if (clef._bounds.width > measurements[1]) {
                measurements[1] = clef._bounds.width;
            }
        }

        if (clef && key) {
            if (key._bounds.width > measurements[2]) {
                measurements[2] = key._bounds.width;
            }
        }

        if (time) {
            if (time._bounds.width > measurements[3]) {
                measurements[3] = time._bounds.width;
            }
        }

        return measurements;

    }, [config.systemStartPadding, 0.0, 0.0, 0.0]);

}

export function drawStavePrologue(x: number, y: number, prologueWidths: [number, number, number, number], verticalMeasurements: VerticalMeasurements, flowEntries: Entry<any>, staves: Stave[], tick: number) {

    const [spacerWidth, clefWidth, keyWidth] = prologueWidths;

    const key = findPreviousOfType<KeySignature>(EntryType.keySignature, tick, flowEntries);
    const time = findPreviousOfType<TimeSignature>(EntryType.timeSignature, tick, flowEntries);

    return staves.reduce((out: Instruction<any>[], stave) => {
        const staveEntries = stave.master.entries.order.map(staveKey => stave.master.entries.byKey[staveKey]);
        const clef = findPreviousOfType<Clef>(EntryType.clef, tick, staveEntries);

        const top = y + verticalMeasurements.staves[stave.key].y;
        let left = x + spacerWidth;

        if (clef) {
            out.push(drawClef(left, top, clef));
        }

        left += clefWidth;

        if (clef && key) {
            out.push(...drawKeySignature(left, top, clef, key));
        }

        left += keyWidth;

        if (time) {
            out.push(...drawTimeSignature(left, top, time));
        }

        return out;

    }, []);
}