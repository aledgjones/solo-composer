import { entriesByTick } from "../services/track";
import { TimeSignature } from "../entries/time-signature";
import { EntryKey, EntryType } from "../entries";
import { getTicksPerBeat } from "../parse/get-ticks-per-beat";
import { Flow } from "../services/flow";
import { getNearestEntryToTick } from "../parse/get-nearest-entry-to-tick";
import { getIsBeat } from "../parse/get-is-beat";
import { getDistanceFromBarline } from "../parse/get-distance-from-barline";

export interface WrittenTrack {
    _key: EntryKey;
    _tick: number;
}

export function debugTicks(flow: Flow) {

    let debug = '';

    const flowTrack = entriesByTick(flow.master.entries.order, flow.master.entries.byKey);

    // walk through each tick - by definition something could happen on any tick
    for (let tick = 0; tick < flow.length; tick++) {

        const foundTimeSig = getNearestEntryToTick<TimeSignature>(tick, flowTrack, EntryType.timeSignature);
        const timeSig = foundTimeSig && foundTimeSig.entry;
        const timeSigAt = foundTimeSig ? foundTimeSig.at : 0;

        const ticksPerBeat = getTicksPerBeat(timeSig ? timeSig.subdivisions : 12, timeSig ? timeSig.beatType : 4);
        const distanceFromBarline = getDistanceFromBarline(tick, ticksPerBeat, timeSigAt, timeSig);

        const isFirstBeat = distanceFromBarline === 0;
        const isBeat = getIsBeat(tick, ticksPerBeat, timeSigAt);

        if (isFirstBeat) {
            debug += '|';
        } else if (timeSig && timeSig.beats !== 0 && isBeat) {
            debug += '↓';
        } else {
            debug += "'";
        }


    }

    debug += '|';

    console.clear();
    console.log(debug);
}