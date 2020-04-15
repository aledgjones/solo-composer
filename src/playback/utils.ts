import isString from 'lodash.isstring';

export type Pitch = string | number;

const REGEX = /^([a-gA-G])(#{1,}|b{1,}|x{1,}|)(-?\d*)\s*(.*)\s*$/;
const SEMITONES = [0, 2, 4, 5, 7, 9, 11];
const LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const C0 = 12;

export function getMidiPitchParts(pitch: Pitch): [string, string, number] {
    if (isString(pitch)) {
        const [, letter, acc, octave] = REGEX.exec(pitch) || [];
        return [letter, acc, +octave];
    } else {
        const octave = Math.floor((pitch - C0) / 12);
        const semitones = pitch % 12;
        for (let i = 0; i < SEMITONES.length; i++) {
            const num = SEMITONES[i];
            if (num >= semitones) {
                return [LETTERS[i], Array(num - semitones).fill('b').join(''), octave];
            }
        }
        return ["C", "", 4];
    }
}

export function toMidiPitchNumber(pitch: Pitch): number {
    if (isString(pitch)) {
        const [letter, acc, octave] = getMidiPitchParts(pitch);
        const step = LETTERS.indexOf(letter.toUpperCase());
        const alteration = acc[0] === 'b' ? -acc.length : acc.length;
        const position = SEMITONES[step] + alteration;
        return C0 + position + (12 * octave);
    } else {
        return pitch;
    }
}

export function toMidiPitchString(pitch: Pitch) {
    if (isString(pitch)) {
        return pitch;
    } else {
        const [letter, acc, octave] = getMidiPitchParts(pitch);
        return letter + acc + octave;
    }
}

export function getStepsBetweenPitches(pitchA: Pitch, pitchB: Pitch) {
    const [pitchANote,, pitchAOctave] = getMidiPitchParts(pitchA);
    const [pitchBNote,, pitchBOctave] = getMidiPitchParts(pitchB);
    const octaveOffset = (pitchBOctave - pitchAOctave) * 7;
    return octaveOffset + LETTERS.indexOf(pitchBNote) - LETTERS.indexOf(pitchANote);
}