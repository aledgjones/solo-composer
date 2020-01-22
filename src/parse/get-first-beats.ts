import { EntriesByTick } from "../services/track";
import { TimeSignature } from "../entries/time-signature";
import { EntryType } from "../entries";
import { getTicksPerBeat } from "./get-ticks-per-beat";
import { getDistanceFromBarline } from "./get-distance-from-barline";
import { getNearestEntriesToTick } from "./get-nearest-entry-to-tick";

/**
 * Gets the first beats as number[] where number is tick index
 * 
 * returns number[] as this is most useful for splitting into bars
 */
export function getFirstBeats(length: number, flow: EntriesByTick) {

    const ticks = [];

    let tick = 0;
    while (tick < length) {
        const timeSigResult = getNearestEntriesToTick<TimeSignature>(tick, flow, EntryType.timeSignature);
        const timeSig = timeSigResult.entries[0];
        const ticksPerBeat = getTicksPerBeat(timeSig ? timeSig.subdivisions : 12, timeSig ? timeSig.beatType : 4);

        const isFirstBeat = getDistanceFromBarline(tick, ticksPerBeat, timeSigResult.at, timeSig ? timeSig.beats : undefined) === 0;

        if (isFirstBeat) {
            ticks.push(tick);
        }
        
        tick++;
    }

    return ticks;

}