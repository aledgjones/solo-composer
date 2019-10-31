import { drawClef, Clef } from "../entries/clef";
import { drawKeySignature, KeySignature } from "../entries/key-signature";
import { drawTimeSignature, TimeSignature } from "../entries/time-signature";
import { Entry, EntryType } from "../entries";
import { findPreviousOfType } from "./find-previous-of-type";
import { EngravingConfig } from "../engraving";

export function renderStavePrologue(ctx: CanvasRenderingContext2D, x: number, y: number, config: EngravingConfig, flowEntries: Entry<any>[], staveEntries: Entry<any>[]) {

    let left = x + config.systemStartPadding;

    const clef = findPreviousOfType<Clef>(EntryType.clef, 0, staveEntries);
    const key = findPreviousOfType<KeySignature>(EntryType.keySignature, 0, flowEntries);
    const time = findPreviousOfType<TimeSignature>(EntryType.timeSignature, 0, flowEntries);

    if (clef) {
        drawClef(ctx, left, y, config.space, clef.type, clef.offset);
        left = left + (clef._box.width * config.space);
    }

    if (clef && key) {
        drawKeySignature(ctx, left, y, config.space, clef.type, clef.offset, key.offset);
        left = left + (key._box.width * config.space);
    }

    if (time) {
        drawTimeSignature(ctx, left, y, config.space, time.count, time.beat, time.drawAs);
        left = left + (time._box.width * config.space);
    }

    return left - x;
}