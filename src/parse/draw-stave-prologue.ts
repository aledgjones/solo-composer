import { drawClef } from "../entries/clef";
import { Clef } from "../entries/clef-defs";
import { drawKeySignature, KeySignature } from "../entries/key-signature";
import { drawTimeSignature, TimeSignature } from "../entries/time-signature";
import { Entry, EntryType } from "../entries";
import { findPreviousOfType } from "../render/find-previous-of-type";
import { EngravingConfig } from "../services/engraving";
import { Stave } from "../services/stave";

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

// export function drawStavePrologue(ctx: CanvasRenderingContext2D, x: number, y: number, config: EngravingConfig, flowEntries: Entry<any>[], staveEntries: Entry<any>[], converter: Converter): number {

//     const { spaces } = converter;

//     let left = x + config.systemStartPadding;

//     const clef = findPreviousOfType<Clef>(EntryType.clef, 0, staveEntries);
//     const key = findPreviousOfType<KeySignature>(EntryType.keySignature, 0, flowEntries);
//     const time = findPreviousOfType<TimeSignature>(EntryType.timeSignature, 0, flowEntries);

//     if (clef) {
//         drawClef(ctx, left, y, clef, converter);
//         left = left + spaces.toPX(clef._bounds.width);
//     }

//     if (clef && key) {
//         drawKeySignature(ctx, left, y, clef, key, converter);
//         left = left + spaces.toPX(key._bounds.width);
//     }

//     if (time) {
//         drawTimeSignature(ctx, left, y, time, converter);
//         left = left + spaces.toPX(time._bounds.width);
//     }

//     return left - x;

// }