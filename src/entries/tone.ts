// TONE
// the purely auditory representation of the notes (no individual note values)
// they are converted into note entries for rendering

import shortid from 'shortid';
import { isString } from 'lodash';
import { Entry, EntryType } from ".";
import { Pitch } from '../playback/patch-player';

export interface ToneDef {
    duration: number; // in ticks
    pitch: string;
}

export interface Tone extends ToneDef {

}

export const C0 = 24;

export function getMIDIPitchValue(pitch: Pitch) {

    if (isString(pitch)) {
        
        const letters = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

        const octave = parseInt(pitch.slice(-1));
        const note = pitch.slice(0, -1);
        const output = C0 + (octave * 12) + letters.indexOf(note);

        return output;
    } else {
        return pitch;
    }

}

export function createTone(def: ToneDef, tick: number): Entry<Tone> {
    return {
        _type: EntryType.tone,
        _key: shortid(),
        _box: { width: 0, height: 4 },
        _bounds: { width: 0, height: 4 },
        _offset: { top: 0, left: 0 },
        _tick: tick,

        ...def
    }
}