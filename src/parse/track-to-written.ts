import { Track, entriesByTick } from "../services/track";
import { EntryKey, Entry, EntryType } from "../entries";
import { Flow } from "../services/flow";
import { Tone } from "../entries/tone";
import shortid from "shortid";
import { TimeSignature } from "../entries/time-signature";

export interface WrittenTrack {
    _key: EntryKey;
    _tick: number;
}

enum DurationType {
    rest,
    note,
    barline
}

interface Rhythm {
    keys: EntryKey[] // these may be repeated if a tone is split up into ties notes
    duration: number;
    type: DurationType;
    ties: EntryKey[];
}

export interface RhythmTrack {
    [tick: number]: Rhythm;
}

export function writtenDurationsFromTrack(_flow: Flow, noteTrack: Track) {

    const output: RhythmTrack = {};

    const flow = entriesByTick(_flow.master.entries.order, _flow.master.entries.byKey);
    const track = entriesByTick(noteTrack.entries.order, noteTrack.entries.byKey);

    let timeSignature = { changed: 0, beats: 4, beatType: 4 };

    let previousEventTick = 0;
    const offs: { [tick: number]: EntryKey[] } = {};

    // walk through each tick - by definition something could happen on any tick
    for (let tick = 0; tick <= _flow.length; tick++) {

        const isLastTick = tick === _flow.length;
        const isFirstTick = tick === 0;

        const FlowEntries = flow[tick] || [];
        const trackEntries = track[tick] || []; // always have something to loop even if empty
        const offEntries = offs[tick] || [];

        const previous = output[previousEventTick];

        // check if the time signature has changed and update values.
        FlowEntries.forEach((entry: Entry<any>) => {
            if (entry._type === EntryType.timeSignature) {
                const sig = entry as Entry<TimeSignature>;
                timeSignature = {
                    changed: tick,
                    beats: sig.beats,
                    beatType: sig.beatType
                }
            }
        });

        const current: Rhythm = { keys: [], duration: 0, type: DurationType.note, ties: [] };
        if (previous && (offEntries.length > 0 || trackEntries.length > 0)) {
            current.keys = previous.keys.filter(key => !offEntries.includes(key));
            previous.ties.push(...current.keys);
            // if the previous note has not finished but we a new note to write,
            // we have to cut previous note length at the current position and set it to tie
            previous.duration = tick - previousEventTick;
            current.duration = tick - previousEventTick + previous.duration
        }

        const notes = trackEntries.reduce((out, entry) => {
            if (entry._type === EntryType.tone) {

                const tone = entry as Entry<Tone>;

                const off = tick + tone.duration;
                if (offs[off]) {
                    offs[off].push(tone._key);
                } else {
                    offs[off] = [tone._key];
                }

                out.keys.push(tone._key);
                if (tone.duration < out.duration) {
                    out.duration = tone.duration;
                }
            }

            return out;
        }, current);

        if (notes.keys.length > 0) {
            output[tick] = notes;
            previousEventTick = tick;
        }

        // if (isLastTick || foundNote && rest > 0) {
        //     output[tick - rest] = { keys: [shortid()], duration: rest, type: DurationType.rest, tied: false };
        //     rest = 0;
        // }

        // if (!foundNote && !foundHold) {
        //     rest++;
        // }

    }

    return output;
}