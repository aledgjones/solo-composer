import { EntriesByTick } from "../services/track";
import { TimeSignature } from "../entries/time-signature";
import { EntryType } from "../entries";
import { getTicksPerBeat } from "./get-ticks-per-beat";
import { getDistanceFromBarline } from "./get-distance-from-barline";
import { getNearestEntryToTick } from "./get-nearest-entry-to-tick";

/**
 * Gets the first beats as number[] where number is tick index
 * 
 * returns number[] as this is most useful for splitting into bars
 */
export function getFirstBeats(length: number, flow: EntriesByTick) {

    const ticks = [];

    let tick = 0;
    while (tick < length) {
        const timeSig = getNearestEntryToTick<TimeSignature>(tick, flow, EntryType.timeSignature);
        const ticksPerBeat = getTicksPerBeat(timeSig.entry ? timeSig.entry.subdivisions : 12, timeSig.entry ? timeSig.entry.beatType : 4);

        const isFirstBeat = getDistanceFromBarline(tick, ticksPerBeat, timeSig.at, timeSig.entry ? timeSig.entry.beats : undefined) === 0;

        if (isFirstBeat) {
            ticks.push(tick);
        }
        
        tick++;
    }

    return ticks;

}