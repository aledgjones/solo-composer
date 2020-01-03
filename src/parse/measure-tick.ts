import { Clef } from "../entries/clef-defs";
import { KeySignature } from "../entries/key-signature";
import { TimeSignature } from "../entries/time-signature";
import { EntryType } from "../entries";
import { EngravingConfig } from "../services/engraving";
import { Stave } from "../services/stave";
import { EntriesByTick, entriesByTick } from "../services/track";
import { getEntryAtTick } from "./get-entry-at-tick";
import { Barline, createBarline, BarlineType } from "../entries/barline";

export enum WidthOf {
    endRepeat,
    clef,
    barline,
    key,
    time,
    startRepeat,
    accidentals,
    offsetNoteSlot,
    noteSpacing
}

export function widthUpTo(widths: number[], upTo: WidthOf) {
    let sum = 0;
    for (let i = 0; i < upTo; i++) {
        sum += widths[i];
    }
    return sum;
}

export function measureTick(tick: number, isFirstBeat: boolean, flowEntries: EntriesByTick, staves: Stave[], config: EngravingConfig) {

    const measurements: number[] = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.75];

    // barlines are sometimes implied by a change of key etc.
    // these facilitate measureing what is actually needed
    const normalBarline = createBarline({ type: BarlineType.normal }, 0);
    const doubleBarline = createBarline({ type: BarlineType.double }, 0);

    const key = getEntryAtTick<KeySignature>(tick, flowEntries, EntryType.keySignature);
    const time = getEntryAtTick<TimeSignature>(tick, flowEntries, EntryType.timeSignature);
    const barline = getEntryAtTick<Barline>(tick, flowEntries, EntryType.barline);

    if (time.entry) {
        measurements[WidthOf.time] = time.entry._bounds.width;
    }

    if (key.entry) {
        measurements[WidthOf.key] = key.entry._bounds.width;
    }

    if (barline.entry) {
        if (barline.entry.type === BarlineType.start_repeat) {
            measurements[WidthOf.startRepeat] = barline.entry._bounds.width;
        } else if (barline.entry.type === BarlineType.end_repeat) {
            measurements[WidthOf.endRepeat] = barline.entry._bounds.width;
        } else {
            measurements[WidthOf.barline] = barline.entry._bounds.width;
        }
    } else if (tick !== 0) {
        if (key.entry || time.entry) {
            measurements[WidthOf.barline] = doubleBarline._bounds.width;
        } else if (isFirstBeat) {
            measurements[WidthOf.barline] = normalBarline._bounds.width;
        }
    }

    staves.forEach(stave => {
        const entries = entriesByTick(stave.master.entries.order, stave.master.entries.byKey);
        const clef = getEntryAtTick<Clef>(tick, entries, EntryType.clef);

        if (clef.entry) {
            if (clef.entry._bounds.width > measurements[1]) {
                measurements[WidthOf.clef] = clef.entry._bounds.width;
            }
        }
    });

    return measurements;

}