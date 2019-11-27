import { getMiddleOfBar } from "./get-is-middle-of-bar";

export function getIsHalfBarEmpty(start: number, stop: number, tick: number, beatGroupings: number[]) {

    const middle = getMiddleOfBar(beatGroupings);
    const begining = tick < middle ? beatGroupings[0] : middle;
    const end = tick < middle ? middle : beatGroupings[beatGroupings.length - 1];

    return start <= begining && stop >= end;

}