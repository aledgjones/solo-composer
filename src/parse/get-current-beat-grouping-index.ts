export function getCurrentBeatGroupingIndex(tick: number, beatGroupingBoundries: number[]) {
    let out = 1;
    for (let i = 1; i < beatGroupingBoundries.length; i++) {
        const boundry = beatGroupingBoundries[i];
        if (tick < boundry) {
            out = i - 1;
        }
    }
    return out;
}
