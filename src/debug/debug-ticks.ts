import { Track, entriesByTick } from "../services/track";
import { TimeSignature } from "../entries/time-signature";
import { EntryKey, Entry, EntryType } from "../entries";
import { getTicksPerBeat } from "../parse/get-ticks-per-beat";
import { Flow } from "../services/flow";

export interface WrittenTrack {
    _key: EntryKey;
    _tick: number;
}

export function debugTicks(flow: Flow) {

    let debug = '';

    const flowTrack = entriesByTick(flow.master.entries.order, flow.master.entries.byKey);

    let lastTimeSignatureChange = 0;
    let beats = 4;
    let ticksPerBeat = 12;

    // walk through each tick - by definition something could happen on any tick
    for (let i = 0; i < flow.length; i++) {

        // get the current timesignature
        if (flowTrack[i]) {
            flowTrack[i].forEach((entry: Entry<any>) => {
                if (entry._type === EntryType.timeSignature) {
                    const sig = entry as Entry<TimeSignature>;
                    lastTimeSignatureChange = i;
                    beats = sig.beats;
                    ticksPerBeat = getTicksPerBeat(flow.subdivisions, sig.beatType);
                }
            });
        }

        const isBeat = (i - lastTimeSignatureChange) % ticksPerBeat === 0;
        const isFirstBeat = ((i - lastTimeSignatureChange) / ticksPerBeat) % beats === 0;

        if (isFirstBeat) {
            debug += "|";
        } else if (isBeat) {
            debug += "|";
        } else {
            debug += "'";
        }


    }

    debug += '|';

    console.clear();
    console.log(debug);
}