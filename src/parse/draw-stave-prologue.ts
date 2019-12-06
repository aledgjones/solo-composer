import { drawClef } from "../entries/clef";
import { Clef } from "../entries/clef-defs";
import { drawKeySignature, KeySignature } from "../entries/key-signature";
import { drawTimeSignature, TimeSignature } from "../entries/time-signature";
import { EntryType } from "../entries";
import { EngravingConfig } from "../services/engraving";
import { Stave } from "../services/stave";
import { Instruction } from "./instructions";
import { VerticalMeasurements } from "./measure-vertical-layout";
import { EntriesByTick, entriesByTick } from "../services/track";
import { getNearestEntryToTick } from "./get-nearest-entry-to-tick";

export function measureStavePrologue(tick: number, flowEntries: EntriesByTick, staves: Stave[], config: EngravingConfig): [number, number, number, number, number] {

    const key = getNearestEntryToTick<KeySignature>(tick, flowEntries, EntryType.keySignature);
    const time = getNearestEntryToTick<TimeSignature>(tick, flowEntries, EntryType.timeSignature);

    return staves.reduce((measurements, stave) => {

        const staveEntries = entriesByTick(stave.master.entries.order, stave.master.entries.byKey);
        const clef = getNearestEntryToTick<Clef>(tick, staveEntries, EntryType.clef);

        if (clef) {
            if (clef.entry._bounds.width > measurements[1]) {
                measurements[1] = clef.entry._bounds.width;
            }
        }

        if (clef && key) {
            if (key.entry._bounds.width > measurements[2]) {
                measurements[2] = key.entry._bounds.width;
            }
        }

        if (time) {
            if (time.entry._bounds.width > measurements[3]) {
                measurements[3] = time.entry._bounds.width;
            }
        }

        return measurements;

    }, [config.systemStartPadding, 0.0, 0.0, 0.0, 1]);

}

export function drawStavePrologue(x: number, y: number, prologueWidths: [number, number, number, number, number], verticalMeasurements: VerticalMeasurements, flowEntries: EntriesByTick, staves: Stave[], tick: number) {

    const [spacerWidth, clefWidth, keyWidth] = prologueWidths;

    const key = getNearestEntryToTick<KeySignature>(tick, flowEntries, EntryType.keySignature);
    const time = getNearestEntryToTick<TimeSignature>(tick, flowEntries, EntryType.timeSignature);

    return staves.reduce((out: Instruction<any>[], stave) => {
        
        const staveEntries = entriesByTick(stave.master.entries.order, stave.master.entries.byKey);
        const clef = getNearestEntryToTick<Clef>(tick, staveEntries, EntryType.clef);

        const top = y + verticalMeasurements.staves[stave.key].y;
        let left = x + spacerWidth;

        if (clef) {
            out.push(drawClef(left, top, clef.entry));
        }

        left += clefWidth;

        if (clef && key) {
            out.push(...drawKeySignature(left, top, clef.entry, key.entry));
        }

        left += keyWidth;

        if (time) {
            out.push(...drawTimeSignature(left, top, time.entry));
        }

        return out;

    }, []);
}