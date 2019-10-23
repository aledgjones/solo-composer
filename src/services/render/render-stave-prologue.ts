import { Config } from "../config";
import { drawClef, Clef } from "../entries/clef";
import { drawKeySignature, KeySignature } from "../entries/key-signature";
import { drawTimeSignature, TimeSignature } from "../entries/time-signature";
import { Entry, EntryType } from "../entries";
import { findPreviousOfType } from "./find-previous-of-type";

export function renderStavePrologue(ctx: CanvasRenderingContext2D, x: number, y: number, config: Config, flowEntries: Entry<any>[], staveEntries: Entry<any>[]) {

    let left = x + config.writeSystemStartPadding;

    const clef = findPreviousOfType<Clef>(EntryType.clef, 0, staveEntries);
    const key = findPreviousOfType<KeySignature>(EntryType.keySignature, 0, flowEntries);
    const time = findPreviousOfType<TimeSignature>(EntryType.timeSignature, 0, flowEntries);

    if (clef) {
        drawClef(ctx, left, y, config.writeSpace, clef.type, clef.offset);
        left = left + (clef._box.width * config.writeSpace);
    }

    if (clef && key) {
        drawKeySignature(ctx, left, y, config.writeSpace, clef.type, clef.offset, key.offset);
        left = left + (key._box.width * config.writeSpace);
    }

    if (time) {
        drawTimeSignature(ctx, left, y, config.writeSpace, time.count, time.beat, time.drawAs);
        left = left + (time._box.width * config.writeSpace);
    }

    return left - x;
}