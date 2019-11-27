export function getIsBeatGroupingEmpty(start: number, stop: number, tick: number, beatGroupingBoundries: number[]) {
    for (let i = 0; i < beatGroupingBoundries.length; i++) {
        const begining = beatGroupingBoundries[i];
        const end = beatGroupingBoundries[i + 1];
        if (tick >= begining && tick < end) {
            // we are in the right grouping;
            return start <= begining && stop >= end;
        }
    }

    return true;
}