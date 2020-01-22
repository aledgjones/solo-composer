import { Clef } from "../entries/clef-defs";
import { KeySignature } from "../entries/key-signature";
import { TimeSignature } from "../entries/time-signature";
import { EntryType, Entry } from "../entries";
import { EngravingConfig } from "../services/engraving";
import { Stave } from "../services/stave";
import { EntriesByTick, entriesByTick } from "../services/track";
import { getEntriesAtTick } from "./get-entry-at-tick";
import { Barline, createBarline, BarlineType } from "../entries/barline";
import { NotationTracks, NotationType, Notation } from "./notation-track";
import { Tone } from "../entries/tone";
import { getStepsBetweenPitches } from "../playback/utils";

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

export function measureTick(tick: number, isFirstBeat: boolean, flowEntries: EntriesByTick, staves: Stave[], notationTracks: NotationTracks, config: EngravingConfig) {

    const measurements: number[] = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.75];

    // barlines are sometimes implied by a change of key etc.
    // these facilitate measureing what is actually needed
    const normalBarline = createBarline({ type: BarlineType.normal }, 0);
    const doubleBarline = createBarline({ type: BarlineType.double }, 0);

    const key = getEntriesAtTick<KeySignature>(tick, flowEntries, EntryType.keySignature)[0];
    const time = getEntriesAtTick<TimeSignature>(tick, flowEntries, EntryType.timeSignature)[0];
    const barline = getEntriesAtTick<Barline>(tick, flowEntries, EntryType.barline)[0];

    if (time) {
        measurements[WidthOf.time] = time._bounds.width;
    }

    if (key) {
        measurements[WidthOf.key] = key._bounds.width;
    }

    if (barline) {
        if (barline.type === BarlineType.start_repeat) {
            measurements[WidthOf.startRepeat] = barline._bounds.width;
        } else if (barline.type === BarlineType.end_repeat) {
            measurements[WidthOf.endRepeat] = barline._bounds.width;
        } else {
            measurements[WidthOf.barline] = barline._bounds.width;
        }
    } else if (tick !== 0) {
        if (key || time) {
            measurements[WidthOf.barline] = doubleBarline._bounds.width;
        } else if (isFirstBeat) {
            measurements[WidthOf.barline] = normalBarline._bounds.width;
        }
    }

    staves.forEach(stave => {
        const entries = entriesByTick(stave.master.entries.order, stave.master.entries.byKey);
        const clef = getEntriesAtTick<Clef>(tick, entries, EntryType.clef)[0];

        if (clef && clef._bounds.width > measurements[1]) {
            measurements[WidthOf.clef] = clef._bounds.width;
        }

        stave.tracks.order.forEach(trackKey => {
            const notationTrack = notationTracks[trackKey];
            const tones = stave.tracks.byKey[trackKey].entries.byKey;

            if (notationTrack[tick]) {
                const entry = notationTrack[tick];
                if (entry.type === NotationType.note) {
                    for (let i = 0; i < entry.keys.length; i++) {
                        const curr: Entry<Tone> = tones[entry.keys[i]];
                        const next: Entry<Tone> | undefined = tones[entry.keys[i + 1]];
                        if (next) {
                            const offset = getStepsBetweenPitches(curr.pitch, next.pitch);
                            // either 2nd or unison
                            if (offset <= 1 || offset >= -1) {
                                measurements[WidthOf.offsetNoteSlot] = 1;
                            }
                        }
                    }
                }
            }

        });
    });

    return measurements;

}