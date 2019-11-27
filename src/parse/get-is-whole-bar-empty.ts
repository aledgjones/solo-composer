export function getIsWholeBarEmpty(start: number, stop: number, beatGroupings: number[]) {

    const begining = beatGroupings[0];
    const end = beatGroupings[beatGroupings.length - 1];

    return start <= begining && stop >= end;

}