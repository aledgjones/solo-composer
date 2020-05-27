import { Direction, stepsFromTop } from "./get-stem-direction";
import { Entry } from "../entries";
import { Tone } from "../entries/tone";
import { getStepsBetweenPitches } from "../playback/utils";

export interface ShuntsByKey {
    [toneKey: string]: boolean;
}

export function getShuntedNoteheads(tones: Entry<Tone>[], stemDirection: Direction): [boolean, ShuntsByKey] {
    let hasShunts = false;
    const shuntsByKey: ShuntsByKey = {};

    let cluster = [];

    for (let i = 0; i < tones.length; i++) {
        const curr = tones[i];
        const next = tones[i + 1];
        if (next && getStepsBetweenPitches(curr.pitch, next.pitch) <= 1) {
            cluster.push(curr);
        } else {
            cluster.push(curr);
            if (cluster.length > 1) {
                cluster.forEach((tone, ii) => {
                    const isOddLength = cluster.length % 2 !== 0;
                    const firstNoteheadIsShunted = stemDirection === Direction.up || isOddLength;
                    const shunted = firstNoteheadIsShunted ? ii % 2 !== 0 : ii % 2 === 0;
                    shuntsByKey[tone._key] = shunted;
                    if (shunted) {
                        hasShunts = true;
                    }
                });
            }
            cluster = [];
        }
    }

    return [hasShunts, shuntsByKey];
}
