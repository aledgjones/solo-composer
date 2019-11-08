import { drawClef } from "../entries/clef";
import { Clef } from "../entries/clef-defs";
import { drawKeySignature, KeySignature } from "../entries/key-signature";
import { drawTimeSignature, TimeSignature } from "../entries/time-signature";
import { Entry, EntryType } from "../entries";
import { findPreviousOfType } from "./find-previous-of-type";
import { EngravingConfig } from "../services/engraving";
import { Converter } from "../parse/converter";

export function measureStavePrologue(config: EngravingConfig, flowEntries: Entry<any>[], staveEntries: Entry<any>[]) {

    const clef = findPreviousOfType<Clef>(EntryType.clef, 0, staveEntries);
    const key = findPreviousOfType<KeySignature>(EntryType.keySignature, 0, flowEntries);
    const time = findPreviousOfType<TimeSignature>(EntryType.timeSignature, 0, flowEntries);

    let width = config.systemStartPadding;

    if (clef) {
        width = width + clef._bounds.width;
    }

    if (clef && key) {
        width = width + clef._bounds.width;
    }

    if (time) {
        width = width + time._bounds.width;
    }

    return width;
    
}

export function drawStavePrologue(ctx: CanvasRenderingContext2D, x: number, y: number, config: EngravingConfig, flowEntries: Entry<any>[], staveEntries: Entry<any>[], converter: Converter): number {

    const {spaces} = converter;

    let left = x + config.systemStartPadding;

    const clef = findPreviousOfType<Clef>(EntryType.clef, 0, staveEntries);
    const key = findPreviousOfType<KeySignature>(EntryType.keySignature, 0, flowEntries);
    const time = findPreviousOfType<TimeSignature>(EntryType.timeSignature, 0, flowEntries);

    if (clef) {
        drawClef(ctx, left, y, clef, converter);
        left = left + spaces.toPX(clef._bounds.width);
    }

    if (clef && key) {
        drawKeySignature(ctx, left, y, clef, key, converter);
        left = left + spaces.toPX(key._bounds.width);
    }

    if (time) {
        drawTimeSignature(ctx, left, y, time, converter);
        left = left + spaces.toPX(time._bounds.width);
    }

    return left - x;

}