export function getIsBeatGroupingEmpty(start: number, stop: number, i: number, beatGroupingBoundries: number[]) {
    const begining = beatGroupingBoundries[i];
    const end = beatGroupingBoundries[i + 1];

    console.log(start, stop, i);

    return start <= begining && stop >= end;
}