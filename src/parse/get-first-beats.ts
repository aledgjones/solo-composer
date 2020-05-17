import { EntriesByTick } from "../services/track";
import { TimeSignature } from "../entries/time-signature";
import { EntryType } from "../entries";
import { getTicksPerBeat } from "./get-ticks-per-beat";
import { getEntriesAtTick } from "./get-entry-at-tick";
import { getIsBeat } from "./get-is-beat";

/**
 * Gets the first beats as number[] where number is tick index
 *
 * returns number[] as this is most useful for splitting into bars
 */
export function getFirstBeats(subdivisions: number, length: number, flow: EntriesByTick) {
    const ticks: { [tick: number]: boolean } = {};
    let timeResult;

    let tick = 0;
    while (tick < length) {
        const result = getEntriesAtTick<TimeSignature>(tick, flow, EntryType.timeSignature);
        if (result.entries[0]) {
            timeResult = result;
        }

        const timeAt = timeResult?.at;
        const timeSig = timeResult?.entries[0];

        const ticksPerBeat = getTicksPerBeat(subdivisions, timeSig?.beatType);
        const isFirstBeat = getIsBeat(tick, ticksPerBeat * (timeSig?.beats || 0), timeAt);

        if (isFirstBeat) {
            ticks[tick] = true;
        }

        tick++;
    }

    return ticks;
}
