import { Track, entriesByTick } from "../services/track";
import { TimeSignature } from "../entries/time-signature";
import { EntryKey, Entry, EntryType } from "../entries";
import { getTicksPerBeat } from "../parse/get-ticks-per-beat";
import { Flow } from "../services/flow";
import { getNearestEntryToTick } from "../parse/get-time-signature-at-tick";

export interface WrittenTrack {
    _key: EntryKey;
    _tick: number;
}

export function debugTicks(flow: Flow) {

    let debug = '';

    const flowTrack = entriesByTick(flow.master.entries.order, flow.master.entries.byKey);

    // walk through each tick - by definition something could happen on any tick
    for (let tick = 0; tick < flow.length; tick++) {

        const foundSig = getNearestEntryToTick<TimeSignature>(tick, flowTrack, EntryType.timeSignature);
        const ticksPerBeat = foundSig ? getTicksPerBeat(flow.subdivisions, foundSig.entry.beatType) : 12;

        const isBeat = (tick - (foundSig ? foundSig.at : 0)) % ticksPerBeat === 0;
        const isFirstBeat = ((tick - (foundSig ? foundSig.at : 0)) / ticksPerBeat) % (foundSig ? foundSig.entry.beats : 4) === 0;

        if (isFirstBeat) {
            debug += '|';
        } else if (isBeat) {
            debug += '↓';
        } else {
            debug += "'";
        }


    }

    debug += '|';

    console.clear();
    console.log(debug);
}