import { NotationTrack, Notation } from "./notation-track";

export type Splits = {[tick: number]: boolean};

function applySplit(event: Notation, split: number): NotationTrack {

    const out: NotationTrack = {};

    out[event.tick] = {
        ...event,
        duration: split - event.tick,
        ties: event.keys
    }

    out[split] = {
        ...event,
        tick: split,
        ties: event.ties || [],
        duration: event.tick + event.duration - split
    }

    return out;
}

export function spltNotationTrack(length: number, notationTrack: NotationTrack, splits: Splits): NotationTrack {

    let event: Notation | null = null;

    for (let tick = 0; tick < length; tick++) {

        if (notationTrack[tick]) {
            event = notationTrack[tick];
        }

        if (event && splits[tick]) {
            notationTrack = {
                ...notationTrack,
                ...applySplit(event, tick)
            }
            event = notationTrack[tick];
        }
    }

    return notationTrack;

}