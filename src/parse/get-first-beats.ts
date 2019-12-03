import { EntriesByTick } from "../services/track";
import { TimeSignature } from "../entries/time-signature";
import { EntryType } from "../entries";
import { getTicksPerBeat } from "./get-ticks-per-beat";
import { getDistanceFromBarline } from "./get-distance-from-barline";
import { getNearestEntryToTick } from "./get-nearest-entry-to-tick";

export function getFirstBeats(length: number, flow: EntriesByTick) {

    const ticks = [];

    let tick = 0;
    while (tick < length) {
        const foundTimeSig = getNearestEntryToTick<TimeSignature>(tick, flow, EntryType.timeSignature);
        const timeSigAt = foundTimeSig ? foundTimeSig.at : 0;
        const timeSig = foundTimeSig && foundTimeSig.entry;
        const ticksPerBeat = getTicksPerBeat(timeSig ? timeSig.subdivisions : 12, timeSig ? timeSig.beatType : 4);

        const isFirstBeat = getDistanceFromBarline(tick, ticksPerBeat, timeSigAt, timeSig) === 0;

        if (isFirstBeat) {
            ticks.push(tick);
        }

        if (!timeSig || timeSig.beats === 0) {
            // if free time we have to go through each tick to find next time signature if there is one.
            tick++;
        } else {
            // we know where the next barline will be if we have a time signature.
            // we just need to check it hasn't changed so leap frog to end of bar.
            tick += ticksPerBeat * timeSig.beats;
        }
    }

    return ticks;

}