import { Clef } from "../entries/clef-defs";
import { KeySignature } from "../entries/key-signature";
import { TimeSignature } from "../entries/time-signature";
import { EntryType } from "../entries";
import { EngravingConfig } from "../services/engraving";
import { Stave } from "../services/stave";
import { EntriesByTick, entriesByTick } from "../services/track";
import { getEntriesAtTick } from "./get-entry-at-tick";
import { Barline, createBarline, BarlineType } from "../entries/barline";
import { NotationTracks } from "./notation-track";
import { getStepsBetweenPitches } from "../playback/utils";
import { getStemDirection, Direction } from "./get-stem-direction";
import { getIsRest } from "./is-rest";
import { WidthOf } from "./sum-width-up-to";

export function measureTick(tick: number, isFirstBeat: boolean, flowEntries: EntriesByTick, staves: Stave[], notationTracks: NotationTracks, config: EngravingConfig) {

    const measurements: number[] = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.6];

    // barlines are sometimes implied by a change of key etc.
    // these facilitate measureing what is actually needed
    const normalBarline = createBarline({ type: BarlineType.normal }, 0);
    const doubleBarline = createBarline({ type: BarlineType.double }, 0);

    const key = getEntriesAtTick<KeySignature>(tick, flowEntries, EntryType.keySignature).entries[0];
    const time = getEntriesAtTick<TimeSignature>(tick, flowEntries, EntryType.timeSignature).entries[0];
    const barline = getEntriesAtTick<Barline>(tick, flowEntries, EntryType.barline).entries[0];

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
        const clef = getEntriesAtTick<Clef>(tick, entries, EntryType.clef).entries[0];

        if (clef && clef._bounds.width > measurements[WidthOf.clef]) {
            measurements[WidthOf.clef] = clef._bounds.width;
        }

        stave.tracks.forEach(trackKey => {
            const notationTrack = notationTracks[trackKey];

            // check to see if there are notes in the offset slot
            if (notationTrack[tick]) {
                const entry = notationTrack[tick];
                if (!getIsRest(entry)) {
                    const stemDirection = getStemDirection(entry.tones, clef);
                    // we can only have a preNoteSlot if the stem direction is down
                    if (stemDirection === Direction.down) {
                        for (let i = 0; i < entry.tones.length; i++) {
                            const curr = entry.tones[i];
                            const next = entry.tones[i + 1];
                            if (next) {
                                const offset = getStepsBetweenPitches(curr.pitch, next.pitch);
                                // either 2nd or unison
                                if (offset === 0 || offset === 1) {
                                    // as soon as we've found a shunt we can break
                                    measurements[WidthOf.preNoteSlot] = 1.15;
                                    break;
                                }
                            }
                        }
                    }
                }
            }

        });
    });

    return measurements;

}