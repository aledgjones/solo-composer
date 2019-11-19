// TONE
// the purely auditory representation of the notes (no individual note values)
// they are converted into note entries for rendering

import shortid from 'shortid';
import { Entry, EntryType } from ".";

export interface ToneDef {
    duration: number; // in ticks
}

export interface Tone extends ToneDef {

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