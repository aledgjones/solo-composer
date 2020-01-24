import { Entry } from "../entries";
import { Clef } from "../entries/clef-defs";
import { Tone } from "../entries/tone";
import { getStepsBetweenPitches } from "../playback/utils";

export enum StemDirection {
    up = 'up',
    down = 'down'
}

export function stepsFromTop(tone?: Entry<Tone>, clef?: Entry<Clef>) {
    if (tone && clef) {
        const toneOffset = getStepsBetweenPitches(clef.pitch, tone.pitch);
        return clef.offset - toneOffset;
    } else {
        return 0;
    }
}

export function stepsFromMiddle(tone?: Entry<Tone>, clef?: Entry<Clef>) {
    if (tone && clef) {
        const toneOffset = stepsFromTop(tone, clef);
        const middleOffset = 4;
        return toneOffset - middleOffset;
    } else {
        return 0;
    }
}

export function getStemDirection(tones: Entry<Tone>[], clef: Entry<Clef>) {
    // tones are sorted by pitch asc so we take first and last for lowest & highest pitch
    const lowest: Entry<Tone> = tones[0];
    const highest: Entry<Tone> = tones[tones.length - 1];
    const distances = [
        stepsFromMiddle(lowest, clef),
        stepsFromMiddle(highest, clef)
    ];

    // equal distance high and low BUT NOT unison or single note
    if (distances[0] !== distances[1] && Math.abs(distances[0]) === Math.abs(distances[1])) {
        return StemDirection.down;
    }

    const farthest = distances.sort((a, b) => Math.abs(a) - Math.abs(b))[1];

    if (farthest > 0) {
        return StemDirection.up;
    } else {
        return StemDirection.down
    }
}