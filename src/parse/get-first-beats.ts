import { EntriesByTick } from "../services/track";
import { TimeSignature } from "../entries/time-signature";
import { EntryType } from "../entries";
import { getTicksPerBeat } from "./get-ticks-per-beat";
import { getDistanceFromBarline } from "./get-distance-from-barline";
import { getNearestEntriesToTick } from "./get-nearest-entry-to-tick";
import { getEntriesAtTick } from "./get-entry-at-tick";

/**
 * Gets the first beats as number[] where number is tick index
 * 
 * returns number[] as this is most useful for splitting into bars
 */
export function getFirstBeats(length: number, flow: EntriesByTick) {

    const ticks: { [tick: number]: boolean } = {};
    let timeSigResult;

    let tick = 0;
    while (tick < length) {

        const result = getEntriesAtTick<TimeSignature>(0, flow, EntryType.timeSignature);
        if (result.entries[0]) {
            timeSigResult = result;
        }

        const timeSigAt = timeSigResult?.at;
        const timeSig = timeSigResult?.entries[0];

        const ticksPerBeat = getTicksPerBeat(timeSig?.subdivisions, timeSig?.beatType);
        const isFirstBeat = getDistanceFromBarline(tick, ticksPerBeat, timeSigAt, timeSig?.beats) === 0;

        if (isFirstBeat) {
            ticks[tick] = true;
        }

        tick++;
    }

    return ticks;

}