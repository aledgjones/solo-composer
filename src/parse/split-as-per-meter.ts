import { EntriesByTick } from "../services/track";
import { NotationTrack, Notation } from "./notation-track";
import { getNearestEntryToTick } from "./get-time-signature-at-tick";
import { TimeSignature } from "../entries/time-signature";
import { EntryType } from "../entries";
import { getTicksPerBeat } from "./get-ticks-per-beat";

function seperateAtSplit(event: Notation, start: number, split: number, flow: EntriesByTick, subdivisions: number) {
    const out: NotationTrack = {
        [start]: {
            ...event,
            ties: event.keys,
            duration: split - start
        },
        [split]: {
            ...event,
            duration: start + event.duration - split
        }
    };

    return splitAsPerMeter(subdivisions, flow, out);
}

function splitEventPerMeter(start: number, event: Notation, flow: EntriesByTick, subdivisions: number): NotationTrack {

    const stop = start + event.duration;

    // split in preparation for conversion to note values
    // we never need to do anything on the first tick so add one to the start tick of the loop
    for (let tick = start + 1; tick < stop; tick++) {

        const foundSig = getNearestEntryToTick<TimeSignature>(start, flow, EntryType.timeSignature);
        const { at: timeAt, entry: time } = foundSig ? foundSig : { at: 0, entry: { beats: 4, beatType: 4 } };

        const ticksPerBeat = getTicksPerBeat(subdivisions, time.beatType);
        const isFirstBeat = (tick - timeAt) % (ticksPerBeat * time.beats) === 0;

        if (isFirstBeat) {
            return seperateAtSplit(event, start, tick, flow, subdivisions);
        }

    }

    // if we don't find a split point we return as is
    return { [start]: event };

}

export function splitAsPerMeter(subdivisions: number, flow: EntriesByTick, rhythmTrack: NotationTrack) {

    const events = Object.keys(rhythmTrack);
    const output = events.reduce((track: NotationTrack, startTickStr: string) => {

        const startTick = parseInt(startTickStr);
        const event = track[startTick];

        const out = {
            ...track,
            ...splitEventPerMeter(startTick, event, flow, subdivisions)
        }

        return out;

    }, rhythmTrack);

    return output;
}