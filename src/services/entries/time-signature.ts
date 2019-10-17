import shortid from 'shortid';
import { Entry, EntryType } from ".";

export interface TimeSignatureDef {
    count: number;
    beat: number;
}

export interface TimeSignature extends TimeSignatureDef {

}

export function createTimeSignature(def: TimeSignatureDef, tick: number): Entry<TimeSignature> {
    return {
        _type: EntryType.key,
        _key: shortid(),
        _box: { width: 1, height: 1 },
        _offset: { top: 0, left: 0 },
        _tick: tick,

        ...def
    }
}