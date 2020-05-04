import { NotationTrack } from "./notation-track";

export function getIsEmpty(start: number, stop: number, track: NotationTrack) {
    for (let tick = start + 1; tick < stop; tick++) {
        if (track[tick]) {
            return false;
        }
    }

    return true;
}
