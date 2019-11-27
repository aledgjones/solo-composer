import { Entry } from "../entries";
import { TimeSignature } from "../entries/time-signature";

export function getBeatGroupingBoundries(tick: number, ticksPerBeat: number, sigAt: number, sig?: Entry<TimeSignature>) {
    // no sig or free sig, we group by the given beat
    if (!sig) {
        return [];
    }

    const ticksFromStartOfBar = (tick - sigAt) % (ticksPerBeat * sig.beats);
    const start = tick - ticksFromStartOfBar;

    const out = [start];
    const len = sig.groupings.length;
    let progress = start;
    for (let i = 0; i < len - 1; i++) {
        const grouping = sig.groupings[i];
        const ticksInGrouping = grouping * ticksPerBeat;
        progress += ticksInGrouping;
        out.push(progress);
    }

    // push the end of the bar
    out.push(start + ticksPerBeat * sig.beats);

    return out;

}