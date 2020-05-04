/**
 * returns the tick index of beat boundries
 */
export function getBeatGroupingBoundries(start: number, ticksPerBeat: number, groupings: number[]) {
    const out = [start];
    const len = groupings.length;
    let progress = start;
    for (let i = 0; i < len; i++) {
        const grouping = groupings[i];
        const ticksInGrouping = grouping * ticksPerBeat;
        progress += ticksInGrouping;
        out.push(progress);
    }

    return out;
}
