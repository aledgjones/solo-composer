import { NotationTrack, NotationType, Notation } from "./notation-track";

export function getNearestNotationToTick(_tick: number, track: NotationTrack, type?: NotationType): { at: number, entry: Notation } | undefined {

    for (let tick = _tick; tick >= 0; tick--) {

        const entry = track[tick];
        if (entry && (!type || entry.type === type)) {
            return {
                at: tick,
                entry: entry
            }
        }


    }
}