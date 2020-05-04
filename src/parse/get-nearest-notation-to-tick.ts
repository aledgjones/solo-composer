import { NotationTrack, Notation } from "./notation-track";

export function getNearestNotationToTick(
    _tick: number,
    track: NotationTrack
): { at: number; entry: Notation } | undefined {
    for (let tick = _tick; tick >= 0; tick--) {
        const entry = track[tick];
        if (entry) {
            return {
                at: tick,
                entry: entry
            };
        }
    }
}
