import { isString } from 'lodash';
import { Pitch } from '../playback/patch-player';

export const C0 = 12;

export function getMIDIPitch(pitch: Pitch) {

    if (isString(pitch)) {

        const letters = [
            ['Cb'],
            ['C'],
            ['C#', 'Db'],
            ['D'],
            ['D#', 'Eb'],
            ['E', 'Fb'],
            ['F', 'E#'],
            ['F#', 'Gb'],
            ['G'],
            ['G#', 'Ab'],
            ['A'],
            ['A#', 'Bb'],
            ['B', 'Cb'],
            ['B#']
        ];
        const octave = parseInt(pitch.slice(-1));
        const note = pitch.slice(0, -1);
        let basePitch = C0 + (octave * 12);
        for (let i = 0; i < letters.length; i++) {
            if (letters[i].includes(note)) {
                // to make Cb in the right octave we need to add this pre C
                // so - 1 from the i value;
                return basePitch + i - 1;
            };
        }
        return basePitch;
    } else {
        return pitch;
    }

}